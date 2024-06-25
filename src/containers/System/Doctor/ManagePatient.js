import React, { Component } from "react";
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

  async componentDidMount() {
    await this.getDataPatient();
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
      } else {
        toast.error("Failed to fetch patient data");
      }
    } catch (error) {
      console.log("Error fetching patient data:", error);
      toast.error("Failed to fetch patient data");
    }
  };

  handleOnChangeDatePicker = async (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };

  handleBtnConfirmDeposit = async (item) => {
    try {
      let { patientId } = item;
      let { user } = this.props;
      let { currentDate } = this.state;
      let formattedDate = new Date(currentDate).getTime();

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
        await this.getDataPatient();
      } else {
        toast.error("Error depositing");
      }
    } catch (error) {
      console.log("Error depositing:", error);
      toast.error("Error depositing");
    }
  };

  handleBtnConfirmCancel = async (item) => {
    try {
      let { user } = this.props;
      let { currentDate } = this.state;
      let formattedDate = new Date(currentDate).getTime();

      let { patientId } = item;
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
        await this.getDataPatient();
      } else {
        toast.error("Error canceling");
      }
    } catch (error) {
      console.log("Error canceling:", error);
      toast.error("Error canceling");
    }
  };

  sendRemedy = async (data) => {
    try {
      let { dataModal } = this.state;
      this.setState({
        isLoading: true,
      });

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

      if (res && res.errCode === 0) {
        toast.success("Sent");
        this.closeRemedyModal();
        await this.getDataPatient();
      } else {
        toast.error("Error sending remedy");
      }

      this.setState({
        isLoading: false,
      });
    } catch (error) {
      console.log("Error sending remedy:", error);
      toast.error("Error sending remedy");
      this.setState({
        isLoading: false,
      });
    }
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
    });
  };

  handleBtnConfirmComplete = (item) => {
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
      console.log("Error confirming complete:", error);
      toast.error("Error confirming complete");
    }
  };

  render() {
    let { isLoading, dataPatient, isOpenRemedyModal, dataModal } = this.state;
    let { language } = this.props;

    return (
      <div>
        <LoadingOverlay active={isLoading} spinner text="Loading...">
          <div className="manage-patient-container">{/* Render content */}</div>
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
