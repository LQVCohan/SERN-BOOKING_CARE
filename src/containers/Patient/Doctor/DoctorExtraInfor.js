import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import "./DoctorExtraInfor.scss";
import {
  getDetailInfoDoctor,
  getScheduleByDateAndDoctor,
  getExtraInfoDoctorById,
} from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import Select from "react-select";
import moment from "moment";
import localization from "moment/locale/vi";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";

class DoctorExtraInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetailInfor: false,
      extraInfo: {},
    };
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      // Xử lý thay đổi ngôn ngữ nếu cần
    }
    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      try {
        let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent);
        console.log("check res: ", res);

        if (res && res.errCode === 0) {
          this.setState({
            extraInfo: res.data,
          });
        }
      } catch (error) {
        console.error("Error in componentDidUpdate:", error);
      }
    }
  }

  async componentDidMount() {
    if (this.props.doctorIdFromParent) {
      try {
        let res = await getExtraInfoDoctorById(this.props.doctorIdFromParent);

        if (res && res.errCode === 0) {
          this.setState({
            extraInfo: res.data,
          });
        }
      } catch (error) {
        console.error("Error in componentDidMount:", error);
      }
    }
  }

  showHideDetailInfor = (status) => {
    try {
      this.setState({
        isShowDetailInfor: status,
      });
    } catch (error) {
      console.error("Error in showHideDetailInfor:", error);
    }
  };

  render() {
    let { isShowDetailInfor, extraInfo } = this.state;
    let { language } = this.props;
    try {
      return (
        <div className="doctor-extra-infor-container">
          <div className="content-up">
            <div className="text-address">
              <FormattedMessage
                id={"patient.extra-info-doctor.label-address"}
              />
            </div>
            <div className="name-clinic">
              {extraInfo && extraInfo.nameClinic ? extraInfo.nameClinic : ""}
            </div>
            <div className="detail-address">
              {extraInfo && extraInfo.addressClinic
                ? extraInfo.addressClinic
                : ""}
            </div>
          </div>
          <div className="content-down">
            {isShowDetailInfor === false && (
              <div className="shot-infor">
                <FormattedMessage id={"patient.extra-info-doctor.label-cost"} />
                {extraInfo &&
                  extraInfo.priceData &&
                  language === LANGUAGES.VI && (
                    <NumberFormat
                      className="currency"
                      value={extraInfo.priceData.valueVi}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix=" VND"
                    />
                  )}
                {extraInfo &&
                  extraInfo.priceData &&
                  language === LANGUAGES.EN && (
                    <NumberFormat
                      className="currency"
                      value={extraInfo.priceData.valueEn}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix="$"
                    />
                  )}
                <span
                  className="detail"
                  onClick={() => this.showHideDetailInfor(true)}
                >
                  <FormattedMessage id={"patient.extra-info-doctor.detail"} />
                </span>
              </div>
            )}
            {isShowDetailInfor === true && (
              <>
                <div className="title-price">
                  <FormattedMessage
                    id={"patient.extra-info-doctor.label-cost"}
                  />
                </div>
                <div className="detail-infor">
                  <div className="price">
                    <span className="left">
                      {" "}
                      <FormattedMessage
                        id={"patient.extra-info-doctor.label-cost"}
                      />
                    </span>
                    <span className="right">
                      {extraInfo &&
                        extraInfo.priceData &&
                        language === LANGUAGES.EN && (
                          <NumberFormat
                            className="currency"
                            value={extraInfo.priceData.valueEn}
                            displayType={"text"}
                            thousandSeparator={true}
                            suffix="$"
                          />
                        )}
                      {extraInfo &&
                        extraInfo.priceData &&
                        language === LANGUAGES.VI && (
                          <NumberFormat
                            className="currency"
                            value={extraInfo.priceData.valueVi}
                            displayType={"text"}
                            thousandSeparator={true}
                            suffix=" VND"
                          />
                        )}
                    </span>
                  </div>
                  <div className="note">
                    {extraInfo && extraInfo.note ? extraInfo.note : ""}
                  </div>
                </div>
                <div className="payment">
                  <FormattedMessage id={"patient.extra-info-doctor.payment"} />
                  {extraInfo &&
                  extraInfo.paymentData &&
                  language === LANGUAGES.VI
                    ? extraInfo.paymentData.valueVi
                    : ""}
                  {extraInfo &&
                  extraInfo.paymentData &&
                  language === LANGUAGES.EN
                    ? extraInfo.paymentData.valueEn
                    : ""}
                </div>
                <div className="hide-price">
                  <span onClick={() => this.showHideDetailInfor(false)}>
                    <FormattedMessage id={"patient.extra-info-doctor.hide"} />
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error in render:", error);
      return <div className="error">An error occurred while rendering.</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
