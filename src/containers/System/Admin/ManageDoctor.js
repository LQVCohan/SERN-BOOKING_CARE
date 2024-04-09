import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { text } from "@fortawesome/fontawesome-svg-core";
import "./ManageDoctor.scss";
import Select from "react-select";
import { lang } from "moment";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";

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
    };
  }
  componentDidMount() {
    this.props.fetchAllDoctors();
  }
  buildDataInputSelect = (inputData) => {
    let result = [];
    let language = this.props.language;
    console.log("Cohan check language: ", language);
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelVi = `${item.lastName} ${item.firstName}`;
        let labelEn = `${item.firstName} ${item.lastName} `;

        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
      return result;
    }
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }
  }
  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };
  handldeSaveContentMarkdown = (data) => {
    console.log(
      "check HTML: ",
      this.state.contentHTML,
      "check mark:",
      this.state.contentMarkdown,
      "check desc:",
      this.state.description,
      "check id:",
      this.state.selectedDoctor.value
    );
    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      id: this.state.selectedDoctor.value,
    });
  };
  handleChange = (selectedDoctor) => {
    this.setState({ selectedDoctor: selectedDoctor });
  };
  handleOnChangeDescription = (event) => {
    this.setState({
      description: event.target.value,
    });
  };
  render() {
    console.log("Cohan check listDoctors in return", this.state.listDoctors);
    console.log("Cohan check all State in return", this.state);

    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">Taoj theem thongo tin doctor </div>
        <div className="more-info">
          <div className="content-left form-group">
            <label>Chọn bác sĩ</label>
            <Select
              value={this.state.selectedDoctor}
              onChange={this.handleChange}
              options={this.state.listDoctors}
            />
          </div>
          <div className="content-right">
            <label>Thông tin giới thiệu</label>
            <textarea
              className="form-control"
              rows="4"
              onChange={(event) => this.handleOnChangeDescription(event)}
              value={this.state.description}
            >
              sadfsd
            </textarea>
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
          />
        </div>
        <button
          className="save-content-doctor"
          onClick={() => this.handldeSaveContentMarkdown()}
        >
          Lưu
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id)),
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
