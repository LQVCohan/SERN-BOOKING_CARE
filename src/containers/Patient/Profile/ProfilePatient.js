import React, { Component, Fragment } from "react";
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
import { add } from "lodash";
import DatePicker from "react-flatpickr";
import { toast } from "react-toastify";
import HomeFooter from "../../HomePage/HomeFooter";

class ProfilePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //list

      listGenders: [],

      //selected

      selectedGender: "",

      // state input
      birthDate: "",
      address: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      genderId: "",

      imageBase64: "",

      //list data

      // state
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
      let address = "",
        email = "",
        phoneNumber = "",
        genderId = "",
        selectedGenderId = "",
        birthDate = "",
        imageBase64 = "";

      let listGenders = this.props.genders;
      let res = await getProfilePatientById(user.id);
      console.log("check res from get data info patient: ", res);
      if (res.data) {
        email = res.data.email;
        imageBase64 = res.data.image;
        phoneNumber = res.data.phoneNumber;
        address = res.data.address;
        genderId = res.data.gender;
        birthDate = res.data.birth;
        selectedGenderId = listGenders.find((item) => {
          return item && item.keyMap === genderId;
        });
        let selectedGender = this.buildOptionGender(selectedGenderId);

        this.setState({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: email,
          phoneNumber: phoneNumber,
          imageBase64: imageBase64,

          address: address,
          selectedGender: selectedGender,
          genderId: genderId,
          birthDate: moment.unix(+birthDate / 1000).valueOf(),
        });
        if (selectedGender) {
          this.setState({
            isLoading: false,
          });
        }
      }
    } catch (error) {
      console.log(error);
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
        let selectedGender = listGenders.find((item) => {
          return item && item.keyMap === res.data.gender;
        });
        selectedGender = this.buildOptionGender(selectedGender);
        this.setState({
          selectedGender: selectedGender,
        });
      }

      if (prevProps.genders !== this.props.genders) {
      }
    } catch (error) {
      console.log(error);
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
    this.setState({ selectedGender: selectedGender });
  };
  async componentDidMount() {
    try {
      await this.props.getGenderStart();
      this.setState({
        listGenders: this.buildDataGender(this.props.genders),
      });

      this.getProfileData();
    } catch (error) {
      console.log(error);
    }
  }
  handleOnChangeDatePicker = (date) => {
    this.setState({
      birthDate: date[0],
    });
  };

  handleOnChangeInput = (event, id) => {
    try {
      let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{3}/;
      // let nameRegex = /^[a-zA-Z ]*$/;
      let nameRegex =
        /^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ]+$/;
      let valueInput = event.target.value;
      let stateCopy = { ...this.state };
      stateCopy[id] = valueInput;
      this.setState({
        ...stateCopy,
      });
      if (id === "firstName" && nameRegex.test(valueInput)) {
        this.setState({
          isValidFirstNameInput: true,
        });
      } else {
        if (id === "firstName" && !nameRegex.test(valueInput)) {
          this.setState({
            isValidFirstNameInput: false,
          });
        }
      }
      if (id === "lastName" && nameRegex.test(valueInput)) {
        this.setState({
          isValidLastNameInput: true,
        });
      } else {
        if (id === "lastName" && !nameRegex.test(valueInput)) {
          this.setState({
            isValidLastNameInput: false,
          });
        }
      }
      if (id === "email" && emailRegex.test(valueInput)) {
        this.setState({
          isValidEmailInput: true,
        });
      } else {
        if (id === "email" && !emailRegex.test(valueInput)) {
          this.setState({
            isValidEmailInput: false,
          });
        }
      }
      if (id === "phoneNumber" && validator.isMobilePhone(valueInput)) {
        this.setState({
          isValidPhoneNumberInput: true,
        });
      } else {
        if (id === "phoneNumber" && !validator.isMobilePhone(valueInput)) {
          this.setState({
            isValidPhoneNumberInput: false,
          });
        }
      }
    } catch (error) {
      return;
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
    try {
      let data = event.target.files;
      let file = data[0];
      if (file) {
        let base64 = await CommonUtils.getBase64(file);
        console.log("cehck base64", base64);
        this.setState({
          imageBase64: base64,
        });
      }
    } catch (error) {
      return;
    }
  };
  handleSaveInfoPatient = async () => {
    try {
      let { user } = this.props;
      let date = new Date(this.state.birthDate).getTime();
      let { language } = this.props;
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
        isValidEmailInput === false ||
        isValidFirstNameInput === false ||
        isValidLastNameInput === false ||
        isValidPhoneNumberInput === false
      ) {
        language === LANGUAGES.EN
          ? toast.error("Invalid informations")
          : toast.error("Thông tin không hợp lệ");
        this.setState({
          isSending: false,
        });
      } else {
        let res = await editUserService({
          userType: "PATIENT",
          id: user.id,
          email: this.state.email,
          phoneNumber: this.state.phoneNumber,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          address: this.state.address ? this.state.address : "",
          birth: date,
          gender:
            this.state.selectedGender && this.state.selectedGender.value
              ? this.state.selectedGender.value
              : "",

          avatar: this.state.imageBase64 ? this.state.imageBase64 : "",
        });
        if (res && res.errCode === 0) {
          this.setState({
            isLoading: false,
          });
          toast.success("Done");
        } else {
          this.setState({
            isLoading: false,
          });
          toast.error("Error");
        }
      }
    } catch (error) {
      return;
    }
  };
  render() {
    let {
      isLoading,

      listGenders,
      lastName,
      firstName,
      isValidEmailInput,
      isValidFirstNameInput,
      isValidLastNameInput,
      isValidPhoneNumberInput,
      imageBase64,
      isOpenModal,
    } = this.state;
    console.log("check state inside: ", this.state);

    let { language } = this.props;

    let nameVi = "",
      nameEn = "";

    nameVi = ` ${lastName} ${firstName}`;
    nameEn = ` ${firstName} ${lastName}`;

    return (
      <div>
        <LoadingOverlay active={isLoading} spinner text="Loading...">
          <React.Fragment>
            <HomeHeader />
            <div className="patient-info-section container">
              <div className="row">
                <div className="profile-card-container col-12">
                  <div className="profile-card-content">
                    <div className="profile-card col-12 row">
                      <div className="title col-12">
                        <span>
                          {" "}
                          <FormattedMessage
                            id={"doctor.doctor-profile-label"}
                          />
                        </span>
                        <button
                          className="btn-submit"
                          onClick={() => this.handleSaveInfoPatient()}
                        >
                          <FormattedMessage id={"doctor.save"} />
                        </button>
                      </div>
                      <div className="info col-12 container ">
                        <div className="row">
                          <div
                            className="avatar-image form-control "
                            style={{
                              backgroundImage: `url(${imageBase64})`,
                            }}
                          ></div>
                          <div className="detail-info col-10 row">
                            <div className="name form-control info">
                              {language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className="id form-control info">
                              <FormattedMessage id={"doctor.id"} />
                              {this.props.user ? this.props.user.id : ""}
                            </div>
                            <div className="form-control info">
                              <button
                                className="btn-change-password"
                                onClick={this.handleOpenChangePasswordModal}
                              >
                                Change password
                              </button>
                              <label
                                className="btn-change-image"
                                for="upload-photo"
                              >
                                <span>
                                  {" "}
                                  <FormattedMessage id={"doctor.upload"} />
                                </span>
                              </label>
                              <input
                                type="file"
                                name="photo"
                                id="upload-photo"
                                onChange={(event) =>
                                  this.handleOnchangeImage(event)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="edit-info col-12 container mt-3">
                        <div className="row">
                          <div className="first-name col-6 form-group mb-5">
                            <label className="input-label-fname">
                              <FormattedMessage id={"doctor.first-name"} />
                            </label>
                            <input
                              className="fname-input form-control"
                              placeholder={
                                <FormattedMessage id={"doctor.first-name"} />
                              }
                              onChange={(event) =>
                                this.handleOnChangeInput(event, "firstName")
                              }
                              value={this.state.firstName}
                            />
                            {this.state.firstName !== "" &&
                              isValidFirstNameInput === false && (
                                <div className="is-error">
                                  <MdErrorOutline color="red" />
                                  <FormattedMessage
                                    id={
                                      "patient.booking-modal.invalid-first-name"
                                    }
                                  />
                                </div>
                              )}
                          </div>
                          <div className="last-name col-6 row form-group mb-5">
                            <label className="input-label-lname">
                              <FormattedMessage id={"doctor.last-name"} />
                            </label>
                            <input
                              className="fname-input form-control"
                              placeholder={
                                <FormattedMessage id={"doctor.last-name"} />
                              }
                              onChange={(event) =>
                                this.handleOnChangeInput(event, "lastName")
                              }
                              value={this.state.lastName}
                            />
                            {this.state.lastName !== "" &&
                              isValidLastNameInput === false && (
                                <div className="is-error">
                                  <MdErrorOutline color="red" />
                                  <FormattedMessage
                                    id={
                                      "patient.booking-modal.invalid-last-name"
                                    }
                                  />
                                </div>
                              )}
                          </div>
                          <div className="more-info-extra row col-12">
                            <div className="col-4 form-group">
                              <label>
                                <FormattedMessage id="doctor.address" />
                              </label>
                              <input
                                className="form-control"
                                onChange={(event) =>
                                  this.handleOnChangeInput(event, "address")
                                }
                                value={
                                  this.state.address ? this.state.address : ""
                                }
                              />
                            </div>
                            <div className="col-4 form-group">
                              <label>
                                <FormattedMessage id="doctor.gender" />
                              </label>
                              <Select
                                value={this.state.selectedGender}
                                onChange={this.handleChangeSelectGender}
                                options={listGenders}
                              />
                            </div>
                            <div className="col-4 form-group">
                              <label>
                                <FormattedMessage id="doctor.birth" />
                              </label>
                              <DatePicker
                                className="form-control"
                                placeholder="Choose your birthday"
                                onChange={this.handleOnChangeDatePicker}
                                value={this.state.birthDate}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
                <div className="contact-card-container col-12">
                  <div className="contact-card-content">
                    <div className="contact-card col-12 row">
                      <div className="title col-6 form-control info">
                        <span>
                          {" "}
                          <FormattedMessage id={"doctor.contact-label"} />
                        </span>
                      </div>
                      <div className="info col-12 container ">
                        <div className="row">
                          <div className="icon col-2 form-control info mb-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              height="30"
                              width="30"
                            >
                              <path d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256v32c0 53-43 96-96 96c-29.3 0-55.6-13.2-73.2-33.9C320 371.1 289.5 384 256 384c-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1c5.7-5 13.1-8.1 21.3-8.1c17.7 0 32 14.3 32 32v80 32c0 17.7 14.3 32 32 32s32-14.3 32-32V256c0-106-86-192-192-192zm64 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
                            </svg>
                          </div>
                          <div className="detail-info col-10 row">
                            <div className="name form-control info">
                              (+84) {this.state.phoneNumber}
                            </div>
                            <div className="id form-control info">
                              {this.state.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="edit-info col-12 container mt-3">
                        <div className="row">
                          <div className="first-name col-6 form-group mb-5">
                            <label className="input-label-fname">
                              {" "}
                              <FormattedMessage id={"doctor.phone-number"} />
                            </label>
                            <input
                              className="fname-input form-control"
                              placeholder={
                                <FormattedMessage id={"doctor.phone-number"} />
                              }
                              onChange={(event) =>
                                this.handleOnChangeInput(event, "phoneNumber")
                              }
                              value={this.state.phoneNumber}
                            />
                            {this.state.phoneNumber !== "" &&
                              isValidPhoneNumberInput === false && (
                                <div className="is-error">
                                  <MdErrorOutline color="red" />
                                  <FormattedMessage
                                    id={
                                      "patient.booking-modal.invalid-phone-number"
                                    }
                                  />
                                </div>
                              )}
                          </div>
                          <div className="last-name col-6 row form-group mb-5">
                            <label className="input-label-lname">Email</label>
                            <input
                              className="fname-input form-control"
                              placeholder="Email"
                              onChange={(event) =>
                                this.handleOnChangeInput(event, "email")
                              }
                              value={this.state.email}
                            />
                            {this.state.email !== "" &&
                              isValidEmailInput === false && (
                                <div className="is-error">
                                  <MdErrorOutline color="red" />
                                  <FormattedMessage
                                    id={"patient.booking-modal.invalid-email"}
                                  />
                                </div>
                              )}
                          </div>
                          <div className="more-info-extra row col-12">
                            <div className="col-12 form-group">
                              <label>
                                <FormattedMessage id="doctor.status" />
                              </label>
                              <Select
                                value={{ value: "A", label: "Đang hoạt động" }}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listStatus}
                                placeholder={
                                  <FormattedMessage id="doctor.status" />
                                }
                                name="selectedStatus"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </div>
            </div>
            <ChangePassword
              isOpenModal={isOpenModal}
              closeChangeModal={this.closeChangeModal}
            />
            <HomeFooter />
          </React.Fragment>
        </LoadingOverlay>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
    allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePatient);
