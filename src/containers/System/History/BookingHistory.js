import React, { Component } from "react";
import "./BookingHistory.scss";
import { connect } from "react-redux";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { FormattedMessage } from "react-intl"; // Import FormattedMessage từ react-intl

class HistoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicalHistory: [
        {
          id: 1,
          doctorId: 101,
          patientId: 201,
          date: "2024-06-13",
          location: "Hospital A",
          time: "10:00 AM",
          price: "$50",
          status: "completed",
        },
        {
          id: 2,
          doctorId: 102,
          patientId: 202,
          date: "2024-06-14",
          location: "Clinic B",
          time: "11:30 AM",
          price: "$70",
          status: "cancelled",
        },
        // Thêm các dữ liệu khác nếu cần
      ],
    };
  }

  render() {
    const { medicalHistory } = this.state;
    const { language } = this.props; // Lấy ngôn ngữ từ global state

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
              <FormattedMessage id="history.reason" />
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
          {medicalHistory.map((historyItem) => (
            <div key={historyItem.id} className="history-item">
              <div>{historyItem.id}</div>
              <div>{historyItem.patientId}</div>
              <div>{historyItem.patientName}</div>
              <div>{historyItem.reason}</div>
              <div>{historyItem.location}</div>
              <div>{historyItem.phoneNumber}</div>
              <div>{historyItem.price}</div>
              <div className="status-icon">
                {historyItem.status === "completed" && (
                  <FaCheckCircle color="green" />
                )}
                {historyItem.status === "cancelled" && (
                  <FaTimesCircle color="red" />
                )}
                {historyItem.status === "pending" && <FaClock color="orange" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language, // Lấy giá trị ngôn ngữ từ global state
  };
};

export default connect(mapStateToProps)(HistoryComponent);
