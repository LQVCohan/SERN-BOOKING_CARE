import React, { Component } from "react";
import { connect } from "react-redux";
import "./ConfirmModal.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";
import { UpdateStatusPatientByRequest } from "../../../services/userService";

class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imgBase64: "",
      isOpenConfirmModal: false,
    };
  }

  acceptCancel = async () => {
    const { dataPatient } = this.props;
    try {
      let res = await UpdateStatusPatientByRequest({
        patientId: dataPatient.patientId,
        statusId: "S5", // Assuming "S5" represents canceled status
        doctorId: dataPatient.doctorId,
        date: dataPatient.date,
        timeType: dataPatient.timeType,
      });

      if (res && res.errCode === 0) {
        toast.success("Canceled");
        this.props.closeConfirmModal();
      } else {
        toast.error("Cancel failed");
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("An error occurred while cancelling appointment");
    }
  };

  render() {
    const { isOpenModal, closeConfirmModal, language } = this.props;

    return (
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
