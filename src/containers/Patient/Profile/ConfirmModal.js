import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ConfirmModal.scss";
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

class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imgBase64: "",
      isOpenConfirmModal: false,
    };
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {}
  async componentDidMount() {}
  acceptCancel = () => {
    this.props.acceptCancel(this.props.dataPatient);
  };
  render() {
    let { isOpenModal, closeConfirmModal, dataPatient, language } = this.props;
    console.log("check datapatient: ", dataPatient);
    return (
      <>
        <Modal
          isOpen={isOpenModal}
          className={"confirm-modal-container"}
          size="md"
          centered
        >
          <ModalHeader toggle={closeConfirmModal}>
            {language === LANGUAGES.VI
              ? "Bạn muốn hủy lịch hẹn ?"
              : "Do you want to cancel this appointment ?"}
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-12 form-group">
                <label className="warning">
                  {language === LANGUAGES.VI
                    ? "Lịch hẹn của bạn sẽ bị hủy nhưng sẽ không hoàn trả tiền bạn đã cọc!"
                    : "Your appointment will be canceled without any refundation!"}
                </label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.acceptCancel}>
              Yes
            </Button>
            <Button color="secondary" onClick={closeConfirmModal}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmModal);
