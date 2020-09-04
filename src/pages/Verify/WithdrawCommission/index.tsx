import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import EditCommissionModal from "./EditCommissionModal";
import listConfig from "./config";
// import utils from "utils";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import { ROUTE_TO_PERMISSION } from "constant";
import "./index.scss";

export interface VerifyCommissionType {
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
  create_time: number;
}

interface IVerifyCommissionState {
  commissionList: VerifyCommissionType[];
  currentCommission: VerifyCommissionType | null;
  isShowEditCommissionModal: boolean;
}

interface VerifyCommissionListState extends IVerifyCommissionState {
  tableLoading: boolean;
  selectedRowKeys: string[];
  total: number;
  tempFilter: any;
}

/* eslint new-cap: "off" */
@withRoutePermissionGuard("/dashboard/verify/commission", {
  exact: false,
  permissionCode: ROUTE_TO_PERMISSION["/dashboard/verify/commission"],
})
@inject("common", "verify")
@observer
export default class CommissionList extends BaseReact<
{},
VerifyCommissionListState
> {
  state = {
    commissionList: [],
    tableLoading: false,
    selectedRowKeys: [],
    total: 0,
    tempFilter: {},
    currentCommission: null,
    isShowEditCommissionModal: false,
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
    if (this.props.location.pathname === "/dashboard/verify/commission") {
      this.props.history.replace("/dashboard/verify/commission/list");
    }
  }

  getDataList = async (filter?: any) => {
    const payload = filter
      ? { ...this.props.verify.filter, ...filter, }
      : this.props.verify.filter;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.verify.getWithdrawcommissionList({
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
        commissionList: results,
        tableLoading: false,
        total: count,
      });
    }
  };

  showEditCommissionModal = (commission?: VerifyCommissionType) => {
    if (commission) {
      this.setState({
        currentCommission: commission,
      });
    }

    this.setState({
      isShowEditCommissionModal: true,
    });
  };

  hideEditCommissionModal = () => {
    this.setState({
      isShowEditCommissionModal: false,
      currentCommission: null,
    });
  };

  handleUpdateCommission = () => {
    this.hideEditCommissionModal();
    this.getDataList();
  };

  render() {
    const { match, } = this.props;
    const { currentCommission, isShowEditCommissionModal, } = this.state;
    return (
      <>
        <div>
          <CommonHeader {...this.props} links={[]} title="佣金出金审批" />
          <Route
            path={`${match.url}/list`}
            render={props => (
              <CommonList {...props} config={listConfig(this)} />
            )}
          />
        </div>
        {isShowEditCommissionModal && (
          <EditCommissionModal
            commissionVerify={currentCommission}
            onOk={this.handleUpdateCommission}
            onCancel={this.hideEditCommissionModal}
          />
        )}
      </>
    );
  }
}
