import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import { getListPatient, postSendRemedy } from "../../../services/userService";
import moment from "moment";
import { LANGUAGES } from "../../../utils";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isLoading: false,
    };
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  async componentDidMount() {
    this.getDataPatient();
  }
  getDataPatient = async () => {
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
  handleBtnConfirm = (item) => {
    console.log("check item", item);
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
  };
  sendRemedy = async (data) => {
    let { dataModal } = this.state;
    this.setState({
      isLoading: true,
    });
    console.log("check data", data);
    console.log("check dataModal", dataModal);

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
  };
  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
    });
  };
  render() {
    console.log("check props paitent: ", this.state.dataPatient);
    let { isLoading, dataPatient, isOpenRemedyModal, dataModal } = this.state;
    let { language } = this.props;
    console.log("check data modal: ", dataModal);

    return (
      <div>
        <LoadingOverlay active={isLoading} spinner text="Loading...">
          <div className="manage-patient-container">
            <div className="m-p-title">Quản lý bệnh nhân khám bệnh</div>
            <div className="m-p-body row">
              <div className="col-3 form-group">
                <label className="">Chọn ngày khám</label>
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
                    <th scope="col">STT</th>
                    <th scope="col">Thời gian</th>
                    <th scope="col">Họ và tên đệm</th>
                    <th scope="col">Tên</th>

                    <th scope="col">Địa chỉ</th>
                    <th scope="col">Giới tính</th>
                    <th scope="col">Phương thức thanh toán</th>
                    <th scope="col">Thao tác</th>
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
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{time}</td>
                          <td>{item.patientData.firstName}</td>
                          <td>{item.patientData.lastName}</td>
                          <td>{item.patientData.address}</td>
                          <td>{gender}</td>
                          <td>{payment}</td>
                          <td>
                            <button
                              className="btn-confirm"
                              onClick={() => this.handleBtnConfirm(item)}
                            >
                              Xác nhận
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
