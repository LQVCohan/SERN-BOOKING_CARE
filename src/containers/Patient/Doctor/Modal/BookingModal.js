import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import Select from "react-select";
import { Modal } from "reactstrap";
import { height } from "@fortawesome/free-brands-svg-icons/fa42Group";
import ProfileDoctor from "../ProfileDoctor";
import { data } from "browserslist";
import _, { times } from "lodash";
import * as actions from "../../../../store/actions";
import { lang } from "moment";
import { LANGUAGES } from "../../../../utils";
import {
  postPatientBookAppointment,
  changeStatusScheduleDoctorByTime,
} from "../../../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import RingLoader from "react-spinners/RingLoader";
import { MdErrorOutline } from "react-icons/md";
import validator from "validator";
import DatePicker from "../../../../components/Input/DatePicker";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birth: "",
      gender: [],
      doctorId: "",
      selectedGender: "",
      timeType: "",
      isSending: false,
      isValidEmailInput: true,
      isValidFirstNameInput: true,
      isValidLastNameInput: true,
      isValidPhoneNumberInput: true,
      listPayments: [],
      selectedPayment: "",
    };
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
  async componentDidUpdate(prevProps, prevState, snapshot) {
    try {
      if (prevProps.isOpenModal !== this.props.isOpenModal) {
        let { userInfo } = this.props;
        console.log("check user", userInfo);
        let { gender } = this.state;
        let selectedGender = gender.find((item) => {
          return item && item.value === userInfo.gender;
        });

        this.setState({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          phoneNumber: userInfo.phoneNumber,
          email: userInfo.email,
          address: userInfo.address,
          selectedGender: selectedGender,
          birth: moment.unix(+userInfo.birth / 1000).valueOf(),
        });
      }
      if (prevProps.language !== this.props.language) {
        this.setState({
          gender: this.buildDataGender(this.props.genders),
          //   listPayments: this.buildDataInputSelectPayment(
          //     this.props.doctorExtraInforFromGrandParent
          //   ),
        });
        let { userInfo } = this.props;
        console.log("check user", userInfo);
        let { gender } = this.state;
        let selectedGender = gender.find((item) => {
          return item && item.value === userInfo.gender;
        });

        this.setState({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          phoneNumber: userInfo.phoneNumber,
          email: userInfo.email,
          address: userInfo.address,
          selectedGender: selectedGender,
          birth: moment.unix(+userInfo.birth / 1000).valueOf(),
        });
      }
      if (prevProps.genders !== this.props.genders) {
        this.setState({
          gender: this.buildDataGender(this.props.genders),
        });
      }
      if (
        prevProps.doctorExtraInforFromGrandParent !==
        this.props.doctorExtraInforFromGrandParent
      ) {
        this.setState({
          listPayments: this.buildDataInputSelectPayment(
            this.props.doctorExtraInforFromGrandParent
          ),
        });
      }

      if (this.props.dataTime !== prevProps.dataTime) {
        if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
          let doctorId = this.props.dataTime.doctorId;
          let timeType = this.props.dataTime.timeType;
          this.setState({
            doctorId: doctorId,
            timeType: timeType,
          });
        }
      }
    } catch (error) {
      return;
    }
  }
  async componentDidMount() {
    try {
      await this.props.getGenderStart();
    } catch (error) {
      return;
    }

    // let { gender } = this.state;
    // let selectedGender = gender.find((item) => {
    //   return item && item.value === userInfo.gender;
    // });
    // let { userInfo } = this.props;
    // console.log("check user", userInfo);
    // this.setState({
    //   firstName: userInfo.firstName,
    //   lastName: userInfo.lastName,
    //   phoneNumber: userInfo.phoneNumber,
    //   email: userInfo.email,
    //   address: userInfo.address,
    //   selectedGender: selectedGender,
    //   birth: userInfo.birth,
    // });
    // this.setState({
    //   genders: this.buildDataGender(this.props.genders),
    //   listPayments: this.buildDataInputSelectPayment(
    //     this.props.doctorExtraInforFromGrandParent
    //   ),
    // });
  }
  buildDataInputSelectPayment = (inputData) => {
    console.log("check inoutdata: ", inputData);
    let result = [];
    let language = this.props.language;

    if (inputData) {
      let object = {};
      let labelVi = `${inputData.paymentData.valueVi}`;
      let labelEn = `${inputData.paymentData.valueEn}`;
      object.label = language === LANGUAGES.VI ? labelVi : labelEn;
      object.value = inputData.paymentId;
      result.push(object);
    }

    return result;
  };
  handleOnChangeInput = (event, id) => {
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
  };
  handleOnChangeDatePicker = (date) => {
    this.setState({
      birth: date[0],
    });
  };
  handleChangeSelectGender = (selectedGender) => {
    this.setState({ selectedGender: selectedGender });
  };
  handleChangeSelectPayment = (selectedPayment) => {
    this.setState({ selectedPayment: selectedPayment });
  };
  handleConfirmBooking = async () => {
    try {
      let timeString = this.buildTimeBooking(this.props.dataTime);
      let doctorName = this.buildDoctorName(this.props.dataTime);
      let date = new Date(this.state.birth).getTime();
      let { language } = this.props;
      let {
        isValidEmailInput,
        isValidFirstNameInput,
        isValidLastNameInput,
        isValidPhoneNumberInput,
      } = this.state;
      this.setState({
        isSending: true,
      });
      if (
        isValidEmailInput === false ||
        isValidFirstNameInput === false ||
        isValidLastNameInput === false ||
        isValidPhoneNumberInput === false ||
        this.state.reason === ""
      ) {
        language === LANGUAGES.EN
          ? toast.error("Invalid informations")
          : toast.error("Thông tin không hợp lệ");
        this.setState({
          isSending: false,
        });
      } else {
        let res = await postPatientBookAppointment({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          phoneNumber: this.state.phoneNumber,
          email: this.state.email,
          address: this.state.address,
          reason: this.state.reason,
          date: this.props.dataTime.date,
          birthday: date,
          doctorId: this.state.doctorId,
          selectedGender: this.state.selectedGender.value,
          timeType: this.state.timeType,
          language: this.props.language,
          timeString: timeString,
          doctorName: doctorName,
          paymentMethod: this.state.selectedPayment.value,
          priceId: this.props.doctorExtraInforFromGrandParent.priceId,
        });
        if (res && res.errCode === 0) {
          toast.success("OK");

          let resdelete = await changeStatusScheduleDoctorByTime({
            timeType: this.state.timeType,
            date: this.props.dataTime.date,
            doctorId: this.state.doctorId,
            statusId: "SS2",
          });
          if (resdelete && resdelete.errCode === 0) {
            this.props.closeBookingModal();
            this.props.reloadSheduleModal();
          } else {
            toast.error("Something wrong!");
          }

          this.setState({
            isSending: false,
          });
        } else {
          if (res && res.errCode === 1) {
            toast.error("Please fulfill informations");
            this.setState({
              isSending: false,
            });
          } else {
            if (res && res.errCode === 5) {
              toast.error("Please confirm your last appointment");
              this.setState({
                isSending: false,
              });
            } else {
              toast.error("Error!");
              this.setState({
                isSending: false,
              });
            }
          }
        }
      }
    } catch (error) {
      return;
    }
  };

  buildTimeBooking = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      let date =
        language === LANGUAGES.VI
          ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      return `${time} - ${date}`;
    }
    return "";
  };
  buildDoctorName = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let name =
        language === LANGUAGES.VI
          ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
          : `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`;
      return `${name}`;
    }
    return "";
  };

  render() {
    console.log("Check state inside modal: ", this.state);
    let {
      dataTime,
      isOpenModal,
      closeBookingModal,
      doctorExtraInforFromGrandParent,
    } = this.props;
    console.log("Check props inside modal: ", this.props);
    let {
      listPayments,
      isSending,
      isValidEmailInput,
      isValidFirstNameInput,
      isValidLastNameInput,
      isValidPhoneNumberInput,
    } = this.state;
    console.log(
      "check doctorExtraInforFromGrandParent ",
      doctorExtraInforFromGrandParent
    );

    console.log("check listPayments ", listPayments);

    let doctorId = "";
    if (dataTime && !_.isEmpty(dataTime)) {
      doctorId = dataTime.doctorId;
    }
    let today = new Date();

    return (
      <div>
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="lg"
          centered
        >
          <div className="booking-modal-content">
            <div className="booking-modal-header">
              <span className="header-left">
                {" "}
                <FormattedMessage id={"patient.booking-modal.label"} />
              </span>
              <span className="header-right" onClick={closeBookingModal}>
                <i className="fas fa-times"> </i>
              </span>
            </div>
            <div className="booking-modal-body">
              <div className="doctor-info">
                <ProfileDoctor
                  doctorId={doctorId}
                  isShowDesDotor={false}
                  dataTime={dataTime}
                />
              </div>
              <div className="row">
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id={"patient.booking-modal.first-name"} />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.firstName}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "firstName")
                    }
                  />
                  {this.state.firstName !== "" &&
                    isValidFirstNameInput === false && (
                      <div className="is-error">
                        <MdErrorOutline color="red" />
                        <FormattedMessage
                          id={"patient.booking-modal.invalid-first-name"}
                        />
                      </div>
                    )}
                </div>
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id={"patient.booking-modal.last-name"} />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.lastName}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "lastName")
                    }
                  />
                  {this.state.lastName !== "" &&
                    isValidLastNameInput === false && (
                      <div className="is-error">
                        <MdErrorOutline color="red" />
                        <FormattedMessage
                          id={"patient.booking-modal.invalid-last-name"}
                        />
                      </div>
                    )}
                </div>
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage
                      id={"patient.booking-modal.phoneNumber"}
                    />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.phoneNumber}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "phoneNumber")
                    }
                  />
                  {this.state.phoneNumber !== "" &&
                    isValidPhoneNumberInput === false && (
                      <div className="is-error">
                        <MdErrorOutline color="red" />
                        <FormattedMessage
                          id={"patient.booking-modal.invalid-phone-number"}
                        />
                      </div>
                    )}
                </div>
                <div className="col-6 form-group">
                  <label>Email</label>
                  <input
                    className="form-control"
                    value={this.state.email}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "email")
                    }
                    required
                  />
                  {this.state.email !== "" && isValidEmailInput === false && (
                    <div className="is-error">
                      <MdErrorOutline color="red" />
                      <FormattedMessage
                        id={"patient.booking-modal.invalid-email"}
                      />
                    </div>
                  )}
                </div>
                <div className="col-12 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id={"patient.booking-modal.address"} />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.address}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "address")
                    }
                  />
                </div>
                <div className="col-12 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id={"patient.booking-modal.reason"} />
                  </label>
                  <input
                    className="form-control"
                    value={this.state.reason}
                    onChange={(event) =>
                      this.handleOnChangeInput(event, "reason")
                    }
                  />
                </div>
                <div className="col-3 form-group">
                  <label>
                    {" "}
                    <FormattedMessage
                      id={"patient.booking-modal.dateOfBirth"}
                    />
                  </label>
                  <DatePicker
                    className="form-control form-control-sm"
                    onChange={this.handleOnChangeDatePicker}
                    value={this.state.birth}
                    maxDate={today}
                  />{" "}
                </div>
                <div className="col-3 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id={"patient.booking-modal.payment"} />
                  </label>
                  <Select
                    value={this.state.selectedPayment}
                    onChange={this.handleChangeSelectPayment}
                    options={this.state.listPayments}
                  />{" "}
                </div>
                <div className="col-6 form-group">
                  <label>
                    {" "}
                    <FormattedMessage id={"patient.booking-modal.gender"} />
                  </label>
                  <Select
                    value={this.state.selectedGender}
                    onChange={this.handleChangeSelectGender}
                    options={this.state.gender}
                  />{" "}
                </div>
              </div>
            </div>
            <div className="booking-modal-footer">
              {(isSending && isSending === true && (
                <RingLoader color="#36d7b7" size={30} />
              )) ||
                (isSending === false && (
                  <button
                    className="btn-booking-confirm"
                    onClick={() => this.handleConfirmBooking()}
                  >
                    <FormattedMessage id={"patient.booking-modal.confirm"} />
                  </button>
                ))}

              <button
                className="btn-booking-cancel"
                onClick={() => {
                  this.setState({
                    isSending: false,
                  });
                  closeBookingModal();
                }}
              >
                <FormattedMessage id={"patient.booking-modal.cancel"} />
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getRequiredDoctorInfo: () => dispatch(actions.getRequiredDoctorInfo()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
