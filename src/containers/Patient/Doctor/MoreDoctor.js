import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./MoreDoctor.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { searchInfoByAnyThing } from "../../../services/userService";
import HomeFooter from "../../HomePage/HomeFooter";

class MoreDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: true,
      searchedData: {},
      dataSelect: [],
      term: "",
    };
  }

  handleViewDetailInfo = (info, type) => {
    console.log("Cohan check view info: ", info);
    if (type === "Doctor") {
      this.props.history.push(`/detail-doctor/${info.id}`);
    } else if (type === "Specialty") {
      this.props.history.push(`/detail-specialty/${info.id}`);
    } else if (type === "Clinic") {
      this.props.history.push(`/detail-clinic/${info.id}`);
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {}

  async componentDidMount() {
    try {
      let res = await searchInfoByAnyThing({
        term: this.state.term,
        type: "All",
      });
      if (res && res.errCode === 0) {
        this.setState({
          searchedData: res.data,
          isSearching: false,
        });
      }
    } catch (error) {
      console.error("Error in componentDidMount:", error);
    }
  }

  render() {
    let { language } = this.props;
    let { searchedData, isSearching } = this.state;

    return (
      <React.Fragment>
        <HomeHeader isShowBanner={false} />
        {searchedData.userRes && searchedData.userRes.count > 0 && (
          <>
            <div className="more-doctor-body">
              <div className="title">
                <FormattedMessage id={"patient.search.doctor-label"} />
              </div>

              {searchedData.userRes.rows.map((item, index) => {
                let imageBase64 = "";
                if (item.image) {
                  imageBase64 = new Buffer(item.image, "base64").toString(
                    "binary"
                  );
                }
                let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;

                return (
                  <div className="child" key={index}>
                    <div
                      className="child-image"
                      style={{
                        backgroundImage: `url(${imageBase64})`,
                        border: "none",
                      }}
                      onClick={() => this.handleViewDetailInfo(item, "Doctor")}
                    ></div>
                    <div
                      className="child-info"
                      onClick={() => this.handleViewDetailInfo(item, "Doctor")}
                    >
                      <div className="name">
                        {language === LANGUAGES.VI ? nameVi : nameEn}
                      </div>
                      <div className="specialty">
                        {item.Doctor_Info.specialtyData.name
                          ? item.Doctor_Info.specialtyData.name
                          : "Freelance"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <HomeFooter />
      </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(MoreDoctor);
