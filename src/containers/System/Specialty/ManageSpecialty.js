import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import {
  createSpecialty,
  getAllSpecialty,
  deleteSpecialty,
  updateSpecialty,
} from "../../../services/userService";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { toast } from "react-toastify";

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageBase64: "",
      imagePreviewUrl: "",
      descriptionHTML: "",
      descriptionMD: "",
      specialties: [],
      editMode: false,
      specialtyId: null,
    };
  }

  async componentDidMount() {
    await this.fetchSpecialties();
  }

  fetchSpecialties = async () => {
    let res = await getAllSpecialty();
    if (res && res.errCode === 0) {
      this.setState({ specialties: res.data });
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
      let base64 = await this.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        imageBase64: base64,
        imagePreviewUrl: objectUrl,
      });
    }
  };

  getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  handleSaveNewSpecialty = async () => {
    let {
      editMode,
      specialtyId,
      name,
      imageBase64,
      descriptionHTML,
      descriptionMD,
    } = this.state;

    if (editMode) {
      let res = await updateSpecialty({
        id: specialtyId,
        name,
        imageBase64,
        descriptionHTML,
        descriptionMD,
      });
      if (res && res.errCode === 0) {
        toast.success("Updated successfully!");
      } else {
        toast.error("Error updating specialty!");
      }
    } else {
      let res = await createSpecialty(this.state);
      if (res && res.errCode === 0) {
        toast.success("Created successfully!");
      } else {
        toast.error("Error creating specialty!");
      }
    }

    await this.fetchSpecialties();

    this.setState({
      name: "",
      imageBase64: "",
      imagePreviewUrl: "",
      descriptionHTML: "",
      descriptionMD: "",
      editMode: false,
      specialtyId: null,
    });
  };

  handleEditSpecialty = (specialty) => {
    this.setState({
      name: specialty.name,
      imageBase64: specialty.image,
      imagePreviewUrl: specialty.image,
      descriptionHTML: specialty.descriptionHTML,
      descriptionMD: specialty.descriptionMD,
      editMode: true,
      specialtyId: specialty.id,
    });
  };

  handleDeleteSpecialty = async (id) => {
    let res = await deleteSpecialty(id);
    if (res && res.errCode === 0) {
      toast.success("Deleted successfully!");
      await this.fetchSpecialties();
    } else {
      toast.error("Error deleting specialty!");
    }
  };

  render() {
    let { specialties, imagePreviewUrl } = this.state;
    return (
      <div className="manage-specialty-container">
        <div className="manage-specialty-label">Quản lý chuyên khoa</div>
        <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label>Tên chuyên khoa</label>
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
            {imagePreviewUrl && (
              <div className="image-preview">
                <img src={imagePreviewUrl} alt="Preview" />
              </div>
            )}
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
              onClick={() => this.handleSaveNewSpecialty()}
            >
              {this.state.editMode ? "Cập nhật" : "Lưu"}
            </button>
          </div>
        </div>
        <div className="specialty-list">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="column-id">Số thứ tự</th>
                <th className="column-name">Tên chuyên khoa</th>
                <th className="column-image">Ảnh</th>
                <th className="column-actions">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {specialties &&
                specialties.length > 0 &&
                specialties.map((specialty, index) => (
                  <tr key={specialty.id}>
                    <td className="column-id">{index + 1}</td>
                    <td className="column-name">{specialty.name}</td>
                    <td className="column-image">
                      <img
                        src={specialty.image}
                        alt={specialty.name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td className="column-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => this.handleEditSpecialty(specialty)}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => this.handleDeleteSpecialty(specialty.id)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
