import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { postVerifyBooking } from "../../services/userService";
import HomeHeader from "../HomePage/HomeHeader";
import "./VerifyEmail.scss";
class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusVerify: false,
      errCode: 0,
    };
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  async componentDidMount() {
    if (this.props.location && this.props.location.search) {
      let urlParams = new URLSearchParams(this.props.location.search);
      let token = urlParams.get("token");
      let doctorId = urlParams.get("doctorId");
      let res = await postVerifyBooking({
        token: token,
        doctorId: doctorId,
      });
      if (res && res.errCode === 0) {
        this.setState({
          statusVerify: true,
          errCode: res.errCode,
        });
      } else {
        this.setState({
          statusVerify: true,
          errCode: res && res.errCode ? res.errCode : -1,
        });
      }
    }
  }

  render() {
    let { statusVerify, errCode } = this.state;
    console.log("check errCode: ", errCode);
    return (
      <div>
        <>
          <HomeHeader />
          <div className="verify-email-container">
            {statusVerify === false ? (
              <div>Loading... </div>
            ) : (
              <div>
                {+errCode === 0 ? (
                  <div className="info-booking">
                    Xác nhận lịch hẹn thành công
                  </div>
                ) : (
                  <div className="info-booking">
                    Lịch hẹn không tồn tại hoặc đã đươc xác nhận từ trước!
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
