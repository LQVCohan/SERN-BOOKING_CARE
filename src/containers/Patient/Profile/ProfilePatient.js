import React, { Component } from "react";
import { connect } from "react-redux";
import "./ProfilePatient.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import { LANGUAGES, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import {
  getProfilePatientById,
  editUserService,
} from "../../../services/userService";
import LoadingOverlay from "react-loading-overlay";
import moment from "moment";
import validator from "validator";
import { MdErrorOutline } from "react-icons/md";
import ChangePassword from "../../System/Doctor/Modal/ChangePassword";
import DatePicker from "react-flatpickr";
import { toast } from "react-toastify";
import HomeFooter from "../../HomePage/HomeFooter";

class ProfilePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listGenders: [],
      selectedGender: "",
      birthDate: "",
      address: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      genderId: "",
      imageBase64: "",
      isLoading: false,
      isValidEmailInput: true,
      isValidFirstNameInput: true,
      isValidLastNameInput: true,
      isValidPhoneNumberInput: true,
      isOpenModal: false,
    };
  }

  buildOptionGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data) {
      let object = {};
      object.label = language === LANGUAGES.VI ? data.valueVi : data.valueEn;
      object.value = data.keyMap;
      result.push(object);
    }
    return result;
  };

  getProfileData = async () => {
    try {
      let { user } = this.props;
      this.setState({
        isLoading: true,
      });

      let listGenders = this.props.genders;
      let res = await getProfilePatientById(user.id);

      if (res.data) {
        let {
          email,
          phoneNumber,
          address,
          genderId,
          birth,
          image: imageBase64,
          firstName,
          lastName,
        } = res.data;

        let selectedGenderId = listGenders.find(
          (item) => item && item.keyMap === genderId
        );
        let selectedGender = this.buildOptionGender(selectedGenderId);

        this.setState({
          email,
          phoneNumber,
          address,
          genderId,
          imageBase64,
          firstName,
          lastName,
          selectedGender,
          birthDate: moment.unix(+birth / 1000).valueOf(),
          isLoading: false,
        });
      }
    } catch (error) {
      console.log("Error fetching profile data:", error);
      this.setState({
        isLoading: false,
      });
      // Handle error display or logging as per your application's needs
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    try {
      if (prevProps.user !== this.props.user) {
        this.setState(
          {
            listGenders: this.buildDataGender(this.props.genders),
          },
          () => {
            this.getProfileData();
          }
        );
      }

      if (prevProps.language !== this.props.language) {
        let { listGenders } = this.state;
        let { user } = this.props;

        let res = await getProfilePatientById(user.id);
        let selectedGender = listGenders.find(
          (item) => item && item.keyMap === res.data.gender
        );
        selectedGender = this.buildOptionGender(selectedGender);

        this.setState({
          selectedGender,
        });
      }

      // You can handle other prop changes here if needed
    } catch (error) {
      console.log("Error in componentDidUpdate:", error);
      // Handle error display or logging as per your application's needs
    }
  }

  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };

  handleChangeSelectGender = (selectedGender) => {
    this.setState({ selectedGender });
  };

  async componentDidMount() {
    try {
      await this.props.getGenderStart();
      this.setState({
        listGenders: this.buildDataGender(this.props.genders),
      });

      this.getProfileData();
    } catch (error) {
      console.log("Error in componentDidMount:", error);
      // Handle error display or logging as per your application's needs
    }
  }

  handleOnChangeDatePicker = (date) => {
    this.setState({
      birthDate: date[0],
    });
  };

  handleOnChangeInput = (event, id) => {
    let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{3}/;
    let nameRegex =
      /^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ]+$/;
    let valueInput = event.target.value;
    let stateCopy = { ...this.state, [id]: valueInput };

    this.setState({
      ...stateCopy,
    });

    if (id === "firstName" && nameRegex.test(valueInput)) {
      this.setState({
        isValidFirstNameInput: true,
      });
    } else if (id === "firstName" && !nameRegex.test(valueInput)) {
      this.setState({
        isValidFirstNameInput: false,
      });
    }

    if (id === "lastName" && nameRegex.test(valueInput)) {
      this.setState({
        isValidLastNameInput: true,
      });
    } else if (id === "lastName" && !nameRegex.test(valueInput)) {
      this.setState({
        isValidLastNameInput: false,
      });
    }

    if (id === "email" && emailRegex.test(valueInput)) {
      this.setState({
        isValidEmailInput: true,
      });
    } else if (id === "email" && !emailRegex.test(valueInput)) {
      this.setState({
        isValidEmailInput: false,
      });
    }

    if (id === "phoneNumber" && validator.isMobilePhone(valueInput)) {
      this.setState({
        isValidPhoneNumberInput: true,
      });
    } else if (id === "phoneNumber" && !validator.isMobilePhone(valueInput)) {
      this.setState({
        isValidPhoneNumberInput: false,
      });
    }
  };

  handleOpenChangePasswordModal = () => {
    this.setState({
      isOpenModal: true,
    });
  };

  closeChangeModal = () => {
    this.setState({
      isOpenModal: false,
    });
  };

  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];

    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };

  handleSaveInfoPatient = async () => {
    let { user, language } = this.props;
    let date = new Date(this.state.birthDate).getTime();
    let {
      isValidEmailInput,
      isValidFirstNameInput,
      isValidLastNameInput,
      isValidPhoneNumberInput,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    if (
      !isValidEmailInput ||
      !isValidFirstNameInput ||
      !isValidLastNameInput ||
      !isValidPhoneNumberInput
    ) {
      language === LANGUAGES.EN
        ? toast.error("Invalid informations")
        : toast.error("Thông tin không hợp lệ");

      this.setState({
        isLoading: false,
      });
      return;
    }

    try {
      let res = await editUserService({
        userType: "PATIENT",
        id: user.id,
        email: this.state.email,
        phoneNumber: this.state.phoneNumber,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address || "",
        birth: date,
        gender: this.state.selectedGender?.value || "",
        avatar: this.state.imageBase64 || "",
      });

      if (res && res.errCode === 0) {
        toast.success("Done");
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.log("Error saving patient info:", error);
      toast.error("Error saving patient info");
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
    let {
      listGenders,
      selectedGender,
      birthDate,
      address,
      firstName,
      lastName,
      phoneNumber,
      email,
      imageBase64,
      isValidEmailInput,
      isValidFirstNameInput,
      isValidLastNameInput,
      isValidPhoneNumberInput,
      isLoading,
      isOpenModal,
    } = this.state;

    return (
      <LoadingOverlay
        active={isLoading}
        spinner
        text={
          this.props.language === LANGUAGES.VI ? "Loading..." : "Loading..."
        }
      >
        <div className="wrapper-profile">
          <div className="profile-patient">
            <div className="profile__info">
              <div className="profile__avatar">
                <div className="img__profile">
                  <div
                    className="icon__wrapper"
                    onClick={this.handleOpenChangePasswordModal}
                  >
                    <MdErrorOutline />
                  </div>
                  <div className="img__avatar">
                    <img
                      className="profile__img"
                      src={imageBase64}
                      alt="avatar"
                    />
                    <input
                      type="file"
                      className="avatar__input"
                      accept="image/*"
                      onChange={this.handleOnchangeImage}
                    />
                  </div>
                </div>
              </div>
              <div className="profile__detail">
                <div className="detail__item">
                  <label className="item__label">
                    <FormattedMessage id="profile.firstName" />
                  </label>
                  <input
                    className={`input__form ${
                      isValidFirstNameInput ? "" : "invalid"
                    }`}
                    type="text"
                    value={firstName}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "firstName")
                    }
                  />
                </div>
                <div className="detail__item">
                  <label className="item__label">
                    <FormattedMessage id="profile.lastName" />
                  </label>
                  <input
                    className={`input__form ${
                      isValidLastNameInput ? "" : "invalid"
                    }`}
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "lastName")
                    }
                  />
                </div>
                <div className="detail__item">
                  <label className="item__label">
                    <FormattedMessage id="profile.email" />
                  </label>
                  <input
                    className={`input__form ${
                      isValidEmailInput ? "" : "invalid"
                    }`}
                    type="text"
                    value={email}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "email")
                    }
                  />
                </div>
                <div className="detail__item">
                  <label className="item__label">
                    <FormattedMessage id="profile.phone" />
                  </label>
                  <input
                    className={`input__form ${
                      isValidPhoneNumberInput ? "" : "invalid"
                    }`}
                    type="text"
                    value={phoneNumber}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "phoneNumber")
                    }
                  />
                </div>
                <div className="detail__item">
                  <label className="item__label">
                    <FormattedMessage id="profile.birthDate" />
                  </label>
                  <DatePicker
                    className="form-control"
                    value={[birthDate]}
                    onChange={(date) => this.handleOnChangeDatePicker(date)}
                    options={{
                      dateFormat: "d-m-Y",
                    }}
                  />
                </div>
                <div className="detail__item">
                  <label className="item__label">
                    <FormattedMessage id="profile.gender" />
                  </label>
                  <Select
                    className="select__gender"
                    options={listGenders}
                    value={selectedGender}
                    onChange={this.handleChangeSelectGender}
                    placeholder=""
                  />
                </div>
                <div className="detail__item">
                  <label className="item__label">
                    <FormattedMessage id="profile.address" />
                  </label>
                  <input
                    className="input__form"
                    type="text"
                    value={address}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "address")
                    }
                  />
                </div>
              </div>
            </div>
            <div className="btn__group">
              <button
                className="btn__save"
                onClick={this.handleSaveInfoPatient}
              >
                <FormattedMessage id="profile.save" />
              </button>
            </div>
          </div>
          <HomeFooter />
        </div>
        {isOpenModal && (
          <ChangePassword
            open={isOpenModal}
            closeModal={this.closeChangeModal}
          />
        )}
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.userInfo,
    language: state.app.language,
    genders: state.systemData.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePatient);
