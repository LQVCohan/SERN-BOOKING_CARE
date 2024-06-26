import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./RemedyModal.scss";
import Select from "react-select";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { height } from "@fortawesome/free-brands-svg-icons/fa42Group";
import { data } from "browserslist";
import _, { times } from "lodash";
import * as actions from "../../../store/actions";
import { lang } from "moment";
import { postPatientBookAppointment } from "../../../services/userService";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { LANGUAGES, CommonUtils } from "../../../utils";

class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imgBase64: "",
    };
  }
  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };
  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.language !== this.props.language) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
    if (prevProps.dataModal !== this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }
  async componentDidMount() {
    if (this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }
  handleOnChangeEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  };
  handleOnchangeImage = async (event) => {
    try {
      let data = event.target.files;
      let file = data[0];
      if (file) {
        let base64 = await CommonUtils.getBase64(file);
        this.setState({
          imgBase64: base64,
        });
      }
    } catch (error) {
      return;
    }
  };
  handleSendRemedy = () => {
    this.props.sendRemedy(this.state);
  };
  render() {
    let { isOpenModal, closeRemedyModal } = this.props;
    return (
      <>
        <Modal
          isOpen={isOpenModal}
          className={"booking-modal-container"}
          size="md"
          centered
        >
          <ModalHeader toggle={closeRemedyModal}>
            Gửi hóa đơn khám bệnh thành công
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-6 form-group">
                <label>Email bệnh nhân</label>
                <input
                  className="form-control"
                  type="email"
                  value={this.state.email}
                  onChange={(event) => {
                    this.handleOnChangeEmail(event);
                  }}
                />
              </div>
              <div className="col-6 form-group">
                <label>Chọn file đơn thuốc</label>
                <input
                  className="form-control-file"
                  type="file"
                  onChange={(event) => {
                    this.handleOnchangeImage(event);
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSendRemedy}>
              Send
            </Button>
            <Button color="secondary" onClick={closeRemedyModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
