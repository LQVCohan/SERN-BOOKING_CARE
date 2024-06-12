import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./MoreSpecialty.scss";
import HomeHeader from "../../HomePage/HomeHeader";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { searchInfoByAnyThing } from "../../../services/userService";
import HomeFooter from "../../HomePage/HomeFooter";

class MoreSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearching: true,
      searchedData: {},
      dataSelect: [],
      term: "",
    };
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  async componentDidMount() {
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
  }
  handleViewDetailInfo = (info, type) => {
    console.log("Cohan check view info: ", info);
    if (type === "Doctor") {
      this.props.history.push(`/detail-doctor/${info.id}`);
    } else {
      if (type === "Specialty") {
        this.props.history.push(`/detail-specialty/${info.id}`);
      } else {
        if (type === "Clinic") {
          this.props.history.push(`/detail-clinic/${info.id}`);
        }
      }
    }
  };
  render() {
    let { language } = this.props;
    let { searchedData, isSearching } = this.state;

    return (
      <React.Fragment>
        <HomeHeader isShowBanner={false} />
        {searchedData.specialtyRes && searchedData.specialtyRes.count > 0 && (
          <>
            <div className="more-specialty-body">
              <div className="title">
                {" "}
                <FormattedMessage id={"patient.search.specialty-label"} />
              </div>
              <div id="body">
                {searchedData.specialtyRes.rows.map((item, index) => {
                  return (
                    <div className="child" key={index}>
                      <div className="child-info">
                        <div
                          className="name"
                          onClick={() =>
                            this.handleViewDetailInfo(item, "Specialty")
                          }
                        >
                          {item.name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MoreSpecialty);
