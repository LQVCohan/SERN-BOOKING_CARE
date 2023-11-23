import axios from "../axios";
const handleLoginApi = (userEmail, userPassword) => {
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};
const getAllUsers = (inputId) => {
  // eslint-disable-next-line no-template-curly-in-string
  return axios.get("/api/get-all-users?id=" + inputId);
};

const createNewUserS = (data) => {
  return axios.post("/api/create-new-user", data);
};

const deleteUser = (userId) => {
  return axios.delete("/api/delete-user", { data: { id: userId } });
};

const editUserService = (inputData) => {
  return axios.put("/api/edit-user", inputData);
};
export {
  editUserService,
  deleteUser,
  handleLoginApi,
  getAllUsers,
  createNewUserS,
};
