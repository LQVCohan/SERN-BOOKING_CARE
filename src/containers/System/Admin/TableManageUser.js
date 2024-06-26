import React, { Component } from "react";
import { connect } from "react-redux";
import "./TableManageUser.scss";
import * as actions from "../../../store/actions";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersRedux: [],
    };
  }

  componentDidMount() {
    try {
      this.props.fetchUserRedux();
    } catch (error) {
      console.error("Error in componentDidMount:", error);
      // Handle error as per your application's requirements
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    try {
      if (prevProps.listUsers !== this.props.listUsers) {
        this.setState({
          usersRedux: this.props.listUsers,
        });
      }
    } catch (error) {
      console.error("Error in componentDidUpdate:", error);
      // Handle error as per your application's requirements
    }
  }

  handleDeleteUser = (user) => {
    try {
      this.props.deleteAUserRedux(user.id);
    } catch (error) {
      console.error("Error in handleDeleteUser:", error);
      // Handle error as per your application's requirements
    }
  };

  handleEditUser = (user) => {
    try {
      this.props.handleEditUserFromParentKey(user);
    } catch (error) {
      console.error("Error in handleEditUser:", error);
      // Handle error as per your application's requirements
    }
  };

  handleEditorChange = ({ html, text }) => {
    try {
      console.log("handleEditorChange", html, text);
      // You can handle the editor change here
    } catch (error) {
      console.error("Error in handleEditorChange:", error);
      // Handle error as per your application's requirements
    }
  };

  render() {
    try {
      const { listUsers } = this.props;

      return (
        <React.Fragment>
          <table>
            <tbody>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
              {listUsers &&
                listUsers.length > 0 &&
                listUsers.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.email}</td>
                      <td>{item.firstName}</td>
                      <td>{item.lastName}</td>
                      <td>{item.address}</td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => this.handleEditUser(item)}
                        >
                          <i className="fa--pencil"></i>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => this.handleDeleteUser(item)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <MdEditor
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
          />
        </React.Fragment>
      );
    } catch (error) {
      console.error("Error in render:", error);
      // Handle error as per your application's requirements
      return null;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    deleteAUserRedux: (id) => dispatch(actions.deleteAUser(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
