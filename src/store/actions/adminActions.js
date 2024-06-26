import actionTypes from "./actionTypes";
import { toast } from "react-toastify";
import {
  getAllCodeService,
  createNewUserS,
  getAllUsers,
  deleteUser,
  editUserService,
  getTopDoctorHomeService,
  getAllDoctors,
  saveDetailDoctorService,
  getAllSpecialty,
  getAllClinic,
} from "../../services/userService";

export const fetchGenderStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_GENDER_START,
      });

      let res = await getAllCodeService("GENDER");
      console.log("adminAction gender data", res.data);
      if (res && res.errCode === 0) {
        dispatch(fetchGenderSuccess(res.data));
      } else {
        dispatch(fetchGenderFail());
      }
    } catch (error) {
      dispatch(fetchGenderFail());
      console.log("fetchGenderStart error ", error);
    }
  };
};
export const fetchGenderSuccess = (genderData) => ({
  type: actionTypes.FETCH_GENDER_SUCCESS,
  data: genderData,
});
export const fetchGenderFail = () => ({
  type: actionTypes.FETCH_GENDER_FAIL,
});
export const fetchPositionSuccess = (positionData) => ({
  type: actionTypes.FETCH_POSITION_SUCCESS,
  data: positionData,
});
export const fetchPositionFail = () => ({
  type: actionTypes.FETCH_POSITION_FAIL,
});
export const fetchRoleSuccess = (roleData) => ({
  type: actionTypes.FETCH_ROLE_SUCCESS,
  data: roleData,
});
export const fetchRoleFail = () => ({
  type: actionTypes.FETCH_ROLE_FAIL,
});

export const fetchPositionStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("POSITION");
      if (res && res.errCode === 0) {
        dispatch(fetchPositionSuccess(res.data));
      } else {
        dispatch(fetchPositionFail());
      }
    } catch (error) {
      dispatch(fetchRoleFail());
      console.log("fetchPositionStart error ", error);
    }
  };
};
export const fetchRoleStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("ROLE");
      if (res && res.errCode === 0) {
        dispatch(fetchRoleSuccess(res.data));
      } else {
        dispatch(fetchRoleFail());
      }
    } catch (error) {
      dispatch(fetchRoleFail());
      console.log("fetchRoleStart error ", error);
    }
  };
};
export const createNewUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewUserS(data);
      console.log("cohan check create user redux", res);
      if (res && res.errCode === 0) {
        toast.success("Done!");
        dispatch(saveUserSuccess());
        dispatch(fetchAllUsersStart());
      } else {
        dispatch(saveUserFail());
      }
    } catch (error) {
      dispatch(saveUserFail());
      console.log("Save User error ", error);
    }
  };
};
export const saveUserSuccess = () => ({
  type: "CREATE_USER_SUCCESS",
});
export const saveUserFail = () => ({
  type: "CREATE_USER_FAIL",
});
export const fetchAllUsersStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllUsers("ALL");
      if (res && res.errCode === 0) {
        dispatch(fetchAllUsersSuccess(res.users.reverse()));
      } else {
        dispatch(fetchAllUsersFail());
      }
    } catch (error) {
      dispatch(fetchAllUsersFail());
      console.log("fetchRoleStart error ", error);
    }
  };
};
export const fetchAllUsersSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_USERS_SUCCESS,
  user: data,
});
export const fetchAllUsersFail = () => ({
  tpye: actionTypes.FETCH_ALL_USERS_FAIL,
});
export const deleteAUser = (id) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteUser(id);
      if (res && res.errCode === 0) {
        toast.success("Deleted !");
        dispatch(deleteUserSuccess());
        dispatch(fetchAllUsersStart());
      } else {
        dispatch(deleteUserFail());
      }
    } catch (error) {
      toast.error("Error in delete a user");
      dispatch(deleteUserFail());
      console.log("Delete User error ", error);
    }
  };
};
export const deleteUserSuccess = () => ({
  type: actionTypes.DELETE_USER_SUCCESS,
});
export const deleteUserFail = () => ({
  type: actionTypes.DELETE_USER_FAIL,
});

