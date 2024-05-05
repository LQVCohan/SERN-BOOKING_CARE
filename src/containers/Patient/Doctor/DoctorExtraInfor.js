import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import HomeHeader from "../../HomePage/HomeHeader";
import "./DoctorExtraInfor.scss";
import {
  getDetailInfoDoctor,
  getScheduleByDateAndDoctor,
} from "../../../services/userService";
import { lang } from "moment";
import { LANGUAGES } from "../../../utils";
import Select from "react-select";
import moment from "moment";
import localization from "moment/locale/vi";
import { FormattedMessage } from "react-intl";

class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor:false
        };
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {
        }
    }
    async componentDidMount() {
        }
        
    showHideDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status,
        })
    }
    render() {
        let { isShowDetailInfor } = this.state;

    return (
        <div className="doctor-extra-infor-container">
            <div className="content-up">
                <div className="text-address">
                    ĐỊA CHỈ KHÁM
                </div>
                <div className="name-clinic">
                    Phòng khám Hư hại
                </div>
                <div className="detail-address">
                    Quận 9 - TPHCM
                </div>
                
            </div>
            <div className="content-down">
                {isShowDetailInfor === false && 
                    <div className="shot-infor">
                        GIÁ KHÁM: 500.000đ. 
                        <span onClick={() => this.showHideDetailInfor(true)}>
                            Xem chi tiết
                        </span>
                    </div>
                }
                {isShowDetailInfor === true &&
                <>
                    <div className="title-price">
                        GIÁ KHÁM: 
                    </div>
                    <div className="detail-infor">
                        <div className="price">
                            <span className="left">
                                Giá khám
                            </span>
                            <span className="right">
                                250.000đ
                            </span>
                        </div>
                        <div className="note">
                            Cúng vườn trước khi khám nha con
                        </div>
                    </div>
                        <div className="payment">
                            Bệnh nhân có thể thanh toán chi phí bằng phẳng
                        </div>
                    <div className="hide-price">
                        <span onClick={() => this.showHideDetailInfor(false)}>
                            Ẩn bảng giá
                        </span>
                    </div>
                </>

                }

            </div>
        </div>
    );
    }
}
const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
