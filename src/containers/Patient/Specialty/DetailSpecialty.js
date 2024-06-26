import React, { Component } from "react";
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
      loading: true,
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      if (match && match.params && match.params.id) {
        const id = match.params.id;

        // Fetch detail specialty by ID
        const res = await getDetailSpecialtyById({
          id: id,
          location: "ALL",
        });

        // Fetch all provinces
        const resProvince = await getAllCodeService("PROVINCE");

        if (res && res.errCode === 0 && resProvince.errCode === 0) {
          const data = res.data;
          let arrDoctorId = [];

          if (data && !_.isEmpty(data)) {
            const arr = data.doctorSpecialty;
            if (arr && arr.length > 0) {
              arr.forEach((item) => {
                arrDoctorId.push(item.doctorId);
              });
            }
          }

          let dataProvince = resProvince.data;
          if (dataProvince && dataProvince.length > 0) {
            dataProvince.unshift({
              createAt: null,
              keyMap: "ALL",
              type: "PROVINCE",
              valueEn: "ALL",
              valueVi: "Toàn quốc",
            });
          }

          this.setState({
            dataDetailSpecialty: data,
            arrDoctorId: arrDoctorId,
            listProvince: dataProvince,
            loading: false,
          });
        }
      }
    } catch (error) {
      console.log("Error in componentDidMount:", error);
      // Handle error as needed (e.g., display error message, log error)
      this.setState({ loading: false });
    }
  }

  handleOnChangeSelect = async (event) => {
    try {
      const { match } = this.props;
      if (match && match.params && match.params.id) {
        const location = event.target.value;
        const id = match.params.id;

        // Fetch detail specialty by ID with location filter
        const res = await getDetailSpecialtyById({
          id: id,
          location: location,
        });

        let arrDoctorId = [];
        if (res && res.errCode === 0) {
          const data = res.data;
          if (data && !_.isEmpty(data)) {
            const arr = data.doctorSpecialty;
            if (arr && arr.length > 0) {
              arr.forEach((item) => {
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
    } catch (error) {
      console.log("Error in handleOnChangeSelect:", error);
      // Handle error as needed (e.g., display error message, log error)
    }
  };

  handleViewDetailDoctor = (doctor) => {
    console.log("View doctor info: ", doctor);
    this.props.history.push(`/detail-doctor/${doctor.id}`);
  };

  render() {
    const { listProvince, arrDoctorId, dataDetailSpecialty, loading } =
      this.state;
    const { language } = this.props;

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
          <select onChange={this.handleOnChangeSelect}>
            {listProvince &&
              listProvince.length > 0 &&
              listProvince.map((item, index) => (
                <option key={index} value={item.keyMap}>
                  {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                </option>
              ))}
          </select>
        </div>
        <div className="detail-specialty-body">
          {loading ? (
            <div>Loading...</div>
          ) : (
            arrDoctorId.map((item, index) => (
              <div className="each-doctor" key={index}>
                <div className="ds-content-left">
                  <div className="profile-doctor">
                    <ProfileDoctor
                      doctorId={item}
                      isShowDesDoctor={true}
                      isShowLinkDetail={true}
                      isShowPrice={false}
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
            ))
          )}
        </div>
        <HomeFooter />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
});

export default withRouter(connect(mapStateToProps)(DetailSpecialty));
