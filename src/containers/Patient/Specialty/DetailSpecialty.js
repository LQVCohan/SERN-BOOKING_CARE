import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import { withRouter } from "react-router";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getDetailSpecialtyById,
  getAllCodeService,
} from "../../../services/userService";
import _ from "lodash";
import { LANGUAGES } from "../../../utils";
import HomeFooter from "../../HomePage/HomeFooter";
class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataDetailSpecialty: {},
      listProvince: [],
    };
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {}
  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let arrDoctorId = [];
      let res = await getDetailSpecialtyById({
        id: id,
        location: "ALL",
      });
      let resProvince = await getAllCodeService("PROVINCE");

      if (res && res.errCode === 0 && resProvince.errCode === 0) {
        let data = res.data;
        if (data && !_.isEmpty(data)) {
          let arr = data.doctorSpecialty;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }

        let dataProvince = resProvince.data;
        let result = [];
        if (dataProvince && dataProvince.length > 0) {
          dataProvince.unshift({
            createAt: null,
            keyMap: "ALL",
            type: "PROVINCE",
            valueEn: "ALL",
            valueVi: "Toàn quốc",
          });
        }
        result = dataProvince;
        this.setState({
          dataDetailSpecialty: res.data,
          arrDoctorId: arrDoctorId,
          listProvince: result,
        });
      }
    }
  }

  handleViewDetailDoctor = (doctor) => {
    console.log("Cohan check view info: ", doctor);
    this.props.history.push(`/detail-doctor/${doctor.id}`);
  };
  handleOnChangeSelect = async (event) => {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let location = event.target.value;
      let id = this.props.match.params.id;

      let res = await getDetailSpecialtyById({
        id: id,
        location: location,
      });
      let arrDoctorId = [];
      if (res && res.errCode === 0) {
        let data = res.data;
        if (data && !_.isEmpty(data)) {
          let arr = data.doctorSpecialty;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }
      }
      this.setState({
        dataDetailSpecialty: res.data,
        arrDoctorId: arrDoctorId,
      });
    }
  };

  render() {
    let { listProvince, arrDoctorId, dataDetailSpecialty } = this.state;
    let { language } = this.props;
    console.log("check state arry ", this.state);
    return (
      <div className="detail-specialty-container">
        <HomeHeader />
        <div className="description-specialty">
          {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) && (
            <div
              dangerouslySetInnerHTML={{
                __html: dataDetailSpecialty.descriptionHTML,
              }}
            ></div>
          )}
        </div>
        <div className="search-province-doctor">
          <select onChange={(event) => this.handleOnChangeSelect(event)}>
            {listProvince &&
              listProvince.length > 0 &&
              listProvince.map((item, index) => {
                return (
                  <option key={index} value={item.keyMap}>
                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="detail-specialty-body">
          {arrDoctorId &&
            arrDoctorId.length > 0 &&
            arrDoctorId.map((item, index) => {
              return (
                <div className="each-doctor" key={index}>
                  <div className="ds-content-left">
                    <div className="profile-doctor">
                      <ProfileDoctor
                        doctorId={item}
                        isShowDesDoctor={true}
                        isShowLinkDetail={true}
                        isShowPrice={false}
                        //  dataTime={dataTime}
                      />
                    </div>
                  </div>
                  <div className="ds-content-right">
                    <div className="doctor-schedule">
                      <DoctorSchedule doctorIdFromParent={item} />
                    </div>
                    <div className="doctor-extra-info">
                      <DoctorExtraInfor doctorIdFromParent={item} />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <HomeFooter />
      </div>
    );
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty)
);
