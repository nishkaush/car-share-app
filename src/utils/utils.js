import decode from "jwt-decode";
import axios from "axios";
import auth0 from "auth0-js";
import Router from "vue-router";
import Auth0Lock from "auth0-lock";

let myAuth = new auth0.WebAuth({
  domain: "pms.au.auth0.com",
  clientID: "zV********9GS*****f5r"
});

export function login() {
  myAuth.authorize({
    redirectUri:
      "http://car-share-app.s3-website-ap-southeast-2.amazonaws.com/callback",
    audience: "https://pms.au.auth0.com/userinfo",
    responseType: "token id_token",
    scope: "openid profile",
    user_metadata: { plan: "silver", team_id: "a111" }
  });
}

export function getTokenByName(name) {
  let match = RegExp("[#&]" + name + "=([^&]*)").exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

export function setIdToken() {
  let idToken = getTokenByName("id_token");
  if (idToken) {
    sessionStorage.setItem("IdToken", idToken);
    return true;
  }
  return false;
}

export function setAccessToken() {
  let accessToken = getTokenByName("id_token");
  if (accessToken) {
    sessionStorage.setItem("AccessToken", accessToken);
  }
}

export function getIdToken() {
  return sessionStorage.getItem("IdToken");
}

export function getAccessToken() {
  return sessionStorage.getItem("AccessToken");
}

export function clearAllTokens() {
  sessionStorage.removeItem("IdToken");
  // sessionStorage.removeItem("AccessToken");
}

export function sessionIsValid() {
  let idToken = getIdToken();
  const timeNow = parseInt(
    (new Date("2012.08.10").getTime() / 1000).toFixed(0)
  );
  if (idToken) {
    const decodedToken = decode(idToken);
    if (decodedToken.exp > timeNow) {
      return true;
    }
    return false;
  }
  return false;
}
