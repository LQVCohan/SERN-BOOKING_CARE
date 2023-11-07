import axios from "../axios";
const handleLoginApi = (userEmail, userPassword) => {
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};
const getAllUsers = (inputId) => {
  // eslint-disable-next-line no-template-curly-in-string
  return axios.get("/api/get-all-users?id=" + inputId);
};
export { handleLoginApi, getAllUsers };
