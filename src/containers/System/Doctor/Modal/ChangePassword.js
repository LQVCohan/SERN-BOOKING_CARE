import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import "./ChangePassword.scss";
import { Modal } from "reactstrap";
import { FormattedMessage } from "react-intl";
import { MdErrorOutline } from "react-icons/md";
import {
  getPasswordById,
  postChangePassword,
} from "../../../../services/userService";
import { toast } from "react-toastify";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidPassword: true,
      oldPass: "",
      newPass: "",
      secNewPass: "",
    };
  }
  async componentDidUpdate(prevProps, prevState, snapshot) {}
  async componentDidMount() {}

  handleOnChangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
    console.log("check length ", valueInput.length);
    if (id === "newPass" && valueInput.length < 6) {
      this.setState({
        isValidPassword: false,
      });
    } else {
      if (id === "newPass" && valueInput.length > 6) {
        this.setState({
          isValidPassword: true,
        });
      }
    }
  };
  handleSavePassword = async () => {
    let { oldPass, newPass, secNewPass } = this.state;
    let { user } = this.props;
    let res = await getPasswordById({
      id: user.id,
      password: oldPass,
    });
    if (res && res.errCode === 0) {
      if (newPass === "" || secNewPass === "") {
        toast.error(
          "please enter a new password and re-enter a new password carefully"
        );
        return;
      }
      if (newPass === secNewPass) {
        await postChangePassword({
          id: user.id,
          password: secNewPass,
        });
        toast.success("Changed");
      } else {
        toast.error("please re-enter a new password carefully");
      }
    } else {
      toast.error("Wrong password");
    }
  };
  render() {
    let { isOpenModal, closeChangeModal } = this.props;
    let { isValidPassword } = this.state;
    console.log("checkk state: ", this.state);
    return (
      <Modal
        isOpen={isOpenModal}
        className={"change-modal-container"}
        size="m"
        centered
      >
        <div className="change-pw-modal-content">
          <div className="change-pw-modal-header">
            <span className="header-left">
              <FormattedMessage id={"patient.booking-modal.label"} />
            </span>
            <span className="header-right" onClick={closeChangeModal}>
              <i className="fas fa-times"> </i>
            </span>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label for="inputPasswordOld">Current Password</label>
              <input
                type="password"
                className="form-control"
                id="inputPasswordOld"
                required=""
                onChange={(e) => this.handleOnChangeInput(e, "oldPass")}
              />
            </div>
            <div className="form-group">
              <label for="inputPasswordNew">New Password</label>
              <input
                type="password"
                className="form-control"
                id="inputPasswordNew"
                required=""
                onChange={(e) => this.handleOnChangeInput(e, "newPass")}
              />

              {this.state.newPass !== "" && isValidPassword === false && (
                <div className="is-error mt-1">
                  <MdErrorOutline color="red" className="" />
                  <FormattedMessage
                    id={"doctor.invalid-password"}
                    className="mt-1"
                  />
                </div>
              )}
              <span className="form-text small text-muted">
                The password must be 8-20 characters, and must <em>not</em>{" "}
                contain spaces.
              </span>
            </div>
            <div className="form-group">
              <label for="inputPasswordNewVerify">Verify</label>
              <input
                type="password"
                className="form-control"
                id="inputPasswordNewVerify"
                required=""
                onChange={(e) => this.handleOnChangeInput(e, "secNewPass")}
              />
              <span className="form-text small text-muted">
                To confirm, type the new password again.
              </span>
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-success btn-lg float-right"
                onClick={this.handleSavePassword}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => {
  return { user: state.user.userInfo };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
