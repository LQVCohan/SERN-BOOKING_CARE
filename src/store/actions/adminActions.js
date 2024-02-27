import actionTypes from "./actionTypes";
import { getAllCodeService } from "../../services/userService";
export const fetchGenderStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("GENDER");
      console.log("adminAction gender data", res.data);
      if (res && res.errCode === 0) {
        dispatch(fetchGenderSuccess(res));
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
