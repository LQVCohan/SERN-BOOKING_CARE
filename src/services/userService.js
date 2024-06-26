import axios from "../axios";
var qs = require("qs");
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
const getProfileDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};
const postPatientBookAppointment = (data) => {
  return axios.post("/api/patient-booking", data);
};
const getProfilePatientById = (patientId) => {
  return axios.get(`/api/get-profile-patient-by-id?patientId=${patientId}`);
};
const postVerifyBooking = (data) => {
  return axios.post("/api/verify-booking", data);
};
const createSpecialty = (data) => {
  return axios.post("/api/create-new-specialty", data);
};
const deleteSpecialty = (id) => {
  return axios.delete(`/api/delete-specialty/${id}`);
};
const updateSpecialty = (data) => {
  return axios.put("/api/update-specialty", data);
};

const getAllSpecialty = () => {
  return axios.get("/api/get-specialty");
};
const getDetailSpecialtyById = (data) => {
  return axios.get(
    `/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`
  );
};
const createClinic = (data) => {
  return axios.post("/api/create-new-clinic", data);
};
const getAllClinic = () => {
  return axios.get("/api/get-clinic");
};
const updateClinic = (clinicData) => {
  return axios.put(`/api/update-clinic`, clinicData);
};
const deleteClinic = (clinicId) => {
  return axios.delete(`/api/delete-clinic/${clinicId}`);
};

const getDetailClinicById = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`);
};
const getListPatient = (data) => {
  return axios.get(
    `api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`
  );
};
const postSendRemedy = (data) => {
  return axios.post("/api/send-remedy", data);
};
const searchInfoByAnyThing = (data) => {
  return axios.get(`/api/search?term=${data.term}&type=${data.type}`);
};
const getTotalSheduleOfDoctor = (doctorId) => {
  return axios.get(`/api/get-total-schedule-of-doctor?doctorId=${doctorId}`);
};
const getStatusByPatientId = (data) => {
  return axios.get(
    `/api/get-status-by-patient-id?doctorId=${data.doctorId}&patientId=${data.patientId}&date=${data.date}&timeType=${data.timeType}`
  );
};
const getAllBookingById = (patientId) => {
  return axios.get(`/api/get-all-booking-by-id?patientId=${patientId}`);
};
const changeStatusScheduleDoctorByTime = (data) => {
  return axios.put(`/api/change-status-schedule-by-time`, {
    data: {
      doctorId: data.doctorId,
      date: data.date,
      timeType: data.timeType,
      statusId: data.statusId,
    },
  });
};
const UpdateStatusPatientByRequest = (data) => {
  return axios.put("/api/edit-status-patient-by-request", data);
};
const getDataChartById = (data) => {
  return axios.get(`/api/get-data-chart-by-id`, {
    params: { doctorId: data.doctorId, arrDate: data.arrDate },
    paramsSerializer: (params) => {
      return qs.stringify(params);
    },
  });
};
const getPasswordById = (data) => {
  console.log("check id, pass: ", data.id, data.password);
  return axios.get(
    `/api/get-password-by-id?id=${data.id}&password=${data.password}`
  );
};
const postChangePassword = (data) => {
  return axios.post(
    `/api/change-password?id=${data.id}&password=${data.password}`
  );
};
const getAllHistoryByDoctorId = (doctorId) => {
  return axios.get(`/api/get-all-history-by-doctor-id?doctorId=${doctorId}`);
};
const postForgotPassword = async (email) => {
  try {
    const response = await axios.post("/api/forgot-password", { email });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
};
export {
  postForgotPassword,
  deleteClinic,
  updateClinic,
  updateSpecialty,
  deleteSpecialty,
  getAllHistoryByDoctorId,
  getAllBookingById,
  getProfilePatientById,
  getTotalSheduleOfDoctor,
  getStatusByPatientId,
  UpdateStatusPatientByRequest,
  postChangePassword,
  getPasswordById,
  getDataChartById,
  changeStatusScheduleDoctorByTime,
  searchInfoByAnyThing,
  postSendRemedy,
  getListPatient,
  getDetailClinicById,
  getAllClinic,
  createClinic,
  getDetailSpecialtyById,
  getAllSpecialty,
  postPatientBookAppointment,
  createSpecialty,
  getExtraInfoDoctorById,
  getProfileDoctorById,
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
  postVerifyBooking,
};
