import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./DetailClinic.scss";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";

import { withRouter } from "react-router";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getDetailSpecialtyById,
  getDetailClinicById,
  getAllCodeService,
} from "../../../services/userService";
import _ from "lodash";

class DetailClinic extends Component {
  constructor(props) {
    super(props);
    this.state = { arrDoctorId: [], dataDetailClinic: {} };
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
      let res = await getDetailClinicById({
        id: id,
      });
      console.log("check mount: ", res);
      if (res && res.errCode === 0) {
        let data = res.data;
        if (data && !_.isEmpty(data)) {
          let arr = data.doctorClinic;
          if (arr && arr.length > 0) {
            arr.map((item) => {
              arrDoctorId.push(item.doctorId);
            });
          }
        }

        this.setState({
          dataDetailClinic: res.data,
          arrDoctorId: arrDoctorId,
        });
      }
    }
  }

  render() {
    let { arrDoctorId, dataDetailClinic } = this.state;
    let { language } = this.props;
    console.log("check state arry ", this.state);
    let imageBase64 = "";
    if (dataDetailClinic.image) {
      imageBase64 = new Buffer(dataDetailClinic.image, "base64").toString(
        "binary"
      );
    }
    return (
      <div className="detail-clinic-container">
        <HomeHeader />
        <div
          className="description-clinic"
          style={{
            backgroundImage: `url(${imageBase64})`,
          }}
        ></div>
        <div className="name-clinic">
          <span>{dataDetailClinic.name}</span>
        </div>
        <div className="detail-clinic-body">
          <div className="markdown">
            {dataDetailClinic && !_.isEmpty(dataDetailClinic) && (
              <div
                dangerouslySetInnerHTML={{
                  __html: dataDetailClinic.descriptionHTML,
                }}
              ></div>
            )}
          </div>
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
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
