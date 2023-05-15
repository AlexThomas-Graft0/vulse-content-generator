import { getURLWithQueryParams } from "../../../../helpers/personalAuth";

const personalLinkedin = async (req, res) => {
  const LINKEDIN_URL = getURLWithQueryParams(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: process.env.PERSONAL_LINKEDIN_REDIRECT,
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

  res.setHeader(
    "Set-Cookie",
    `access_token=${access_token}; expires=${new Date(
      Date.now() + expires_in * 1000
    ).toUTCString()}; path=/; HttpOnly`
  );
  res.redirect("https://vulse-content-generator.vercel.app");
};

export default personalLinkedin;
