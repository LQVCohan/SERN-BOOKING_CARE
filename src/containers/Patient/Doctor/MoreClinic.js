import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./MoreClinic.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from "../../HomePage/HomeFooter";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { searchInfoByAnyThing } from "../../../services/userService";

class MoreClinic extends Component {
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
        {searchedData.clinicRes && searchedData.clinicRes.count > 0 && (
          <>
            <div className="more-clinic-body">
              <div className="title">
                {" "}
                <FormattedMessage id={"patient.search.clinic-label"} />
              </div>
              {searchedData.clinicRes.rows.map((item, index) => {
                let imageBase64 = "";
                if (item.image) {
                  imageBase64 = new Buffer(item.image, "base64").toString(
                    "binary"
                  );
                }

                return (
                  <div className="child" key={index}>
                    <div
                      className="child-image"
                      style={{
                        backgroundImage: `url(${imageBase64})`,
                        border: "none",
                      }}
                      onClick={() => this.handleViewDetailInfo(item, "Clinic")}
                    ></div>
                    <div className="child-info">
                      <div
                        className="name"
                        onClick={() =>
                          this.handleViewDetailInfo(item, "Clinic")
                        }
                      >
                        {item.name}
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

export default connect(mapStateToProps, mapDispatchToProps)(MoreClinic);
