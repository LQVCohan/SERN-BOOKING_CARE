import React, { Component } from "react";
import "./BookingHistory.scss";
import { connect } from "react-redux";
import { getAllHistoryByDoctorId } from "../../../services/userService";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";
import moment from "moment";
class BookingHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyData: [],
    };
  }

  async componentDidMount() {
    let { userInfo } = this.props;
    let res = await getAllHistoryByDoctorId(userInfo.id);
    console.log("check res his: ", res);
    if (res && res.errCode === 0) {
      this.setState({
        historyData: res.res,
      });
    }
  }

  render() {
    const { historyData } = this.state;
    const { language } = this.props;

    return (
      <div className="history-container">
        <h2>
          <FormattedMessage id="history.title" />
        </h2>
        <div className="history-table">
          <div className="history-header">
            <div>STT</div>
            <div>
              <FormattedMessage id="history.patientId" />
            </div>
            <div>
              <FormattedMessage id="history.patientName" />
            </div>
            <div>
              <FormattedMessage id="history.doctorName" />
            </div>
            <div>
              <FormattedMessage id="history.reason" />
            </div>
            <div>
              <FormattedMessage id="history.time" />
            </div>
            <div>
              <FormattedMessage id="history.date" />
            </div>
            <div>
              <FormattedMessage id="history.location" />
            </div>
            <div>
              <FormattedMessage id="history.phoneNumber" />
            </div>
            <div>
              <FormattedMessage id="history.price" />
            </div>
            <div>
              <FormattedMessage id="history.status" />
            </div>
          </div>
          {historyData.map((historyItem, index) => {
            let nameDoctorVi = `${historyItem.historyData.lastName} ${historyItem.historyData.firstName}`;
            let nameDoctorEn = `${historyItem.historyData.firstName} ${historyItem.historyData.lastName}`;
            let namePatientVi = `${historyItem.historyPatientData.lastName} ${historyItem.historyPatientData.firstName}`;
            let namePatientEn = `${historyItem.historyPatientData.firstName} ${historyItem.historyPatientData.lastName}`;

            let date =
              language === LANGUAGES.VI
                ? moment.unix(+historyItem.date / 1000).format("DD/MM/YYYY")
                : moment
                    .unix(+historyItem.date / 1000)
                    .locale("en")
                    .format("MM/DD/YYYY");
            return (
              <div key={historyItem.id} className="history-item">
                <div>{index + 1}</div>
                <div>{historyItem.patientId}</div>
                <div>
                  {language === LANGUAGES.VI ? namePatientVi : namePatientEn}
                </div>
                <div>
                  {language === LANGUAGES.VI ? nameDoctorVi : nameDoctorEn}
                </div>
                <div>{historyItem.reason}</div>
                <div>{historyItem.timeType}</div>

                <div>{date}</div>
                <div>{historyItem.address}</div>
                <div>{historyItem.phoneNumber}</div>
                <div>
                  {language === LANGUAGES.VI
                    ? `${historyItem.historyData.Doctor_Info.priceData.valueVi}đ`
                    : `${historyItem.historyData.Doctor_Info.priceData.valueEn}$`}
                </div>
                <div className="status-icon">
                  {historyItem.statusId === "Done" && (
                    <FaCheckCircle color="green" />
                  )}
                  {historyItem.statusId === "cancelled" && (
                    <FaTimesCircle color="red" />
                  )}
                  {historyItem.statusId === "processing" && (
                    <FaClock color="orange" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    userInfo: state.user.userInfo,
  };
};

export default connect(mapStateToProps)(BookingHistory);
