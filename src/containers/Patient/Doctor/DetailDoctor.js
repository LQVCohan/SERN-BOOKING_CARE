import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";

import "./DetailDoctor.scss";
import {
  getDetailInfoDoctor,
  getExtraInfoDoctorById,
} from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import Select from "react-select";
import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfor from "./DoctorExtraInfor";
import * as actions from "../../../store/actions";

class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailDoctor: [],
      currentDoctorId: -1,
      extraInfo: {},
      listPayments: [],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo) {
      let { resPayment } = this.props.allRequiredDoctorInfo;
      let dataSelectPayment = this.buildDataInputSelect(resPayment, "PAYMENT");
      this.setState({
        listPayments: dataSelectPayment,
      });
    }
  }

  async componentDidMount() {
    try {
      if (
        this.props.match &&
        this.props.match.params &&
        this.props.match.params.id
      ) {
        let id = this.props.match.params.id;
        this.setState({
          currentDoctorId: id,
        });

        let res = await getDetailInfoDoctor(id);
        if (res && res.errCode === 0) {
          this.setState({
            detailDoctor: res.data,
          });
        }

        let extraRes = await getExtraInfoDoctorById(id);
        console.log("check extraRes: ", extraRes);

        if (extraRes && extraRes.errCode === 0) {
          this.setState({
            extraInfo: extraRes.data,
          });
        }
      }
    } catch (error) {
      console.error("Error in componentDidMount:", error);
    }
  }

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let language = this.props.language;
    try {
      if (inputData && inputData.length > 0) {
        if (type === "PAYMENT") {
          inputData.map((item, index) => {
            let object = {};
            let labelVi = `${item.valueVi}`;
            let labelEn = `${item.valueEn}`;
            object.label = language === LANGUAGES.VI ? labelVi : labelEn;
            object.value = item.keyMap;
            result.push(object);
          });
        }
      }
    } catch (error) {
      console.error("Error in buildDataInputSelect:", error);
    }
    return result;
  };

  render() {
    let { detailDoctor, extraInfo } = this.state;
    let { language } = this.props;
    console.log("check extrainfo: ", extraInfo);
    let nameVi = "",
      nameEn = "";
    if (detailDoctor && detailDoctor.positionData) {
      nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
      nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
    }
    return (
      <>
        <HomeHeader isShowBanner={false} />

        <div className="doctor-detail-container">
          <div className="intro-doctor">
            <div
              className="content-left"
              style={{
                backgroundImage: `url(${
                  detailDoctor && detailDoctor.image ? detailDoctor.image : ""
                })`,
              }}
            ></div>
            <div className="content-right">
              <div className="up">
                {language === LANGUAGES.VI ? nameVi : nameEn}
              </div>
              <div className="down">
                {detailDoctor.Markdown && detailDoctor.Markdown.description && (
                  <span> {detailDoctor.Markdown.description}</span>
                )}
              </div>
            </div>
          </div>
          <div className="schedule-doctor">
            <div className="content-left">
              <DoctorSchedule
                language={this.props.language}
                doctorIdFromParent={this.state.currentDoctorId}
                doctorExtraInforFromParent={extraInfo}
              />
            </div>
            <div className="content-right">
              <DoctorExtraInfor
                doctorIdFromParent={this.state.currentDoctorId}
              />
            </div>
          </div>
          <div className="detail-info-doctor">
            {detailDoctor &&
              detailDoctor.Markdown &&
              detailDoctor.Markdown.contentHTML && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: detailDoctor.Markdown.contentHTML,
                  }}
                ></div>
              )}
          </div>
          <div className="comment-doctor"> </div>
        </div>
        <HomeFooter />
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
