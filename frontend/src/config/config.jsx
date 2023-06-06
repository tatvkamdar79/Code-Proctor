const socketURL =
  process.env.NODE_ENV == "production" ? "/" : "http://localhost:9000";

const baseURL = "http://localhost:8080";

export { baseURL, socketURL };
