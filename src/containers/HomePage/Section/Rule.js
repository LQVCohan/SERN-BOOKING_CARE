// Rule.js

import React, { Component } from "react";
import { connect } from "react-redux";
import HomeFooter from "../HomeFooter";
import HomeHeader from "../HomeHeader";

class Rule extends Component {
  render() {
    return (
      <>
        <HomeHeader />
        <div className="rule-container">
          <h1 style={{ textAlign: "center" }}>Điều khoản sử dụng</h1>
          <p>
            Xin chào và chào mừng bạn đến với trang web của chúng tôi. Trong quá
            trình sử dụng trang web này, bạn đồng ý tuân thủ các điều khoản và
            điều kiện sau đây. Hãy đọc kỹ trước khi sử dụng trang web.
          </p>
          <h2 style={{ fontWeight: "bold" }}>1. Phạm vi</h2>
          <p>
            &emsp;Nội dung và thông tin trên trang web này chỉ mang tính chất
            tham khảo và không được coi là tư vấn pháp lý hoặc y tế. Chúng tôi
            không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử
            dụng thông tin từ trang web này.
          </p>
          <h2 style={{ fontWeight: "bold" }}>2. Bản quyền</h2>
          <p>
            &emsp;Bản quyền của tất cả nội dung được bảo lưu. Mọi sự sao chép
            hoặc sử dụng mà không có sự đồng ý của chúng tôi là vi phạm bản
            quyền.
          </p>
          <h2 style={{ fontWeight: "bold" }}>3. Thay đổi điều khoản</h2>
          <p>
            &emsp;Chúng tôi có quyền thay đổi hoặc cập nhật điều khoản và điều
            kiện này mà không cần thông báo trước. Việc tiếp tục sử dụng trang
            web sau các thay đổi này đồng nghĩa với việc bạn chấp nhận và đồng ý
            với các điều khoản mới.
          </p>
          <h2 style={{ fontWeight: "bold" }}>4. Liên hệ</h2>
          <p>
            &emsp;Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào về điều khoản sử dụng
            này, vui lòng liên hệ với chúng tôi:
          </p>
          <ul
            className="contact-list"
            style={{ listStyleType: "none", paddingInlineStart: "0px" }}
          >
            <li>
              <strong>Facebook:</strong>{" "}
              <a href="https://www.facebook.com/quocviet6028/">
                https://www.facebook.com/quocviet6028/
              </a>
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:vietle632@gmail.com">vietle632@gmail.com</a>
            </li>
            <li>
              <strong>GitHub:</strong>{" "}
              <a href="https://github.com/LQVCohan">
                https://github.com/LQVCohan
              </a>
            </li>
          </ul>
        </div>
        <HomeFooter />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Rule);
