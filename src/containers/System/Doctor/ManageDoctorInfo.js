import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ManageDoctorInfo.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import { getDetailInfoDoctor } from "../../../services/userService";

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

      //list data
      positionData: {},
    };
  }
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
    }
  }
  handleOnChangeText = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  async componentDidMount() {
    let { user } = this.props;
    await this.props.getRequiredDoctorInfo();
    this.buildDataSelect();
    let addressClinic = "",
      email = "",
      phoneNumber = "",
      nameClinic = "",
      paymentId = "",
      priceId = "",
      provinceId = "",
      selectedPrice = "",
      selectedPayment = "",
      selectedProvince = "",
      selectedSpecialty = "",
      selectedClinic = "",
      selectedStatus = "",
      clinicId = "",
      specialtyId = "",
      positionId = "",
      statusId = "",
      doctorId = "";

    let {
      listPrices,
      listPayments,
      listProvinces,
      listSpecialty,
      listClinic,
      listStatus,
    } = this.state;

    let res = await getDetailInfoDoctor(user.id);
    console.log("cehck res", res);
    if (res.data.Doctor_Info) {
      addressClinic = res.data.Doctor_Info.addressClinic;
      nameClinic = res.data.Doctor_Info.nameClinic;
      clinicId = res.data.Doctor_Info.clinicId;
      priceId = res.data.Doctor_Info.priceId;
      paymentId = res.data.Doctor_Info.paymentId;
      provinceId = res.data.Doctor_Info.provinceId;
      specialtyId = res.data.Doctor_Info.specialtyId;
      positionId = res.data.Doctor_Info.positionId;
      doctorId = res.data.id;
      email = res.data.email;
      statusId = res.data.Doctor_Info.statusId;

      phoneNumber = res.data.phoneNumber;
      selectedPrice = listPrices.find((item) => {
        return item && item.value === priceId;
      });
      selectedPayment = listPayments.find((item) => {
        return item && item.value === paymentId;
      });
      selectedProvince = listProvinces.find((item) => {
        return item && item.value === provinceId;
      });
      selectedSpecialty = listSpecialty.find((item) => {
        return item && item.value === specialtyId;
      });
      selectedClinic = listClinic.find((item) => {
        return item && item.value === clinicId;
      });
      selectedStatus = listStatus.find((item) => {
        return item && item.value === statusId;
      });
      this.setState({
        firstName: res.data.firstName,
        lastName: res.data.lastName,

        addressClinic: addressClinic,
        priceId: res.data.Doctor_Info.priceId,
        paymentId: res.data.Doctor_Info.paymentId,
        provinceId: res.data.Doctor_Info.provinceId,
        specialtyId: res.data.Doctor_Info.specialtyId,

        nameClinic: nameClinic,
        positionId: positionId,
        selectedPrice: selectedPrice,
        selectedPayment: selectedPayment,
        selectedProvince: selectedProvince,
        selectedSpecialty: selectedSpecialty,
        selectedClinic: selectedClinic,
        selectedStatus: selectedStatus,
        positionData: res.data.positionData,
        doctorId: doctorId,
        email: email,
        phoneNumber: phoneNumber,
        statusId: statusId,
      });
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
  handleSaveInfoDoctor = () => {
    this.props.saveDetailDoctor({
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
    });
  };
  render() {
    console.log("check state: ", this.state);
    let { listSpecialty, positionData, lastName, firstName } = this.state;
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
      <div className="doctor-info-section container">
        <div className="row">
          <div className="profile-card-container col-12">
            <div className="profile-card-content">
              <div className="profile-card col-12 row">
                <div className="title col-12">
                  <span>Doctor's profile</span>
                  <button className="btn-submit">Save change</button>
                </div>
                <div className="info col-12 container ">
                  <div className="row">
                    <div className="avatar-image form-control"></div>
                    <div className="detail-info col-10 row">
                      <div className="name form-control info">
                        {language === LANGUAGES.VI ? nameVi : nameEn}
                      </div>
                      <div className="id form-control info">
                        ID: {this.state.doctorId}
                      </div>
                      <div className="form-control info">
                        <button className="btn-change-password">
                          Change password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="edit-info col-12 container mt-3">
                  <div className="row">
                    <div className="first-name col-6 form-group mb-5">
                      <label className="input-label-fname">First name</label>
                      <input
                        className="fname-input form-control"
                        placeholder="Your name"
                        onChange={(event) =>
                          this.handleOnChangeText(event, "addressClinic")
                        }
                        value={this.state.firstName}
                      />
                    </div>
                    <div className="last-name col-6 row form-group mb-5">
                      <label className="input-label-lname">Last name</label>
                      <input
                        className="fname-input form-control"
                        placeholder="Your name"
                        onChange={(event) =>
                          this.handleOnChangeText(event, "addressClinic")
                        }
                        value={this.state.lastName}
                      />
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
                            this.handleOnChangeText(event, "addressClinic")
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
                  <span>Doctor's contact</span>
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
                      <label className="input-label-fname">Phone</label>
                      <input
                        className="fname-input form-control"
                        placeholder="Your name"
                        onChange={(event) =>
                          this.handleOnChangeText(event, "phoneNumber")
                        }
                        value={this.state.phoneNumber}
                      />
                    </div>
                    <div className="last-name col-6 row form-group mb-5">
                      <label className="input-label-lname">Email</label>
                      <input
                        className="fname-input form-control"
                        placeholder="Your name"
                        onChange={(event) =>
                          this.handleOnChangeText(event, "email")
                        }
                        value={this.state.email}
                      />
                    </div>
                    <div className="more-info-extra row col-12">
                      <div className="col-12 form-group">
                        <label>
                          <FormattedMessage id="admin.manage-doctor.statusId" />
                        </label>
                        <Select
                          value={this.state.selectedStatus}
                          onChange={this.handleChangeSelectDoctorInfor}
                          options={this.state.listStatus}
                          placeholder={
                            <FormattedMessage id="admin.manage-doctor.statusId" />
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
          <div className="contact-card-container col-6">
            <div className="contact-card-content">
              <div className="contact-card col-12 row">
                <div className="title col-6 form-control info">
                  <span>Doctor's contact</span>
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
                        {" "}
                        (+84) 0364821047
                      </div>
                      <div className="id form-control info">
                        vietle632@gmail.com
                      </div>
                    </div>
                  </div>
                </div>
                <div className="edit-info col-12 container mt-3">
                  <div className="row">
                    <div className="first-name col-6 form-group mb-5">
                      <label className="input-label-fname">First name</label>
                      <input
                        className="fname-input form-control"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="last-name col-6 row form-group mb-5">
                      <label className="input-label-lname">Last name</label>
                      <input
                        className="fname-input form-control"
                        placeholder="Your name"
                      />
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
                            this.handleOnChangeText(event, "addressClinic")
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
        </div>
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
