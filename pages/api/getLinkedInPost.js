// // Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// export default async function handler(req, res) {
//   let access_token = req.query.access_token;

//     console.log("access_token", access_token);

//   // Fetch posts
//   const postUrl = "https://api.linkedin.com/v2/userInfo";
//   const response = await fetch(postUrl, {
//     method: "GET",
//     headers: { Authorization: "Bearer " + access_token },
//   });
//   const posts = await response.json();

//   console.log({ posts });

//   res.json(posts);
// }
