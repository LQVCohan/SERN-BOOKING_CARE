import React, { Component } from "react";
import { connect } from "react-redux";
import "./ProfileDoctor.scss";
import { getProfileDoctorById } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import NumberFormat from "react-number-format";
import _ from "lodash";
import moment from "moment";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: {},
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.doctorId !== prevProps.doctorId) {
      this.getInfoDoctor(this.props.doctorId);
    }
  }

  async componentDidMount() {
    this.getInfoDoctor(this.props.doctorId);
  }

  getInfoDoctor = async (id) => {
    try {
      let result = {};
      if (id) {
        let res = await getProfileDoctorById(id);
        if (res && res.errCode === 0) {
          result = res.data;
          console.log("Doctor profile data:", result);
        } else {
          console.error("Error fetching doctor profile:", res.errMessage);
        }
      }
      this.setState({
        dataProfile: result,
      });
      return result;
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
      return {};
    }
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
    return null;
  };

  render() {
    let { dataProfile } = this.state;
    let {
      language,
      isShowDesDoctor,
      dataTime,
      isShowLinkDetail,
      isShowPrice,
      doctorId,
    } = this.props;
    let nameVi = "",
      nameEn = "";
    if (dataProfile && dataProfile.positionData) {
      nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
      nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
    }
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
              {isShowDesDoctor === true ? (
                <>
                  {dataProfile.Markdown && dataProfile.Markdown.description && (
                    <span> {dataProfile.Markdown.description}</span>
                  )}
                </>
              ) : (
                <> {this.renderTimeBooking(dataTime)}</>
              )}
            </div>
          </div>
        </div>
        {isShowLinkDetail === true && (
          <div className="view-detail-doctor">
            <Link to={`/detail-doctor/${doctorId}`}>Xem thêm</Link>
          </div>
        )}
        {isShowPrice && (
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
        )}
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