export const editAUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await editUserService(data);
      if (res && res.errCode === 0) {
        toast.success("Updated !");
        dispatch(editUserSuccess());
        dispatch(fetchAllUsersStart());
      } else {
        dispatch(editUserFail());
      }
    } catch (error) {
      toast.error("Error in update a user");
      dispatch(editUserFail());
      console.log("Update user error ", error);
    }
  };
};
export const editUserSuccess = () => ({
  type: actionTypes.EDIT_USER_SUCCESS,
});
export const editUserFail = () => ({
  type: actionTypes.EDIT_USER_FAIL,
});
// let res1 = await getTopDoctorHomeService(2);

export const fetchTopDoctor = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getTopDoctorHomeService("");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
          dataDoctors: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTORS_FAIL,
        });
      }
    } catch (error) {
      console.log("FETCH_TOP_DOCTORS_FAIL ", error);
      dispatch({
        type: actionTypes.FETCH_TOP_DOCTORS_FAIL,
      });
    }
  };
};
export const fetchAllDoctors = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllDoctors();
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
          dataDoctors: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTORS_FAIL,
        });
      }
    } catch (error) {
      console.log("FETCH_ALL_DOCTORS_FAIL ", error);
      dispatch({
        type: actionTypes.FETCH_ALL_DOCTORS_FAIL,
      });
    }
  };
};
export const saveDetailDoctor = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await saveDetailDoctorService(data);
      console.log("res info:", res);
      if (res && res.errCode === 0) {
        toast.success("Save doctor's detail infomation success!");

        dispatch({
          type: actionTypes.FETCH_SAVE_DETAIL_DOCTOR_SUCCESS,
        });
      } else {
        toast.error("Save doctor's detail infomation fail!");
        dispatch({
          type: actionTypes.FETCH_SAVE_DETAIL_DOCTOR_FAIL,
        });
      }
    } catch (error) {
      toast.error("Save doctor's detail infomation fail!, error: ", error);

      console.log("FETCH_SAVE_DETAIL_DOCTOR_FAIL ", error);
      dispatch({
        type: actionTypes.FETCH_SAVE_DETAIL_DOCTOR_FAIL,
      });
    }
  };
};
export const fetchAllScheduleTime = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("TIME");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
          dataTime: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAIL,
        });
      }
    } catch (error) {
      console.log("FETCH_ALLCODE_SCHEDULE_TIME_FAIL ", error);
      dispatch({
        type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAIL,
      });
    }
  };
};

export const getRequiredDoctorInfo = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_START,
      });
      let resStatus = await getAllCodeService("DOCTOR_STATUS");
      let resPrice = await getAllCodeService("PRICE");
      let resPayment = await getAllCodeService("PAYMENT");
      let resProvince = await getAllCodeService("PROVINCE");
      let resSpecialty = await getAllSpecialty();
      let resClinic = await getAllClinic();
      if (
        resPrice &&
        resPrice.errCode === 0 &&
        resPayment &&
        resPayment.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0 &&
        resSpecialty &&
        resSpecialty.errCode === 0 &&
        resClinic &&
        resClinic.errCode === 0 &&
        resStatus &&
        resStatus.errCode === 0
      ) {
        let data = {
          resPrice: resPrice.data,
          resPayment: resPayment.data,
          resProvince: resProvince.data,
          resSpecialty: resSpecialty.data,
          resClinic: resClinic.data,
          resStatus: resStatus.data,
        };
        console.log("what data is it: ", data);
        dispatch(fetchRequiredDoctorInfoSuccess(data));
      } else {
        dispatch(fetchRequiredDoctorInfoFail());
      }
    } catch (error) {
      dispatch(fetchRequiredDoctorInfoFail());
      console.log("fetchRequiredDoctorInfoFail error ", error);
    }
  };
};
export const fetchRequiredDoctorInfoSuccess = (requiredData) => ({
  type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS,
  data: requiredData,
});
export const fetchRequiredDoctorInfoFail = () => ({
  type: actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAIL,
});
