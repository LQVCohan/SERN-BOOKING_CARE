import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import { emiiter } from "../../utils/emiiter";
import {
  getAllUsers,
  createNewUserS,
  deleteUser,
  editUserService,
} from "../../services/userService";
import ModalUser from "./ModalUser";
import ModalEditUser from "./ModalEditUser";

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayUsers: [],
      isOpenModalUser: false,
      isOpenModalEditUser: false,
      userEdit: {},
    };
  }

  async componentDidMount() {
    await this.getAllUsersFromReact();
  }

  getAllUsersFromReact = async () => {
    let response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      this.setState({
        arrayUsers: response.users,
      });
    }
  };

  handleAddNewUser = () => {
    this.setState({
      isOpenModalUser: true,
    });
  };
  toggleUserModal = () => {
    this.setState({
      isOpenModalUser: !this.state.isOpenModalUser,
    });
  };
  toggleUserEditModal = () => {
    this.setState({
      isOpenModalEditUser: !this.state.isOpenModalEditUser,
    });
  };
  createNewUser = async (data) => {
    try {
      let response = await createNewUserS(data);
      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        await this.getAllUsersFromReact();
        this.setState({ isOpenModalUser: false });
        emiiter.emit("EVENT_CLEAR_MODAL_DATA");
      }
      console.log("respone create user", response);
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteUser = async (user) => {
    try {
      let respone = await deleteUser(user.id);
      if (respone && respone.errCode === 0) {
        await this.getAllUsersFromReact();
      } else {
        alert(respone.errMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleEditUser = (user) => {
    this.setState({
      isOpenModalEditUser: true,
      userEdit: user,
    });
  };
  doEditUser = async (user) => {
    try {
      console.log("Id: ", user.id);
      let res = await editUserService(user);
      console.log("res: ", res);
      if (res && res.errCode === 0) {
        this.setState({
          isOpenModalEditUser: false,
        });
        await this.getAllUsersFromReact();
      } else {
        alert(res.errMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  render() {
    let arrayUsers = this.state.arrayUsers;
    console.log(arrayUsers);
    return (
      <div className="users-container">
        <ModalUser
          isOpen={this.state.isOpenModalUser}
          toggleFromParent={this.toggleUserModal}
          createNewUser={this.createNewUser}
        />
        {this.state.isOpenModalEditUser && (
          <ModalEditUser
            isOpen={this.state.isOpenModalEditUser}
            currentUser={this.state.userEdit}
            toggleFromParent={this.toggleUserEditModal}
            editUser={this.doEditUser}
            // createNewUser={this.createNewUser}
          />
        )}
        <div className="title text-center"> Manage users with Cohan</div>
        <div className="mx-1">
          <button
            className="btn btn-primary px-3"
            onClick={() => this.handleAddNewUser()}
          >
            <i className="fa fa-plus mx-1"></i>
            Add new user
          </button>
        </div>
        <div className="users-table mt-3 mx-1"></div>
        <table>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Action</th>
          </tr>

          {arrayUsers &&
            arrayUsers.map((item, index) => {
              return (
                <>
                  <tr>
                    <td>{item.email}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.address}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => this.handleEditUser(item)}
                      >
                        <i className="fa fa-pencil"></i>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => this.handleDeleteUser(item)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </>
              );
            })}
        </table>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
