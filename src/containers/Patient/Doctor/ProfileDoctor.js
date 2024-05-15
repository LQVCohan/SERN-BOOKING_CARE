import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ProfileDoctor.scss";
import { getProfileDoctorById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import NumberFormat from "react-number-format";
import _ from "lodash";
import moment from "moment";
class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: {},
    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.doctorId !== prevProps.doctorId) {
      //  this.getInfoDoctor(this.props.doctorId);
    }
  }
  async componentDidMount() {
    let data = await this.getInfoDoctor(this.props.doctorId);
    console.log("Data: ", data);
    this.setState({
      dataProfile: data,
    });
  }
  getInfoDoctor = async (id) => {
    let result = {};
    if (id) {
      let res = await getProfileDoctorById(id);
      if (res && res.errCode === 0) {
        console.log("OK: ", res);
        result = res.data;
      }
      console.log("check data: ", result);
    }
    return result;
  };
  renderTimeBooking = (dataTime) => {
    let { language } = this.props;
    let time =
      language === LANGUAGES.VI
        ? dataTime.timeTypeData.valueVi
        : dataTime.timeTypeData.valueEn;
    let date =
      language === LANGUAGES.VI
        ? moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
        : moment
            .unix(+dataTime.date / 1000)
            .locale("en")
            .format("ddd - MM/DD/YYYY");
    if (dataTime && !_.isEmpty(dataTime)) {
      return (
        <>
          <div>Ngày: {date}</div>
          <div>Thời gian: {time}</div>

          <div>Miễn phí đặt lịch</div>
        </>
      );
    }
    return "";
  };
  render() {
    let { dataProfile } = this.state;
    let { language, isShowDesDotor, dataTime } = this.props;
    let nameVi = "",
      nameEn = "";
    if (dataProfile && dataProfile.positionData) {
      nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
      nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
    }
    console.log("Check props: ", dataTime);
    return (
      <div className="profile-doctor-container">
        <div className="intro-doctor">
          <div
            className="content-left"
            style={{
              backgroundImage: `url(${
                dataProfile && dataProfile.image ? dataProfile.image : ""
              })`,
            }}
          ></div>
          <div className="content-right">
            <div className="up">
              {language === LANGUAGES.VI ? nameVi : nameEn}
            </div>
            <div className="down">
              {isShowDesDotor === true ? (
                <>
                  {dataProfile.Markdown && dataProfile.Markdown.description && (
                    <span> {dataProfile.Markdown.description}</span>
                  )}
                </>
              ) : (
                <>{this.renderTimeBooking(dataTime)}</>
              )}
            </div>
          </div>
        </div>
        <div className="price">
          Giá khám:{" "}
          {dataProfile &&
            dataProfile.Doctor_Info &&
            language === LANGUAGES.VI && (
              <NumberFormat
                className="currency"
                value={dataProfile.Doctor_Info.priceData.valueVi}
                displayType={"text"}
                thousandSeparator={true}
                suffix=" VND"
              />
            )}
          {dataProfile &&
            dataProfile.Doctor_Info &&
            language === LANGUAGES.EN && (
              <NumberFormat
                className="currency"
                value={dataProfile.Doctor_Info.priceData.valueEn}
                displayType={"text"}
                thousandSeparator={true}
                suffix=" $"
              />
            )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
