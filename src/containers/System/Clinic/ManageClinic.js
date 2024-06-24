import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import { CommonUtils } from "../../../utils";
import {
  createClinic,
  getAllClinic,
  updateClinic,
  deleteClinic,
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
      clinics: [],
      editMode: false,
      clinicId: null,
    };
  }

  async componentDidMount() {
    await this.fetchClinics();
  }

  fetchClinics = async () => {
    let res = await getAllClinic();
    if (res && res.errCode === 0) {
      this.setState({ clinics: res.data });
    }
    console.log("check fetch: ", res);
  };

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
    let {
      editMode,
      clinicId,
      name,
      address,
      imageBase64,
      descriptionHTML,
      descriptionMD,
    } = this.state;

    if (editMode) {
      let res = await updateClinic({
        id: clinicId,
        name,
        address,
        imageBase64,
        descriptionHTML,
        descriptionMD,
      });
      if (res && res.errCode === 0) {
        toast.success("Updated successfully!");
      } else {
        toast.error("Error updating clinic!");
      }
    } else {
      let res = await createClinic(this.state);
      if (res && res.errCode === 0) {
        toast.success("Created successfully!");
      } else {
        toast.error("Error creating clinic!");
      }
    }

    await this.fetchClinics();

    this.setState({
      name: "",
      address: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMD: "",
      editMode: false,
      clinicId: null,
    });
  };

  handleEditClinic = (clinic) => {
    this.setState({
      name: clinic.name,
      address: clinic.address,
      imageBase64: clinic.image,
      descriptionHTML: clinic.descriptionHTML,
      descriptionMD: clinic.descriptionMD,
      editMode: true,
      clinicId: clinic.id,
    });
  };

  handleDeleteClinic = async (id) => {
    let res = await deleteClinic(id);
    if (res && res.errCode === 0) {
      toast.success("Deleted successfully!");
      await this.fetchClinics();
    } else {
      toast.error("Error deleting clinic!");
    }
  };

  render() {
    let { clinics } = this.state;
    return (
      <div className="manage-clinic-container">
        <div className="manage-specialty-label">Quản lý phòng khám</div>
        <div className="add-new-clinic row">
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
            <label>Tải ảnh đại diện</label>
            <input
              className="form-control-file"
              type="file"
              onChange={(event) => this.handleOnchangeImage(event)}
            />
          </div>
          <div className="col-6 form-group">
            <label>Địa chỉ phòng khám</label>
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
              className="btn-save-clinic"
              onClick={() => this.handleSaveNewClinic()}
            >
              {this.state.editMode ? "Cập nhật" : "Lưu"}
            </button>
          </div>
        </div>
        <div className="clinic-list">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="column-id">Số thứ tự</th>
                <th className="column-name">Tên phòng khám</th>
                <th className="column-image">Ảnh</th>
                <th className="column-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {clinics &&
                clinics.length > 0 &&
                clinics.map((clinic, index) => (
                  <tr key={clinic.id}>
                    <td className="column-id">{index + 1}</td>
                    <td className="column-name">{clinic.name}</td>
                    <td className="column-image">
                      <img
                        src={clinic.image}
                        alt={clinic.name}
                        style={{ maxWidth: "100px", height: "auto" }}
                      />
                    </td>
                    <td className="column-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => this.handleEditClinic(clinic)}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => this.handleDeleteClinic(clinic.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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
