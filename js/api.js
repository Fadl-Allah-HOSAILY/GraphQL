import {  query } from "./query.js";

export async function fetchUserData(token) {
  const res = await fetch(
    "https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        query: query
      })
    }
  );

  return res.json();
}