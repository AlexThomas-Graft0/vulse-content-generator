import { setCookie } from "cookies-next";

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
  setCookie("userData", userData, { req, res, maxAge: 60 * 60 * 24 });

  res.redirect("https://vulse-content-generator.vercel.app/");
};

export default linkedin;
