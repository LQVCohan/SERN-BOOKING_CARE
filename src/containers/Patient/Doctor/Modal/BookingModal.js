import React, { Component } from "react";
import { connect } from "react-redux";
import "./BookingModal.scss";
import Select from "react-select";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import * as actions from "../../../../store/actions";
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
import _ from "lodash";
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
        });
        let { userInfo } = this.props;
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
      console.error("Error in componentDidUpdate:", error);
    }
  }

  async componentDidMount() {
    try {
      await this.props.getGenderStart();
    } catch (error) {
      console.error("Error in componentDidMount:", error);
    }
  }

  buildDataInputSelectPayment = (inputData) => {
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
      try {
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
          await changeStatusScheduleDoctorByTime({
            doctorId: this.state.doctorId,
            date: this.props.dataTime.date,
            timeType: this.state.timeType,
            statusId: "S2",
          });
          this.props.closeBookingClose();
          language === LANGUAGES.EN
            ? toast.success("Booking a new appointment succeed!")
            : toast.success("Đặt lịch hẹn thành công!");
          this.setState({
            isSending: false,
          });
        } else {
          language === LANGUAGES.EN
            ? toast.error("Booking a new appointment error!")
            : toast.error("Đặt lịch hẹn lỗi!");
          this.setState({
            isSending: false,
          });
        }
      } catch (error) {
        console.error("Error in handleConfirmBooking:", error);
        toast.error("An error occurred while booking the appointment.");
        this.setState({
          isSending: false,
        });
      }
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
          : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
      return name;
    }
    return "";
  };

  render() {
    let { isOpenModal, closeBookingClose, dataTime } = this.props;
    let doctorId = "";
    if (dataTime && !_.isEmpty(dataTime)) {
      doctorId = dataTime.doctorId;
    }
    return (
      <Modal
        isOpen={isOpenModal}
        className={"booking-modal-container"}
        size="lg"
        centered
      >
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left">
              <FormattedMessage id="patient.booking-modal.title" />
            </span>
            <span className="right" onClick={closeBookingClose}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="booking-modal-body">
            <div className="doctor-infor">
              <ProfileDoctor
                doctorId={doctorId ? doctorId : ""}
                isShowDescriptionDoctor={false}
                dataTime={dataTime}
                isShowLinkDetail={false}
                isShowPrice={true}
              />
            </div>

            <div className="row">
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.firstName" />
                </label>
                <input
                  className={
                    this.state.isValidFirstNameInput
                      ? "form-control"
                      : "form-control invalid"
                  }
                  value={this.state.firstName}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "firstName")
                  }
                />
                {this.state.isValidFirstNameInput === false ? (
                  <MdErrorOutline className="invalid-icon" />
                ) : (
                  ""
                )}
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.lastName" />
                </label>
                <input
                  className={
                    this.state.isValidLastNameInput
                      ? "form-control"
                      : "form-control invalid"
                  }
                  value={this.state.lastName}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "lastName")
                  }
                />
                {this.state.isValidLastNameInput === false ? (
                  <MdErrorOutline className="invalid-icon" />
                ) : (
                  ""
                )}
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.phoneNumber" />
                </label>
                <input
                  className={
                    this.state.isValidPhoneNumberInput
                      ? "form-control"
                      : "form-control invalid"
                  }
                  value={this.state.phoneNumber}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "phoneNumber")
                  }
                />
                {this.state.isValidPhoneNumberInput === false ? (
                  <MdErrorOutline className="invalid-icon" />
                ) : (
                  ""
                )}
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.email" />
                </label>
                <input
                  className={
                    this.state.isValidEmailInput
                      ? "form-control"
                      : "form-control invalid"
                  }
                  value={this.state.email}
                  onChange={(event) => this.handleOnChangeInput(event, "email")}
                />
                {this.state.isValidEmailInput === false ? (
                  <MdErrorOutline className="invalid-icon" />
                ) : (
                  ""
                )}
              </div>
              <div className="col-12 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.address" />
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
                  <FormattedMessage id="patient.booking-modal.reason" />
                </label>
                <input
                  className={
                    this.state.reason !== ""
                      ? "form-control"
                      : "form-control invalid"
                  }
                  value={this.state.reason}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "reason")
                  }
                />
                {this.state.reason === "" ? (
                  <MdErrorOutline className="invalid-icon" />
                ) : (
                  ""
                )}
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.birth" />
                </label>
                <DatePicker
                  onChange={this.handleOnChangeDatePicker}
                  className="form-control"
                  value={this.state.birth}
                />
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.gender" />
                </label>
                <Select
                  value={this.state.selectedGender}
                  onChange={this.handleChangeSelectGender}
                  options={this.state.gender}
                />
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.payment" />
                </label>
                <Select
                  value={this.state.selectedPayment}
                  onChange={this.handleChangeSelectPayment}
                  options={this.state.listPayments}
                />
              </div>
            </div>
          </div>
          <div className="booking-modal-footer">
            <button
              className="btn-booking-confirm"
              onClick={() => this.handleConfirmBooking()}
            >
              <span>
                <FormattedMessage id="patient.booking-modal.btnConfirm" />
              </span>
            </button>
            <button className="btn-booking-cancel" onClick={closeBookingClose}>
              <span>
                <FormattedMessage id="patient.booking-modal.btnCancel" />
              </span>
            </button>
          </div>
        </div>
        {this.state.isSending === true && (
          <div className="sending-loading-container">
            <RingLoader size={50} color={"#36D7B7"} loading={true} />
          </div>
        )}
      </Modal>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
