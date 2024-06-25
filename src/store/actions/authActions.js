import { postForgotPassword } from "../../services/userService";

export const FORGOT_PASSWORD_REQUEST = "FORGOT_PASSWORD_REQUEST";
export const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS";
export const FORGOT_PASSWORD_FAILURE = "FORGOT_PASSWORD_FAILURE";

export const forgotPassword = (email) => {
  return async (dispatch) => {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });
    try {
      const response = await postForgotPassword(email);
      dispatch({
        type: FORGOT_PASSWORD_SUCCESS,
        payload: response.data, // Assuming your API returns a success message or similar
      });
    } catch (error) {
      dispatch({
        type: FORGOT_PASSWORD_FAILURE,
        payload: error.response.data.message, // Assuming your API returns an error message
      });
    }
  };
};
