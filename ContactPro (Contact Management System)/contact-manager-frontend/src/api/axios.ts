import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
});

// ✅ Set Basic Auth header
export const setAuth = (
  username: string,
  passwordOrToken: string,
  isToken = false
) => {
  let encoded;

  if (isToken) {
    encoded = passwordOrToken;
  } else {
    encoded = btoa(`${username}:${passwordOrToken}`);
  }

  api.defaults.headers.common["Authorization"] = `Basic ${encoded}`;
};

// ✅ Clear auth header on logout
export const clearAuth = () => {
  delete api.defaults.headers.common["Authorization"];
};

export default api;