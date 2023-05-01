import React from "react";
import { PERSONAL_LINKEDIN_URL } from "../helpers/personalAuth";

export default function PersonalConnect() {
  return (
    <>
      <a href={PERSONAL_LINKEDIN_URL}>
        <div type="submit" style={{ height: "40px", width: "215px" }}>
          Get Personal Posts
        </div>
      </a>
    </>
  );
}
