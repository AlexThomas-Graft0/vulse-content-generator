import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";

import { getURLWithQueryParams } from "../../../../helpers/auth";

const linkedin = async (req, res) => {
  const LINKEDIN_URL = getURLWithQueryParams(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: process.env.LINKEDIN_REDIRECT,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    }
  );
  let tok;
  let resp = await fetch(LINKEDIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (resp.ok) tok = await resp.json();

  let access_token = "";
  let expires_in = 5184000;

  if (tok) {
    access_token = tok.access_token;
    expires_in = tok.expires_in;
  }

  console.log("access_tokennn", access_token);
  setCookie("access_token", access_token, { req, res, maxAge: 60 * 60 * 24 });

  const meDataUrl = "https://api.linkedin.com/v2/me";
  const meDataResponse = await fetch(meDataUrl, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });
  const userData = await meDataResponse.json();
  console.log({ userData });
  const userID = userData.id;
  setCookie("userData", userData, { req, res, maxAge: 60 * 60 * 24 });

  // const orgInfoUrl =
  //   "https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organizationalTarget~(localizedName)))";
  // const orgInfoResponse = await fetch(orgInfoUrl, {
  //   method: "GET",
  //   headers: {
  //     Authorization: "Bearer " + access_token,
  //     "X-Restli-Protocol-Version": "2.0.0",
  //   },
  // });
  // const orgInfo = await orgInfoResponse.json();
  // // console.log(orgInfo.elements);

  // const orgURN = orgInfo.elements[0].organizationalTarget;
  // const orgID = orgURN.split(":")[3];
  // console.log({ orgURN, orgID });

  //
  // const vulseOrgID = "42473684";

  // // orgID || userID
  // // urn:li:person:A4qHlJ6XF9
  // const postUrl = `https://api.linkedin.com/rest/posts?author=urn%3Ali%3Aorganization%3A${vulseOrgID}&q=author&count=3`;
  // const response = await fetch(postUrl, {
  //   method: "GET",
  //   headers: {
  //     Authorization: "Bearer " + access_token,
  //     "X-Restli-Protocol-Version": "2.0.0",
  //     "LinkedIn-Version": "202301",
  //   },
  // });

  // console.log(response);

  // try {
  //   const posts = await response.json();
  //   // console.log(posts.elements[0]);
  //   const newPosts = posts.elements.map((post) => {
  //     if (post.commentary.length > 0) {
  //       return {
  //         id: post.id,
  //         text: post.commentary,
  //       };
  //     }
  //   });
  //   // console.log(newPosts);
  // } catch (error) {
  //   console.log(error);
  // }

  //

  //redirect to home page
  res.redirect("http://localhost:3000");

  //   // Set cookie
  //   res.setHeader(
  //     "Set-Cookie",
  //     `access_token=${access_token}; expires=${new Date(
  //       Date.now() + expires_in * 1000
  //     ).toUTCString()}; path=/; HttpOnly`
  //   );
  // console.log({ access_token });
  // const userInfoUrl = "https://api.linkedin.com/v2/me";
  // const response = await fetch(userInfoUrl, {
  //   method: "GET",
  //   headers: { Authorization: "Bearer " + access_token },
  // });
  // const userInfo = await response.json();

  // console.log(userInfo);
  // res.json(userInfo);

  //   // Redirect to home page
  //   res.redirect("http://localhost:3000");
};

export default linkedin;
