import axios from "../axios";
const handleLoginApi = (userEmail, userPassword) => {
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};
const getAllUsers = (inputId) => {
  // eslint-disable-next-line no-template-curly-in-string
  return axios.get("/api/get-all-users?id=" + inputId);
};

const createNewUserS = (data) => {
  console.log("check data in react ", data);

  return axios.post("/api/create-new-user", data);
};

const deleteUser = (userId) => {
  return axios.delete("/api/delete-user", { data: { id: userId } });
};

const editUserService = (inputData) => {
  return axios.put("/api/edit-user", inputData);
};
const getAllCodeService = (inputType) => {
  return axios.get("/api/allcode?type=" + inputType);
};
const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};
const getAllDoctors = () => {
  return axios.get("/api/get-all-doctors");
};
const saveDetailDoctorService = (data) => {
  return axios.post("/api/save-info-doctors", data);
};
const getDetailInfoDoctor = (inputId) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`);
};
const saveBulkScheduleDoctor = (data) => {
  return axios.post("/api/bulk-create-schedule", data);
};
const getScheduleByDateAndDoctor = (doctorId, date) => {
  return axios.get(
    `/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`
  );
};
const getExtraInfoDoctorById = (doctorId) => {
  return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`);
};
export {
  getExtraInfoDoctorById,
  getScheduleByDateAndDoctor,
  saveBulkScheduleDoctor,
  editUserService,
  deleteUser,
  handleLoginApi,
  getAllUsers,
  createNewUserS,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctors,
  saveDetailDoctorService,
  getDetailInfoDoctor,
};
