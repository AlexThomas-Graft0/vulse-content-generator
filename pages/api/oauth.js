import { getURLWithQueryParams } from "../../helpers/auth"; // import Spinner from "../../assets/icons/Spinner";

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-t-2 border-gray-900"></div>
  </div>
);
const Oauth = async (req, res) => {
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

  let access_token =
    "AQWTaSirIvz29WdvxzC3J0ZvS26NvLa1yDdpJrword8_VKJumef-QIOor73SohM3_uk8adTLmbZJBr98Z3QKfdkJfek1W5CnNi_Le8zz5b2AqZ_13JJG7se2cloQcu5OaqNRebe7tdC3Oym-Ga91SRRFXCTOvSf0bX-tlXR9jDnrHRyymOdMcY23CWu9BIfPdeMAO_kQ-5uDLK5P8dj1T73-LX2buvLBjBdgSWRwkgSUMalSxUf6S0KPJp4kFVdxF4hs5mymcB_DyOGRFgQ-KRKASs4Vl-MGHWm12AS_P0NCnR0trxRAo3rA-GVJGfk6lq1dEcNm2elsDGZ7mjm9Ina_LHFPsw";
  let expires_in = 5184000;

  if (tok) {
    access_token = tok.access_token;
    expires_in = tok.expires_in;
  }

  console.log("access_token", access_token);

  // Fetch posts
  //   const postUrl = "https://api.linkedin.com/v2/posts";
  //   const postUrl =
  //     "https://api.linkedin.com/v2/userinfo";
  //   const response = await fetch(postUrl, {
  //     method: "GET",
  //     headers: { Authorization: "Bearer " + access_token },
  //   });
  //   const posts = await response.json();

  //   console.log(posts);

  //   // Set cookie
  //   res.setHeader(
  //     "Set-Cookie",
  //     `access_token=${access_token}; expires=${new Date(
  //       Date.now() + expires_in * 1000
  //     ).toUTCString()}; path=/; HttpOnly`
  //   );

  const userInfoUrl = "https://api.linkedin.com/v2/userinfo";
  const response = await fetch(userInfoUrl, {
    method: "GET",
    headers: { Authorization: "Bearer " + access_token },
  });
  const userInfo = await response.json();

  console.log(userInfo);
  res.json(userInfo);

  //   // Redirect to home page
  //   res.redirect("http://localhost:3000");
};

export default Oauth;
