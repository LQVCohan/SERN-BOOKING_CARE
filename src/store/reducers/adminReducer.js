import actionTypes from "../actions/actionTypes";

const initialState = {
  genders: [],
  roles: [],
  position: [],
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_GENDER_START:
      return {
        ...state,
      };
    case actionTypes.FETCH_GENDER_SUCCESS:
      let copyState = { ...state };
      copyState.genders = action.data;
      console.log("fetch gender success", copyState);
      return {
        ...copyState,
      };

    case actionTypes.FETCH_GENDER_FAIL:
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default adminReducer;
