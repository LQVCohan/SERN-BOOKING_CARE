import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import { getAllUsers } from "../../services/userService";
class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrayUsers: [],
    };
  }

  async componentDidMount() {
    let response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      this.setState({
        arrayUsers: response.users,
      });
    }
  }

  render() {
    let arrayUsers = this.state.arrayUsers;
    return (
      <div className="users-container">
        <div className="title text-center"> Manage users with Cohan</div>

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
                      <button className="btn-edit">
                        <i class="fa fa-pencil"></i>{" "}
                      </button>
                      <button className="btn-delete">
                        <i class="fa fa-trash"></i>
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
