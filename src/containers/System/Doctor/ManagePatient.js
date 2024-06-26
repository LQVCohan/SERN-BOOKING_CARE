import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getListPatient,
  postSendRemedy,
  UpdateStatusPatientByRequest,
  getStatusByPatientId,
} from "../../../services/userService";
import moment from "moment";
import { LANGUAGES } from "../../../utils";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import { FormattedMessage } from "react-intl";
class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isLoading: false,
      preStatusId: "",
    };
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  async componentDidMount() {
    this.getDataPatient();
  }
  getDataPatient = async () => {
    try {
      let { user } = this.props;
      let { currentDate } = this.state;
      let formattedDate = new Date(currentDate).getTime();

      let res = await getListPatient({
        doctorId: user.id,
        date: formattedDate,
      });
      if (res && res.errCode === 0) {
        this.setState({
          dataPatient: res.data,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  handleOnChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };
  // saveStatusBefore = async (item) => {
  //   let { patientId } = item;
  //   let { user } = this.props;
  //   let { currentDate } = this.state;
  //   let formattedDate = new Date(currentDate).getTime();

  //   let statusIdNow = await getStatusByPatientId({
  //     patientId: patientId,
  //     doctorId: user.id,
  //     date: formattedDate,
  //     timeType: item.timeType,
  //   });

  //   this.setState({
  //     preStatusId: statusIdNow.statusId,
  //   });
  //   console.log("check pre status Id: ", this.state.preStatusId);
  // };
  handleBtnConfirmComplete = (item) => {
    //    this.saveStatusBefore(item.statusId);
    try {
      let data = {
        doctorId: item.doctorId,
        patientId: item.patientId,
        email: item.patientData.email,
        timeType: item.timeType,
        firstName: item.patientData.firstName,
        lastName: item.patientData.lastName,
        paymentId: item.payment,
      };

      this.setState({
        isOpenRemedyModal: true,
        dataModal: data,
      });
    } catch (error) {
      console.log(error);
    }
  };
  handleBtnConfirmDeposit = async (item) => {
    try {
      let { patientId } = item;
      let { user } = this.props;
      let { currentDate } = this.state;
      let formattedDate = new Date(currentDate).getTime();

      //   this.saveStatusBefore(item);

      let res = await UpdateStatusPatientByRequest({
        patientId: patientId,

        statusId: "S3",
        doctorId: user.id,
        date: formattedDate,
        timeType: item.timeType,
      });
      if (res && res.errCode === 0) {
        toast.success("Deposited");
        this.setState({ preStatusId: "S3" });
      } else {
        toast.error("Error!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  handleBtnConfirmCancel = async (item) => {
    try {
      let { user } = this.props;
      let { currentDate } = this.state;
      let formattedDate = new Date(currentDate).getTime();

      let { patientId } = item;
      console.log("check patient Id: ", patientId);
      let res = await UpdateStatusPatientByRequest({
        patientId: patientId,

        statusId: "S5",
        doctorId: user.id,
        date: formattedDate,
        timeType: item.timeType,
      });
      if (res && res.errCode === 0) {
        toast.success("Canceled");
        this.setState({ preStatusId: "S5" });
      } else {
        toast.error("Error!");
      }
    } catch (error) {
      console.log(error);
    }
    // this.saveStatusBefore(item);
  };
  sendRemedy = async (data) => {
    try {
      let { dataModal } = this.state;
      this.setState({
        isLoading: true,
      });
      console.log("check data", data);
      console.log("check dataModal", dataModal);
      let { currentDate } = this.state;
      let formattedDate = new Date(currentDate).getTime();

      let res = await postSendRemedy({
        email: data.email,
        imgBase64: data.imgBase64,
        doctorId: dataModal.doctorId,
        patientId: dataModal.patientId,
        timeType: dataModal.timeType,
        language: this.props.language,
        patientFirstName: dataModal.firstName,
        patientLastName: dataModal.lastName,
        paymentId: dataModal.paymentId,
        date: formattedDate,
      });
      console.log("res ", res);
      if (res && res.errCode === 0) {
        this.setState({ isLoading: false });
        toast.success("Sent");
        this.closeRemedyModal();
        await this.getDataPatient();
      } else {
        this.setState({ isLoading: false });
        toast.error("Error!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
    });
  };
  // handleBtnRollBack = async (item) => {
  //   let { patientId } = item;
  //   let { preStatusId } = this.state;
  //   let { user } = this.props;
  //   let { currentDate } = this.state;
  //   let formattedDate = new Date(currentDate).getTime();

  //   console.log("check status pre Id: ", preStatusId);
  //   let statusIdNow = await getStatusByPatientId({
  //     patientId: patientId,
  //     doctorId: user.id,
  //     date: formattedDate,
  //     timeType: item.timeType,
  //   });
  //   console.log("check now: ", statusIdNow);
  //   let res = await UpdateStatusPatientByRequest({
  //     patientId: patientId,
  //     statusIdFirst: statusIdNow.statusId,
  //     statusIdSecond: preStatusId,
  //     doctorId: user.id,

  //     date: formattedDate,
  //     timeType: item.timeType,
  //   });
  //   if (res && res.errCode === 0) {
  //     //     window.location.reload();
  //   } else {
  //     toast.error("Error!");
  //   }
  // };
  render() {
    console.log("check props paitent: ", this.state.dataPatient);
    let { isLoading, dataPatient, isOpenRemedyModal, dataModal } = this.state;
    let { language } = this.props;
    console.log("check data modal: ", dataModal);

    return (
      <div>
        <LoadingOverlay active={isLoading} spinner text="Loading...">
          <div className="manage-patient-container">
            <div className="m-p-title">
              <FormattedMessage id={"doctor.manage-patient-label"} />
            </div>
            <div className="m-p-body row">
              <div className="col-3 form-group">
                <label className="">
                  <FormattedMessage id={"doctor.choose-date"} />
                </label>
                <DatePicker
                  className="form-control"
                  onChange={this.handleOnChangeDatePicker}
                  value={this.state.currentDate}
                />
              </div>
            </div>
            <div className="col-12 m-p-table">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">
                      <FormattedMessage id={"doctor.on"} />
                    </th>
                    <th scope="col">
                      <FormattedMessage id={"doctor.time"} />
                    </th>
                    <th scope="col">
                      <FormattedMessage id={"doctor.first-name"} />
                    </th>
                    <th scope="col">
                      <FormattedMessage id={"doctor.last-name"} />
                    </th>

                    <th scope="col">
                      <FormattedMessage id={"doctor.address"} />
                    </th>
                    <th scope="col">
                      <FormattedMessage id={"doctor.gender"} />
                    </th>
                    <th scope="col">
                      <FormattedMessage id={"doctor.payment"} />
                    </th>
                    <th scope="col">
                      <FormattedMessage id={"doctor.status"} />
                    </th>
                    <th scope="col">
                      <FormattedMessage id={"doctor.reason"} />
                    </th>
                    <th scope="col">
                      <FormattedMessage id={"doctor.action"} />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dataPatient &&
                    dataPatient.length > 0 &&
                    dataPatient.map((item, index) => {
                      let time =
                        language === LANGUAGES.VI
                          ? item.timeTypeDataPatient.valueVi
                          : item.timeTypeDataPatient.valueEn;
                      let gender =
                        language === LANGUAGES.VI
                          ? item.patientData.genderData.valueVi
                          : item.patientData.genderData.valueEn;
                      let payment =
                        language === LANGUAGES.VI
                          ? item.paymentDataPatient.valueVi
                          : item.paymentDataPatient.valueEn;
                      let status =
                        language === LANGUAGES.VI
                          ? item.statusDataPatient.valueVi
                          : item.statusDataPatient.valueEn;
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{time}</td>
                          <td>{item.patientData.firstName}</td>
                          <td>{item.patientData.lastName}</td>
                          <td>{item.patientData.address}</td>
                          <td>{gender}</td>
                          <td>{payment}</td>
                          <td>{status}</td>
                          <td>{item.reason}</td>

                          <td className="">
                            <button
                              className="btn-confirm btn btn-info ml-3"
                              onClick={() => this.handleBtnConfirmDeposit(item)}
                            >
                              Đã nhận cọc
                            </button>
                            <button
                              className="btn-confirm btn btn-success ml-3"
                              onClick={() =>
                                this.handleBtnConfirmComplete(item)
                              }
                            >
                              Xác nhận hoàn tất
                            </button>
                            <button
                              className="btn-confirm btn btn-danger ml-3"
                              onClick={() => this.handleBtnConfirmCancel(item)}
                            >
                              Hủy
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
          <RemedyModal
            isOpenModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
        </LoadingOverlay>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
