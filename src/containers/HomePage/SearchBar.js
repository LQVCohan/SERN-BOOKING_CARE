import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./SearchBar.scss";
import { FaSearch } from "react-icons/fa";
import HomeHeader from "./HomeHeader";
import { searchInfoByAnyThing } from "../../services/userService";
import Select from "react-select";
import { height } from "@fortawesome/free-brands-svg-icons/fa42Group";
import { LANGUAGES } from "../../utils";
import HomeFooter from "./HomeFooter";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { FormattedMessage } from "react-intl";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: "",
      type: "",
      selectedOption: "",
      isSearching: true,
      searchedData: {},
      dataSelect: [],
    };
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        dataSelect: this.buildDataSelect(),
      });
    }
  }
  buildDataSelect = () => {
    let language = this.props.language;
    let result = [
      {
        value: "All",
        label: language === LANGUAGES.VI ? "Tất cả" : "ALL",
      },
      {
        value: "Doctor",
        label: language === LANGUAGES.VI ? "Bác sĩ" : "Doctor",
      },
      {
        value: "Specialty",
        label: language === LANGUAGES.VI ? "Chuyên khoa" : "Specialty",
      },
      {
        value: "Clinic",
        label: language === LANGUAGES.VI ? "Cơ sở y tế" : "Clinic",
      },
    ];

    return result;
  };

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.type
    ) {
      let res = await searchInfoByAnyThing({
        term: this.state.term,
        type: this.props.match.params.type,
      });
      if (res && res.errCode === 0) {
        this.setState(
          {
            searchedData: res.data,
            isSearching: false,
            dataSelect: this.buildDataSelect(),
          },
          () => {
            this.render();
          }
        );
      }
    }
  }

  handleOnChangeSearch = (valueInput) => {
    this.setState({
      term: valueInput,
    });
  };
  handleChangeSelect = (selectedType) => {
    this.setState(
      {
        selectedOption: selectedType,
        isSearching: true,
      },
      () => {
        this.handleSearchItem();
      }
    );
  };
  handleSearchItem = async () => {
    let { term, selectedOption } = this.state;
    console.log("cehck state", this.state);
    let res = await searchInfoByAnyThing({
      term: term,
      type: selectedOption.value,
    });
    if (res && res.errCode === 0) {
      this.setState({
        searchedData: res.data,
        isSearching: false,
      });
    }
  };
  customStyles = {
    control: (base, state) => ({
      ...base,
      height: "54px",
      backgroundColor: "#f7d800",

      // match with the menu
      borderRadius: "0 25px 0 0",
      border: "none",
      // Overwrittes the different states of border
      //  borderColor: state.isFocused ? "yellow" : "green",
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
    }),
    menu: (base, state) => ({
      ...base,
      // override border radius to match the box
      borderRadius: "0 0 25px 25px",
      border: "none",
      outline: "none",
      backgroundColor: "#f7d800",
      // kill the gap
      marginTop: 0,
    }),
    menuList: (base, state) => ({
      ...base,
      // kill the white space on first and last option
      padding: 0,
    }),
  };
  handleViewDetailInfo = (info, type) => {
    console.log("Cohan check view info: ", info);
    if (type === "Doctor") {
      this.props.history.push(`/detail-doctor/${info.id}`);
    }
    if (type === "Specialty") {
      this.props.history.push(`/detail-specialty/${info.id}`);
    }
    if (type === "Clinic") {
      this.props.history.push(`/detail-clinic/${info.id}`);
    }
  };
  render() {
    let { searchedData, isSearching } = this.state;
    let { language } = this.props;
    console.log("check state: ", this.state);
    return (
      <>
        <HomeHeader />
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder={
                language === LANGUAGES.VI
                  ? "Thử tìm kiếm gì đó"
                  : "Search something"
              }
              value={this.state.searchKeyword}
              onChange={(event) =>
                this.handleOnChangeSearch(event.target.value)
              }
            />

            {(isSearching && isSearching === true && (
              <ClimbingBoxLoader color="#000" size={5} />
            )) ||
              (isSearching === false && (
                <i
                  className="fas fa-search"
                  onClick={this.handleSearchItem()}
                ></i>
              ))}

            <div style={{ width: "200px" }}>
              <Select
                styles={this.customStyles}
                value={this.state.selectedOption}
                onChange={this.handleChangeSelect}
                options={this.state.dataSelect}
                isSearchable={false}
                placeholder={language === LANGUAGES.VI ? "Tất cả" : "All"}
              />
            </div>
          </div>
          {searchedData.userRes && searchedData.userRes.count > 0 && (
            <>
              <div className="search-body">
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
                        onClick={() =>
                          this.handleViewDetailInfo(item, "Doctor")
                        }
                      ></div>
                      <div
                        className="child-info"
                        onClick={() =>
                          this.handleViewDetailInfo(item, "Doctor")
                        }
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
          {searchedData.specialtyRes && searchedData.specialtyRes.count > 0 && (
            <>
              <div className="search-body">
                <div className="title">
                  {" "}
                  <FormattedMessage id={"patient.search.specialty-label"} />
                </div>
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
            </>
          )}
          {searchedData.clinicRes && searchedData.clinicRes.count > 0 && (
            <>
              <div className="search-body">
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
                        onClick={() =>
                          this.handleViewDetailInfo(item, "Clinic")
                        }
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
        </div>
        <HomeFooter />
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
