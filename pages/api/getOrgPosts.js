const getPosts = async (req, res, access_token) => {
  if (!access_token || access_token === "undefined") {
    return [];
  }

  const orgInfoUrl =
    "https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organizationalTarget~(localizedName)))";
  const orgInfoResponse = await fetch(orgInfoUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });
  const orgInfo = await orgInfoResponse.json();

  const orgURN = orgInfo?.elements[0]?.organizationalTarget;
  const orgID = orgURN.split(":")[3];
  const vulseOrgID = "42473684";

  //TODO change this back to orgURN instead of vulseOrgID
  const postUrl = `https://api.linkedin.com/rest/posts?author=urn%3Ali%3Aorganization%3A${orgID}&q=author&count=10`;
  const response = await fetch(postUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": "202301",
    },
  });
  const removeURNAndSanitizeHashtags = (post) => {
    const regex = /urn:li:organization:\d+/g;
    const regex2 = /{hashtag\|\\#\|(\w+)}/g;
    const regex3 = /urn:li:person:\w+/g;

    const newPost = post
      .replace(regex, "")
      .replace(regex2, "#$1")
      .replace(regex3, "");

    return newPost;
  };

  try {
    const posts = await response.json();
    const newPosts = posts.elements
      .map((post) => {
        if (post.commentary.length > 0) {
          return {
            content: removeURNAndSanitizeHashtags(post.commentary),
          };
        }
      })
      .filter((post) => post !== undefined);

    return newPosts;
  } catch (error) {
    console.log(error);
  }
};

export default async function handler(req, res) {
  const cookies = req.query;
  const access_token = cookies.access_token;

  if (access_token) {
    const posts = await getPosts(req, res, access_token);
    res.status(200).json(posts);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}
