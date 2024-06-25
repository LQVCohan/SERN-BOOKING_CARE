import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { forgotPassword } from "../../../store/actions/authActions";
import { toast } from "react-toastify";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  }

  handleChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { email } = this.state;
    if (!email) {
      toast.error("Please enter your email.");
    } else {
      this.props.forgotPassword(email);
    }
  };

  render() {
    const { loading, error, successMessage } = this.props;

    return (
      <div className="container">
        <h2>
          <FormattedMessage id="forgot-password.title" />
        </h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              <FormattedMessage id="forgot-password.email-label" />
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <FormattedMessage id="forgot-password.sending" />
            ) : (
              <FormattedMessage id="forgot-password.submit" />
            )}
          </button>
        </form>
        {error && <p className="text-danger">{error}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  error: state.auth.error,
  successMessage: state.auth.successMessage,
});

const mapDispatchToProps = (dispatch) => ({
  forgotPassword: (email) => dispatch(forgotPassword(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
