import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import EditWithdrawApplyModal from "./EditWithdrawApplyModal";
import listConfig from "./config";
// import utils from "utils";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import { ROUTE_TO_PERMISSION } from "constant";
import "./index.scss";

export interface VerifyWithdrawApplyType {
  id: number;
  username: string;
  phone: string;
  order_number: string;
  province: string;
  city: string;
  card_number: string;
  bank: string;
  sub_branch: string;
  expect_amount: string;
  expect_currency: string;
  actual_amount: string;
  actual_currency: string;
  review_status: number;
  review_time: number;
  reviewer: string;
  reviewer_name: string;
  remit_status: number;
  remitter: string;
  remitter_name: string;
  remit_number: string;
  create_time: number;
}

interface IVerifyWithdrawApplyState {
  withdrawApplyList: VerifyWithdrawApplyType[];
  currentWithdrawApply: VerifyWithdrawApplyType | null;
  isShowEditWithdrawApplyModal: boolean;
}

interface VerifyWithdrawApplyListState extends IVerifyWithdrawApplyState {
  tableLoading: boolean;
  selectedRowKeys: string[];
  total: number;
  tempFilter: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/verify/withdrawapply", {
  exact: false,
  permissionCode: ROUTE_TO_PERMISSION["/dashboard/verify/withdrawapply"],
})
@inject("common", "verify")
@observer
export default class VerifyWithdrawApplyList extends BaseReact<
{},
VerifyWithdrawApplyListState
> {
  state = {
    withdrawApplyList: [],
    tableLoading: false,
    selectedRowKeys: [],
    total: 0,
    tempFilter: {},
    currentWithdrawApply: null,
    isShowEditWithdrawApplyModal: false,
  };

  async componentDidMount() {
    const { filter, } = this.props.verify;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      page_size: filter.page_size || paginationConfig.defaultPageSize,
      page: filter.page || 1,
    });
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/verify/withdrawapply") {
      this.props.history.replace("/dashboard/verify/withdrawapply/list");
    }
  }

  getDataList = async (filter?: any) => {
    const payload = filter
      ? { ...this.props.verify.filter, ...filter, }
      : this.props.verify.filter;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.verify.getWithdrawApplyList({
      params: payload,
    });
    const { results, page_size, current_page, count, } = res.data;
    if (results.length === 0 && current_page !== 1) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.verify.setFilter({
        page_size,
        page: current_page,
        name: payload.name,
      });
      this.setState({
        withdrawApplyList: results,
        tableLoading: false,
        total: count,
      });
    }
  };

  deleteWithdrawApply = async (id: string) => {
    const res = await this.$api.verify.deleteWithdrawApply(id);
    if (res.status === 204) {
      this.getDataList();
    } else {
      this.$msg.error(res.data.message);
    }
  };

  showEditWithdrawApplyModal = (withdrawApply?: VerifyWithdrawApplyType) => {
    if (withdrawApply) {
      this.setState({
        currentWithdrawApply: withdrawApply,
      });
    }

    this.setState({
      isShowEditWithdrawApplyModal: true,
    });
  };

  hideEditWithdrawApplyModal = () => {
    this.setState({
      isShowEditWithdrawApplyModal: false,
      currentWithdrawApply: null,
    });
  };

  handleUpdateWithdrawApply = () => {
    this.hideEditWithdrawApplyModal();
    this.getDataList();
  };

  render() {
    const { match, } = this.props;
    const { currentWithdrawApply, isShowEditWithdrawApplyModal, } = this.state;
    return (
      <>
        <div>
          <CommonHeader {...this.props} links={[]} title="客户出金审批" />
          <Route
            path={`${match.url}/list`}
            render={props => (
              <CommonList {...props} config={listConfig(this)} />
            )}
          />
        </div>
        {isShowEditWithdrawApplyModal && (
          <EditWithdrawApplyModal
            withdrawApplyVerify={currentWithdrawApply}
            onOk={this.handleUpdateWithdrawApply}
            onCancel={this.hideEditWithdrawApplyModal}
          />
        )}
      </>
    );
  }
}
