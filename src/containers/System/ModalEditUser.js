import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emiiter } from "../../utils/emiiter";
import _ from "lodash";
class ModalEditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
    };
    this.componentDidMount();
    // this.listenToEmiiter();
  }
  //   listenToEmiiter() {
  //     emiiter.on("EVENT_CLEAR_MODAL_DATA", () => {
  //       this.setState({
  //         email: "",
  //         password: "",
  //         firstName: "",
  //         lastName: "",
  //         address: "",
  //       });
  //     });
  //   }
  componentDidMount() {
    let user = this.props.currentUser;

    if (user && !_.isEmpty(user)) {
      this.setState({
        id: user.id,
        email: user.email,
        password: "hashcode",
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      });
    }
  }

  toggle = () => {
    this.props.toggleFromParent();
  };

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState(
      {
        ...copyState,
      },
      () => {
        console.log("check good state:", this.state);
      }
    );
    console.log("copyState", copyState);

    console.log("1: ", event.target.value, id);
  };

  checkValideInput = () => {
    let isVal = true;
    let arrInput = ["email", "password", "firstName", "lastName", "address"];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isVal = false;
        alert("Missing parameter: " + arrInput[i]);
        break;
      }
    }
    return isVal;
  };

  handleSaveUser = () => {
    let isValid = this.checkValideInput();
    if (isValid === true) {
      //    console.log("inupdate", this.state);
      this.props.editUser(this.state);
    }
  };
  render() {
    //   console.log("check child props", this.props);
    //  console.log("check child open modal", this.props.isOpen);
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={() => {
          this.toggle();
        }}
        className={"modal-user-container"}
        size="lg"
        centered
      >
        <ModalHeader
          toggle={() => {
            this.toggle();
          }}
        >
          Update a user
        </ModalHeader>
        <ModalBody>
          <div className="modal-user-body">
            <div className="input-container">
              <label>Email</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "email");
                }}
                disabled
                value={this.state.email}
              />
            </div>
            <div className="input-container">
              <label>Password</label>
              <input
                type="password"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "password");
                }}
                disabled
                value={this.state.password}
              />
            </div>
            <div className="input-container">
              <label>First Name</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "firstName");
                }}
                value={this.state.firstName}
              />
            </div>
            <div className="input-container">
              <label>Last Name</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "lastName");
                }}
                value={this.state.lastName}
              />
            </div>
            <div className="input-container max-width-input">
              <label>Address</label>
              <input
                type="text"
                onChange={(event) => {
                  this.handleOnChangeInput(event, "address");
                }}
                value={this.state.address}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="px-3"
            onClick={() => {
              this.handleSaveUser();
            }}
          >
            Save change
          </Button>{" "}
          <Button
            color="secondary"
            className="px-3"
            onClick={() => {
              this.toggle();
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
