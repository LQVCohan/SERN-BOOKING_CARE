import React, { Component } from "react";
import { connect } from "react-redux";
import "./AppointmentPatient.scss";
import HomeFooter from "../../HomePage/HomeFooter";
import HomeHeader from "../../HomePage/HomeHeader";

import { FormattedMessage } from "react-intl";
import Select from "react-select";
import { LANGUAGES, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import {
  getProfilePatientById,
  editUserService,
  getAllBookingById,
  UpdateStatusPatientByRequest,
} from "../../../services/userService";
import LoadingOverlay from "react-loading-overlay";
import moment from "moment";
import validator from "validator";
import { MdErrorOutline } from "react-icons/md";
import ChangePassword from "../../System/Doctor/Modal/ChangePassword";
import { add } from "lodash";
import DatePicker from "react-flatpickr";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

class AppointmentPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listBooking: [],
      patientId: "",
      isOpenConfirmModal: false,
      dataModal: {},
    };
  }

  closeConfirmModal = () => {
    this.setState({
      isOpenConfirmModal: false,
    });
  };

  openModalConfirmCancel = (item) => {
    this.setState({
      isOpenConfirmModal: true,
      dataModal: item,
    });
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
      try {
        if (
          this.props.match &&
          this.props.match.params &&
          this.props.match.params.id
        ) {
          let patientId = this.props.match.params.id;
          console.log("check patientId: ", patientId);
          this.setState({
            patientId: patientId,
          });
          let res = await getAllBookingById(patientId);
          console.log("cehck res booking all: ", res);
          if (res && res.errCode === 0) {
            this.setState({
              listBooking: res.data,
            });
          }
        }
      } catch (error) {
        console.error("Error in componentDidUpdate:", error);
      }
    }
  }

  async componentDidMount() {
    try {
      if (
        this.props.match &&
        this.props.match.params &&
        this.props.match.params.id
      ) {
        let patientId = this.props.match.params.id;
        console.log("check patientId: ", patientId);
        this.setState({
          patientId: patientId,
        });
        let res = await getAllBookingById(patientId);
        console.log("cehck res booking all: ", res);
        if (res && res.errCode === 0) {
          this.setState({
            listBooking: res.data,
          });
        }
      }
    } catch (error) {
      console.error("Error in componentDidMount:", error);
    }
  }

  acceptCancel = async (item) => {
    try {
      let { patientId, doctorId, date, timeType } = item;
      console.log("cehck date: ", date);

      let res = await UpdateStatusPatientByRequest({
        patientId: patientId,
        statusId: "S5",
        doctorId: doctorId,
        date: date,
        timeType: timeType,
      });
      if (res && res.errCode === 0) {
        toast.success("Canceled");
      } else {
        toast.error("Error!");
      }
    } catch (error) {
      console.error("Error in acceptCancel:", error);
    }
  };

  render() {
    console.log("check state: ", this.state);
    let { listBooking, isOpenConfirmModal, dataModal } = this.state;
    let { language } = this.props;
    console.log("check language: ", language);
    return (
      <>
        <HomeHeader />
        <div className="all-booking-container">
          <div className="all-booking-content col-12 container">
            <div className="all-booking-label col-12">
              <span>Quản lý lịch khám cá nhân</span>
            </div>
            <div className="all-booking-child container">
              <div className="col-12 row">
                {listBooking &&
                  listBooking.length > 0 &&
                  listBooking.map((item, index) => {
                    let imageBase64 = "";
                    if (item.doctorBookingData.image) {
                      imageBase64 = new Buffer(
                        item.doctorBookingData.image,
                        "base64"
                      ).toString("binary");
                    }
                    let nameVi = `${item.doctorBookingData.lastName} ${item.doctorBookingData.firstName}`;
                    let nameEn = `${item.doctorBookingData.firstName} ${item.doctorBookingData.lastName}`;
                    let payment =
                      language === LANGUAGES.VI
                        ? "Phương thức thanh toán: " +
                          item.paymentDataPatient.valueVi
                        : "Payment method: " + item.paymentDataPatient.valueEn;
                    let time =
                      language === LANGUAGES.VI
                        ? item.timeTypeDataPatient.valueVi
                        : item.timeTypeDataPatient.valueEn;
                    let price =
                      language === LANGUAGES.VI
                        ? "Giá: " +
                          item.doctorBookingData.Doctor_Info.priceData.valueVi +
                          " VNĐ"
                        : "Cost: " +
                          item.doctorBookingData.Doctor_Info.priceData.valueEn +
                          "$";
                    let clinicName =
                      item.doctorBookingData.Doctor_Info.clinicData.name;
                    let clinicAddress =
                      item.doctorBookingData.Doctor_Info.clinicData.address;
                    let status =
                      language === LANGUAGES.VI
                        ? item.statusDataPatient.valueVi
                        : item.statusDataPatient.valueEn;
                    let statusId = item.statusId;
                    if (statusId !== "S5") {
                      return (
                        <>
                          <div className="child form-control m-1" key={index}>
                            <div className="left">
                              <div
                                className="image"
                                style={{
                                  backgroundImage: `url(${imageBase64})`,
                                }}
                              ></div>
                              <div className="name">
                                <span>Bác sĩ</span>
                                <span>
                                  {language === LANGUAGES.VI ? nameVi : nameEn}
                                </span>
                              </div>
                            </div>
                            <div className="right">
                              <div className="clinic">{clinicName}</div>
                              <div className="address">{clinicAddress}</div>
                              <div className="date">
                                {moment
                                  .unix(+item.date / 1000)
                                  .format("dddd - DD/MM/YYYY")}
                              </div>
                              <div className="time">{time}</div>
                              <div className="cost">{price}</div>
                              <div className="payment">{payment}</div>
                              <div className="status">
                                {status}
                                <div
                                  className="cancel"
                                  onClick={() =>
                                    this.openModalConfirmCancel(item)
                                  }
                                >
                                  Hủy
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="footer">
                            <spam>
                              Kiểm tra email để xác nhận đặt lịch và thanh toán
                              cọc 50%
                            </spam>
                          </div>
                        </>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </div>
        <ConfirmModal
          isOpenModal={isOpenConfirmModal}
          closeConfirmModal={this.closeConfirmModal}
          acceptCancel={this.acceptCancel}
          dataPatient={dataModal}
        />
        <HomeFooter />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentPatient);
