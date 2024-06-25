import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import Specialty from "./Section/Specialty";
import MedicalFacility from "./Section/MedicalFacility";

import "./HomePage.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import HandBook from "./Section/HandBook";
import OutStandingDoctor from "./Section/OutStandingDoctor";
import About from "./Section/About";
import HomeFooter from "./HomeFooter";
class HomePage extends Component {
  handleAfterChange = (index, dotAnimate) => {
    console.log("Cohan check current slide: ", index);
  };
  render() {
    let settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      afterChange: this.handleAfterChange,
      // nextArrow: <nextArrow />,
      // prevArrow: <prevArrow />,
    };
    return (
      <div>
        <HomeHeader isShowBanner={true} />
        <OutStandingDoctor settings={settings} />
        <Specialty settings={settings} />
        <MedicalFacility settings={settings} />

        <HomeFooter />
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
