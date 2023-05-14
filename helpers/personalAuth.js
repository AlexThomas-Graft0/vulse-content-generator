export const LINKEDIN_STATE = process.env.LINKEDIN_STATE;
const LINKEDIN_SCOPE = process.env.LINKEDIN_SCOPE;
const PERSONAL_LINKEDIN_REDIRECT = process.env.PERSONAL_LINKEDIN_REDIRECT;
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;

export const getURLWithQueryParams = (base, params) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  return `${base}?${query}`;
};

export const PERSONAL_LINKEDIN_URL = getURLWithQueryParams(
  "https://www.linkedin.com/oauth/v2/authorization",
  {
    response_type: "code",
    client_id: LINKEDIN_CLIENT_ID,
    redirect_uri: PERSONAL_LINKEDIN_REDIRECT,
    state: LINKEDIN_STATE,
    scope: LINKEDIN_SCOPE,
  }
);

//hvae to wait for access in linkedin tobe able to retrieve a users posts
// can I set up some sort of automation to scrape them for the time being?
