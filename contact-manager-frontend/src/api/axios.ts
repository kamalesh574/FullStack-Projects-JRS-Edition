import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuth = (username: string, password: string) => {
  api.defaults.auth = {
    username,
    password,
  };
};

export default api;