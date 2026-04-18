import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

const APIWITHTOKEN = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  }
});

// This runs before every request, reading token fresh each time
APIWITHTOKEN.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenHoYo");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export { API, APIWITHTOKEN };