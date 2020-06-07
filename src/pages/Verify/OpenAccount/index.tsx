import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import EditUserModal from "./EditUserModal";
import listConfig from "./config";
// import utils from "utils";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import { PAGE_PERMISSION_MAP } from "constant";
import "./index.scss";

export interface VerifyOpenAccountType {
  id: number;
  username: string;
  id_card: string;
  id_card_front: string;
  id_card_back: string;
  create_time: number;
  inspect_status: number;
  inspect_time: string;
  inspect_person: number;
  reason: string;
}

interface IVerifyOpenAccountProps {}

interface IVerifyOpenAccountState {
  verifyList: VerifyOpenAccountType[];
  currentVerify: VerifyOpenAccountType | null;
  isShowEditVerifyModal: boolean;
}

interface VerifyOpenAccountListState extends IVerifyOpenAccountState {
  tableLoading: boolean;
  selectedRowKeys: string[];
  total: number;
  tempFilter: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/verify/openaccount", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/verify/openaccount"],
})
@inject("common", "verify")
@observer
export default class VerifyList extends BaseReact<
IVerifyOpenAccountProps,
VerifyOpenAccountListState
> {
  state = {
    verifyList: [],
    tableLoading: false,
    selectedRowKeys: [],
    total: 0,
    tempFilter: {},
    currentVerify: null,
    isShowEditVerifyModal: false,
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
    if (this.props.location.pathname === "/dashboard/verify/openaccount") {
      this.props.history.replace("/dashboard/verify/openaccount/list");
    }
  }

  getDataList = async (filter?: any) => {
    const payload = filter
      ? { ...this.props.verify.filter, ...filter, }
      : this.props.verify.filter;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.verify.getVerifyList({ params: payload, });
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
        verifyList: results,
        tableLoading: false,
        total: count,
      });
    }
  };

  deleteVerify = async (id: string) => {
    const res = await this.$api.verify.deleteVerify(id);
    if (res.status === 204) {
      this.getDataList();
    } else {
      this.$msg.error(res.data.message);
    }
  };

  showEditVerifyModal = (verify?: VerifyOpenAccountType) => {
    if (verify) {
      this.setState({
        currentVerify: verify,
      });
    }

    this.setState({
      isShowEditVerifyModal: true,
    });
  };

  hideEditVerifyModal = () => {
    this.setState({
      isShowEditVerifyModal: false,
      currentVerify: null,
    });
  };

  handleUpdateVerify = () => {
    this.hideEditVerifyModal();
    this.getDataList();
  };

  render() {
    const { match, } = this.props;
    const { currentVerify, isShowEditVerifyModal, } = this.state;
    return (
      <>
        <div>
          <CommonHeader {...this.props} links={[]} title="开户审批" />
          <Route
            path={`${match.url}/list`}
            render={props => (
              <CommonList {...props} config={listConfig(this)} />
            )}
          />
        </div>
        {isShowEditVerifyModal && (
          <EditUserModal
            userVerify={currentVerify}
            onOk={this.handleUpdateVerify}
            onCancel={this.hideEditVerifyModal}
          />
        )}
      </>
    );
  }
}
