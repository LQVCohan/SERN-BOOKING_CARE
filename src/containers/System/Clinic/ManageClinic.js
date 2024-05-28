import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import {
  createClinic,
  createSpecialty,
  getAllSpecialty,
} from "../../../services/userService";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { toast } from "react-toastify";
import Select from "react-select";
import { FormattedMessage } from "react-intl";

const mdParser = new MarkdownIt();

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMD: "",
    };
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  async componentDidMount() {}
  handleOnChangInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionMD: text,
      descriptionHTML: html,
    });
  };
  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };
  handleSaveNewClinic = async () => {
    let res = await createClinic(this.state);
    if (res && res.errCode === 0) {
      toast.success("OK");
      this.setState({
        name: "",
        imageBase64: "",
        address: "",
        descriptionHTML: "",
        descriptionMD: "",
      });
    } else {
      toast.error("Error!");
    }
  };
  render() {
    return (
      <div className="manage-specialty-container">
        <div className="manage-specialty-label">Quản lý phòng khám</div>
        <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label>Tên phòng khám</label>
            <input
              className="form-control"
              type="text"
              value={this.state.name}
              onChange={(event) => this.handleOnChangInput(event, "name")}
            />
          </div>

          <div className="col-6 form-group">
            {" "}
            <label>Tải ảnh đại diện</label>
            <input
              className="form-control-file"
              type="file"
              onChange={(event) => this.handleOnchangeImage(event)}
            />
          </div>
          <div className="col-6 form-group">
            <label>Địa chỉ phòng khám</label>
            {/* <input
              className="form-control"
              type="text"
              value={this.state.address}
              onChange={(event) => this.handleOnChangInput(event, "address")}
            /> */}
            <textarea
              className="form-control"
              rows="5"
              type="text"
              value={this.state.address}
              onChange={(event) => this.handleOnChangInput(event, "address")}
            ></textarea>
          </div>
          <div className="col-6 form-group">
            <label>Khu vực</label>
            <Select
              value={this.state.selectedDoctor}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
              placeholder={
                <FormattedMessage id="admin.manage-clinic.select-clinic" />
              }
              name={"selectedDoctor"}
            />
          </div>
          <div className="col-12">
            <MdEditor
              style={{ height: "300px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={this.state.descriptionMD}
            />
          </div>
          <div className="col-12">
            <button
              className="btn-save-specialty"
              onClick={() => this.handleSaveNewClinic()}
            >
              Lưu
            </button>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
