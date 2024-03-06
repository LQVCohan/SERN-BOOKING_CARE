import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableManageUser.scss";

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <table>
        <tbody>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
          <tr>
            <td>{"item.email"}</td>
            <td>{"item.firstName"}</td>
            <td>{"item.lastName"}</td>
            <td>{"item.address"}</td>
            <td>
              {" "}
              <button className="btn-edit">
                <i className="fa--pencil"></i>
              </button>
              <button className="btn-delete">
                <i className="fa fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
