import React, { Component } from "react";
import { connect } from "react-redux";
import { createClinic, getAllClinic } from "../../../services/userService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import { size } from "lodash";
import { withRouter } from "react-router";
import "./MedicalFacility.scss";

class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataClinics: [],
    };
  }
  async componentDidMount() {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({
        dataClinics: res.data ? res.data : [],
      });
    }
    console.log("check res", res);
    console.log("check state: ", this.state);
  }
  handleViewDetailClinic = (clinic) => {
    console.log("Cohan check view info: ", clinic);
    this.props.history.push(`/detail-clinic/${clinic.id}`);
  };
  handleViewMoreClinic = (clinic) => {
    console.log("Cohan check view info: ", clinic);
    this.props.history.push(`/more-clinic/`);
  };
  render() {
    let { dataClinics } = this.state;
    console.log("check arrClinic: ", dataClinics);
    return (
      <div className="section-share section-medical-facility">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              {" "}
              <FormattedMessage id={"homepage.clinic-label"} />
            </span>
            <button
              className="btn-section"
              onClick={() => this.handleViewMoreClinic()}
            >
              <FormattedMessage id={"homepage.more-info"} />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {dataClinics &&
                dataClinics.length > 0 &&
                dataClinics.map((item, index) => {
                  return (
                    <div
                      className="section-customize clinic-child"
                      key={index}
                      onClick={() => this.handleViewDetailClinic(item)}
                    >
                      <div
                        className="bg-image section-medical-facility"
                        style={{
                          backgroundImage: `url(${item.image})`,
                        }}
                      />
                      <div className="clinic-name">{item.name}</div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
