import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ManageDoctorInfo.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import {
  getDetailInfoDoctor,
  getDataChartById,
} from "../../../services/userService";
import LoadingOverlay from "react-loading-overlay";
import { loadConfig } from "browserslist";
import { Chart } from "react-google-charts";
import moment from "moment";
import validator from "validator";
import { MdErrorOutline } from "react-icons/md";
import ChangePassword from "../Doctor/Modal/ChangePassword";
class ManageDoctorInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //list
      listDoctors: [],
      hasOldData: false,
      listPrices: [],
      listPayments: [],
      listProvinces: [],
      listClinic: [],
      listSpecialty: [],
      listStatus: [],

      //selected

      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedClinic: "",
      selectedSpecialty: "",
      selectedStatus: "",

      // state input
      addressClinic: "",
      note: "",
      clinicId: "",
      specialtyId: "",
      nameClinic: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      statusId: "",
      doctorId: "",
      imageBase64: "",

      //list data
      positionData: {},

      // state
      isLoading: false,
      isValidEmailInput: true,
      isValidFirstNameInput: true,
      isValidLastNameInput: true,
      isValidPhoneNumberInput: true,
      isOpenModal: false,
    };
  }
  regexPatterns = {
    emailRegex: /[a-z0-9]+@[a-z]+\.[a-z]{3}/,
    nameRegex:
      /^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\ ]+$/,
  };
  handleOnChangeInput = (event, id) => {
    const { value } = event.target;
    const {
      isValidFirstNameInput,
      isValidLastNameInput,
      isValidEmailInput,
      isValidPhoneNumberInput,
    } = this.state;
    const { emailRegex, nameRegex } = this.regexPatterns;

    let isValid = true;

    switch (id) {
      case "firstName":
        isValid = nameRegex.test(value);
        this.setState({ isValidFirstNameInput: isValid });
        break;
      case "lastName":
        isValid = nameRegex.test(value);
        this.setState({ isValidLastNameInput: isValid });
        break;
      case "email":
        isValid = emailRegex.test(value);
        this.setState({ isValidEmailInput: isValid });
        break;
      case "phoneNumber":
        isValid = validator.isMobilePhone(value);
        this.setState({ isValidPhoneNumberInput: isValid });
        break;
      default:
        break;
    }

    this.setState({ [id]: value });
  };
  buildFrameChart = () => {
    let { language } = this.props;
    let result = {};
    let title =
      language === LANGUAGES.VI
        ? "Số cuộc hẹn của " +
          moment(new Date()).format("MMMM") +
          " trong tuần vừa qua"
        : "Doctor's appointment in " +
          moment(new Date()).locale("en").format("MMMM") +
          " on last week";
    console.log("title: ", title);
    let arrday = this.getArrDayLastWeek();
    console.log("arrday: ", arrday);
    let hAxis = { title: "Days", viewWindow: { min: 0, max: 7 } };
    let vAxis = { title: "Appointments", viewWindow: { min: 0, max: 15 } };

    result = {
      title,
      hAxis,
      vAxis,
      curveType: "function",
      legend: { position: "bottom" },
    };
    return result;
  };
  buildDataChart = async () => {
    let { user } = this.props;
    let data = [];

    let arrday = this.getArrDayLastWeek();
    console.log("arrday: ", arrday);
    console.log("doctorId: ", user.id);

    let res = await getDataChartById({
      doctorId: user.id,
      arrDate: arrday,
    });
    console.log("check res data chart", res);
    data[0] = ["Days", "Appointments"];
    for (let i = 1; i < 8; i++) {
      data[i] = [
        moment.unix(res.arrDataChart[i].date / 1000).format("DD-MM"),
        res.arrDataChart[i].count,
      ];
    }

    return data;
  };
  getArrDayLastWeek = (language) => {
    let arrDate = [];
    for (let i = 7; i >= 0; i--) {
      let object = {};
      if (language === LANGUAGES.VI) {
        if (i === 0) {
          object.label =
            "Hôm nay " +
            moment(new Date()).subtract(i, "days").format("dddd - DD/MM");
        } else {
          let labelVi = moment(new Date())
            .subtract(i, "days")
            .format("dddd - DD/MM");
          object.label = this.capitalizeFirstLetter(labelVi);
        }
      } else if (i === 0) {
        object.label =
          "Today " +
          moment(new Date()).subtract(i, "days").locale("en").format("DD/MM");
      } else {
        object.label = moment(new Date())
          .subtract(i, "days")
          .locale("en")
          .format("dddd - DD/MM");
      }
      object.value = moment(new Date())
        .subtract(i, "days")
        .startOf("day")
        .valueOf();
      arrDate.push(object);
    }
    return arrDate;
  };
  handleChangeSelectDoctorInfor = (selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = { ...this.state };
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy,
    });
  };
  buildDataSelect = () => {
    let {
      resClinic,
      resSpecialty,
      resPayment,
      resPrice,
      resProvince,
      resStatus,
    } = this.props.allRequiredDoctorInfo;
    let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
    let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
    let dataSelectProvince = this.buildDataInputSelect(resProvince, "PROVINCE");
    let dataSelectSpecialty = this.buildDataInputSelect(
      resSpecialty,
      "SPECIALTY"
    );

    let dataSelectClinic = this.buildDataInputSelect(resClinic, "CLINIC");
    let dataSelectStatus = this.buildDataInputSelect(resStatus, "STATUS");
    this.setState({
      listPrices: dataSelectPrice,
      listPayments: dataSelectPayment,
      listProvinces: dataSelectProvince,
      listSpecialty: dataSelectSpecialty,
      listClinic: dataSelectClinic,
      listStatus: dataSelectStatus,
    });
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
      this.buildDataSelect();
    }
    if (prevProps.language !== this.props.language) {
      this.buildDataSelect();
      this.setState({
        frameChart: this.buildFrameChart(),
      });
    }
  }

  async componentDidMount() {
    const { user } = this.props;

    try {
      this.setState({
        isLoading: true,
      });
      // Sử dụng Promise.all để gọi các hàm lấy dữ liệu song song
      const [dataChart, detailInfo] = await Promise.all([
        this.buildDataChart(),
        getDetailInfoDoctor(user.id),
        this.props.getRequiredDoctorInfo(),
      ]);

      // Destructure dữ liệu từ detailInfo
      const {
        Doctor_Info,
        firstName,
        lastName,
        email,
        phoneNumber,
        image,
        positionData,
      } = detailInfo.data;

      // Khởi tạo các biến cần thiết
      let {
        listPrices,
        listPayments,
        listProvinces,
        listSpecialty,
        listClinic,
        listStatus,
      } = this.state;

      // Gán các giá trị từ Doctor_Info vào các biến
      let {
        addressClinic,
        nameClinic,
        clinicId,
        priceId,
        paymentId,
        provinceId,
        specialtyId,
        positionId,
        statusId,
      } = Doctor_Info || {};

      // Tìm các giá trị tương ứng từ listPrices, listPayments, ...
      let selectedPrice = listPrices.find(
        (item) => item && item.value === priceId
      );
      let selectedPayment = listPayments.find(
        (item) => item && item.value === paymentId
      );
      let selectedProvince = listProvinces.find(
        (item) => item && item.value === provinceId
      );
      let selectedSpecialty = listSpecialty.find(
        (item) => item && item.value === specialtyId
      );
      let selectedClinic = listClinic.find(
        (item) => item && item.value === clinicId
      );
      let selectedStatus = listStatus.find(
        (item) => item && item.value === statusId
      );

      // Cập nhật state một cách rõ ràng và gọn gàng
      this.setState({
        isLoading: false,
        dataChart,
        frameChart: this.buildFrameChart(),
        firstName,
        lastName,
        addressClinic,
        priceId,
        paymentId,
        provinceId,
        specialtyId,
        nameClinic,
        positionId,
        selectedPrice,
        selectedPayment,
        selectedProvince,
        selectedSpecialty,
        selectedClinic,
        selectedStatus,
        positionData: positionData,
        doctorId: detailInfo.data.id,
        email,
        phoneNumber,
        statusId,
        imageBase64: image,
      });
    } catch (error) {
      console.error("Error in componentDidMount:", error);
      // Xử lý lỗi tại đây nếu cần thiết
    }
  }

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let language = this.props.language;
    if (inputData && inputData.length > 0) {
      if (type === "USERS") {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.lastName} ${item.firstName}`;
          let labelEn = `${item.firstName} ${item.lastName}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.id;
          result.push(object);
        });
      }
      if (type === "PRICE") {
        console.log("check input data ", inputData);
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn} USD`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
      }
      if (type === "STATUS") {
        console.log("check input data ", inputData);
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
      }
      if (type === "PAYMENT" || type === "PROVINCE") {
        inputData.map((item, index) => {
          let object = {};
          let labelVi = `${item.valueVi}`;
          let labelEn = `${item.valueEn}`;
          object.label = language === LANGUAGES.VI ? labelVi : labelEn;
          object.value = item.keyMap;
          result.push(object);
        });
      }
      if (type === "SPECIALTY") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
      if (type === "CLINIC") {
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object);
        });
      }
      return result;
    }
  };
  handleSaveInfoDoctor = async () => {
    try {
      this.setState({
        isLoading: true,
      });
      await this.props.saveDetailDoctor({
        action: "EDIT",
        id: this.state.doctorId,
        email: this.state.email,
        phoneNumber: this.state.phoneNumber,
        selectedPrice:
          this.state.selectedPrice && this.state.selectedPrice.value
            ? this.state.selectedPrice.value
            : "",
        selectedPayment:
          this.state.selectedPayment && this.state.selectedPayment.value
            ? this.state.selectedPayment.value
            : "",
        selectedProvince:
          this.state.selectedProvince && this.state.selectedProvince.value
            ? this.state.selectedProvince.value
            : "",

        addressClinic: this.state.addressClinic ? this.state.addressClinic : "",

        clinicId:
          this.state.selectedClinic && this.state.selectedClinic.value
            ? this.state.selectedClinic.value
            : "",
        specialtyId:
          this.state.selectedSpecialty && this.state.selectedSpecialty.value
            ? this.state.selectedSpecialty.value
            : "",
        statusId:
          this.state.selectedStatus && this.state.selectedStatus.value
            ? this.state.selectedStatus.value
            : "",
        imageBase64: this.state.imageBase64,
      });
      this.setState({
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
    }
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
  render() {
    let {
      dataChart,
      frameChart,
      isLoading,
      listSpecialty,
      positionData,
      lastName,
      firstName,
      isValidEmailInput,
      isValidFirstNameInput,
      isValidLastNameInput,
      isValidPhoneNumberInput,
      imageBase64,
      isOpenModal,
    } = this.state;
    let { language } = this.props;

    let nameVi = "",
      nameEn = "";

    if (positionData) {
      nameVi = `${
        positionData && positionData.valueVi ? positionData.valueVi : ""
      } - ${lastName} ${firstName}`;
      nameEn = `${
        positionData && positionData.valueEn ? positionData.valueEn : ""
      } - ${firstName} ${lastName}`;
    }

    return (
      <div>
        <LoadingOverlay active={isLoading} spinner text="Loading...">
          <React.Fragment>
            <div className="doctor-info-section container">
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
                          onClick={() => this.handleSaveInfoDoctor()}
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
                              {this.state.doctorId}
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
                                <FormattedMessage id="admin.manage-doctor.price" />
                              </label>
                              <Select
                                value={this.state.selectedPrice}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listPrices}
                                placeholder={
                                  <FormattedMessage id="admin.manage-doctor.price" />
                                }
                                name="selectedPrice"
                              />
                            </div>
                            <div className="col-4 form-group">
                              <label>
                                <FormattedMessage id="admin.manage-doctor.payment" />
                              </label>
                              <Select
                                value={this.state.selectedPayment}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listPayments}
                                placeholder={
                                  <FormattedMessage id="admin.manage-doctor.payment" />
                                }
                                name="selectedPayment"
                              />
                            </div>
                            <div className="col-4 form-group">
                              <label>
                                <FormattedMessage id="admin.manage-doctor.province" />
                              </label>
                              <Select
                                value={this.state.selectedProvince}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listProvinces}
                                placeholder={
                                  <FormattedMessage id="admin.manage-doctor.province" />
                                }
                                name="selectedProvince"
                              />
                            </div>

                            <div className="col-4 form-group">
                              <label>
                                <FormattedMessage id="admin.manage-doctor.addressClinic" />
                              </label>
                              <input
                                className="form-control"
                                onChange={(event) =>
                                  this.handleOnChangeInput(
                                    event,
                                    "addressClinic"
                                  )
                                }
                                placeholder={
                                  <FormattedMessage
                                    id={"admin.manage-doctor.addressClinic"}
                                  />
                                }
                                value={this.state.addressClinic}
                              />
                            </div>

                            <div className="col-4 form-group">
                              <label>
                                {" "}
                                <FormattedMessage id="admin.manage-doctor.specialty-label" />
                              </label>
                              <Select
                                value={this.state.selectedSpecialty}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={listSpecialty}
                                placeholder={
                                  <FormattedMessage id="admin.manage-doctor.specialty-label" />
                                }
                                name="selectedSpecialty"
                              />
                            </div>
                            <div className="col-4 form-group">
                              <label>
                                {" "}
                                <FormattedMessage id="admin.manage-doctor.clinic-label" />
                              </label>
                              <Select
                                value={this.state.selectedClinic}
                                onChange={this.handleChangeSelectDoctorInfor}
                                options={this.state.listClinic}
                                placeholder={
                                  <FormattedMessage id="admin.manage-doctor.clinic-label" />
                                }
                                name="selectedClinic"
                              />{" "}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
                <div className="contact-card-container col-6">
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
                                value={this.state.selectedStatus}
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
                <div className="chart-container col-6">
                  <div className="chart-content">
                    <div className="chart col-12 row">
                      <div className="title col-6 form-control info">
                        <span>
                          <FormattedMessage id={"doctor.chart-label"} />
                        </span>
                      </div>

                      <div className="quanlity-chart col-12 ">
                        <Chart
                          className="chart-picture"
                          chartType="LineChart"
                          data={dataChart}
                          options={frameChart}
                          //   options={options}
                          width="500px"
                          height="400px"
                          legendToggle
                        />
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    getRequiredDoctorInfo: () => dispatch(actions.getRequiredDoctorInfo()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctorInfo);
