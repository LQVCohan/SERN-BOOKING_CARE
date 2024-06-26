import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { LANGUAGES, CRUD_ACTIONS } from "../../../utils";
import { getDetailInfoDoctor } from "../../../services/userService";
import { has } from "lodash";
import Specialty from "../../HomePage/Section/Specialty";
const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentMarkdown: "",
      contentHTML: "",
      selectedDoctor: "",
      description: "",
      listDoctors: [],
      hasOldData: false,
      listPrices: [],
      listPayments: [],
      listProvinces: [],
      listClinic: [],
      listSpecialty: [],
      selectedPrice: "",
      selectedPayment: "",
      selectedProvince: "",
      selectedClinic: "",
      selectedSpecialty: "",
      nameClinic: "",
      addressClinic: "",
      note: "",
      clinicId: "",
      specialtyId: "",
      resClinic: "",
    };
  }

  async componentDidMount() {
    try {
      this.props.fetchAllDoctors();
      this.props.getRequiredDoctorInfo();
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  }

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let language = this.props.language;
    if (inputData && inputData.length > 0) {
      try {
        switch (type) {
          case "USERS":
            inputData.forEach((item) => {
              let labelVi = `${item.lastName} ${item.firstName}`;
              let labelEn = `${item.firstName} ${item.lastName}`;
              let object = {
                label: language === LANGUAGES.VI ? labelVi : labelEn,
                value: item.id,
              };
              result.push(object);
            });
            break;
          case "PRICE":
            inputData.forEach((item) => {
              let labelVi = `${item.valueVi}`;
              let labelEn = `${item.valueEn} USD`;
              let object = {
                label: language === LANGUAGES.VI ? labelVi : labelEn,
                value: item.keyMap,
              };
              result.push(object);
            });
            break;
          case "PAYMENT":
          case "PROVINCE":
            inputData.forEach((item) => {
              let labelVi = `${item.valueVi}`;
              let labelEn = `${item.valueEn}`;
              let object = {
                label: language === LANGUAGES.VI ? labelVi : labelEn,
                value: item.keyMap,
              };
              result.push(object);
            });
            break;
          case "SPECIALTY":
          case "CLINIC":
            inputData.forEach((item) => {
              let object = {
                label: item.name,
                value: item.id,
              };
              result.push(object);
            });
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error building ${type} options:`, error);
      }
    }
    return result;
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    try {
      if (prevProps.allDoctors !== this.props.allDoctors) {
        let dataSelect = this.buildDataInputSelect(
          this.props.allDoctors,
          "USERS"
        );
        this.setState({
          listDoctors: dataSelect,
        });
      }
      if (
        prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo
      ) {
        let { resClinic, resSpecialty, resPayment, resPrice, resProvince } =
          this.props.allRequiredDoctorInfo;
        let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
        let dataSelectPayment = this.buildDataInputSelect(
          resPayment,
          "PAYMENT"
        );
        let dataSelectProvince = this.buildDataInputSelect(
          resProvince,
          "PROVINCE"
        );
        let dataSelectSpecialty = this.buildDataInputSelect(
          resSpecialty,
          "SPECIALTY"
        );
        let dataSelectClinic = this.buildDataInputSelect(resClinic, "CLINIC");
        this.setState({
          listPrices: dataSelectPrice,
          listPayments: dataSelectPayment,
          listProvinces: dataSelectProvince,
          listSpecialty: dataSelectSpecialty,
          listClinic: dataSelectClinic,
        });
      }
      if (prevProps.language !== this.props.language) {
        let dataSelect = this.buildDataInputSelect(
          this.props.allDoctors,
          "USERS"
        );
        let { resPayment, resPrice, resProvince } =
          this.props.allRequiredDoctorInfo;
        let dataSelectPrice = this.buildDataInputSelect(resPrice, "PRICE");
        let dataSelectPayment = this.buildDataInputSelect(
          resPayment,
          "PAYMENT"
        );
        let dataSelectProvince = this.buildDataInputSelect(
          resProvince,
          "PROVINCE"
        );

        this.setState({
          listDoctors: dataSelect,
          listPrices: dataSelectPrice,
          listPayments: dataSelectPayment,
          listProvinces: dataSelectProvince,
        });
      }
    } catch (error) {
      console.error("Error updating component:", error);
    }
  }

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };

  handleSaveContentMarkdown = () => {
    try {
      let { hasOldData } = this.state;
      this.props.saveDetailDoctor({
        contentHTML: this.state.contentHTML,
        contentMarkdown: this.state.contentMarkdown,
        description: this.state.description,
        id: this.state.selectedDoctor.value,
        action: hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
        selectedPrice: this.state.selectedPrice.value,
        selectedPayment: this.state.selectedPayment.value,
        selectedProvince: this.state.selectedProvince.value,
        nameClinic: this.state.nameClinic,
        addressClinic: this.state.addressClinic,
        note: this.state.note,
        clinicId:
          this.state.selectedClinic && this.state.selectedClinic.value
            ? this.state.selectedClinic.value
            : "",
        specialtyId: this.state.selectedSpecialty.value,
      });
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  handleChangeSelect = async (selectedDoctor) => {
    try {
      this.setState({ selectedDoctor });
      let { listPrices, listPayments, listProvinces, listSpecialty } =
        this.state;
      let res = await getDetailInfoDoctor(selectedDoctor.value);
      if (res && res.errCode === 0 && res.data && res.data.Markdown) {
        let markdown = res.data.Markdown;
        let {
          addressClinic,
          nameClinic,
          note,
          priceId,
          paymentId,
          provinceId,
          specialtyId,
        } = res.data.Doctor_Info || {};
        let selectedPrice = listPrices.find((item) => item.value === priceId);
        let selectedPayment = listPayments.find(
          (item) => item.value === paymentId
        );
        let selectedProvince = listProvinces.find(
          (item) => item.value === provinceId
        );
        let selectedSpecialty = listSpecialty.find(
          (item) => item.value === specialtyId
        );
        this.setState({
          contentHTML: markdown.contentHTML,
          contentMarkdown: markdown.contentMarkdown,
          description: markdown.description,
          hasOldData: true,
          addressClinic: addressClinic || "",
          nameClinic: nameClinic || "",
          note: note || "",
          selectedPrice,
          selectedPayment,
          selectedProvince,
          selectedSpecialty,
        });
      } else {
        this.setState({
          contentHTML: "",
          contentMarkdown: "",
          description: "",
          hasOldData: false,
          addressClinic: "",
          nameClinic: "",
          note: "",
          selectedPrice: "",
          selectedPayment: "",
          selectedProvince: "",
          selectedSpecialty: "",
        });
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
    }
  };

  handleChangeSelectDoctorInfor = (selectedOption, name) => {
    try {
      this.setState({
        [name.name]: selectedOption,
      });
    } catch (error) {
      console.error("Error handling select change:", error);
    }
  };

  handleOnChangeText = (event, id) => {
    try {
      this.setState({
        [id]: event.target.value,
      });
    } catch (error) {
      console.error("Error handling text change:", error);
    }
  };

  render() {
    let { hasOldData, listSpecialty } = this.state;
    return (
      <div className="manage-doctor-container">
        {/* JSX content goes here */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allRequiredDoctorInfo: state.admin.allRequiredDoctorInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id)),
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    getRequiredDoctorInfo: () => dispatch(actions.getRequiredDoctorInfo()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
