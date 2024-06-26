import { fetchAllScheduleTime } from "../actions";
import actionTypes from "../actions/actionTypes";

const initialState = {
  isLoadingGender: false,
  genders: [],
  roles: [],
  positions: [],
  user: [],
  topDoctors: [],
  allDoctors: [],
  allScheduleTime: [],
  allRequiredDoctorInfo: [],
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_GENDER_START:
      state.isLoadingGender = true;
      console.log("fetch gender success", state);
      return {
        ...state,
      };
    case actionTypes.FETCH_GENDER_SUCCESS:
      state.genders = action.data;
      state.isLoadingGender = false;
      return {
        ...state,
      };

    case actionTypes.FETCH_GENDER_FAIL:
      state.genders = [];
      state.isLoadingGender = false;
      return {
        ...state,
      };
    case actionTypes.FETCH_POSITION_SUCCESS:
      state.positions = action.data;
      return {
        ...state,
      };

    case actionTypes.FETCH_POSITION_FAIL:
      state.positions = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_ROLE_SUCCESS:
      state.roles = action.data;
      return {
        ...state,
      };

    case actionTypes.FETCH_ROLE_FAIL:
      state.roles = [];
      return {
        ...state,
      };

    case actionTypes.FETCH_ALL_USERS_SUCCESS:
      state.user = action.user;

      console.log("check user - reducer", state.user);
      return {
        ...state,
      };
    case actionTypes.FETCH_ALL_USERS_FAIL:
      state.user = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_TOP_DOCTORS_FAIL:
      state.topDoctors = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
      state.topDoctors = action.dataDoctors;
      return {
        ...state,
      };
    case actionTypes.FETCH_ALL_DOCTORS_FAIL:
      state.allDoctors = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
      state.allDoctors = action.dataDoctors;
      return {
        ...state,
      };
    case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAIL:
      state.allScheduleTime = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
      state.allScheduleTime = action.dataTime;
      return {
        ...state,
      };
    case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_FAIL:
      state.allRequiredDoctorInfo = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_REQUIRED_DOCTOR_INFO_SUCCESS:
      state.allRequiredDoctorInfo = action.data;
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default adminReducer;
