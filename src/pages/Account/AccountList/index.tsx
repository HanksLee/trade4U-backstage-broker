import AccountDetailDrawer from "./AccountDetailDrawer";
import AccountEditor from "./AccountEditor";
import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import EditBalanceModal from "./EditBalanceModal";
import listConfig from "./config";
import TransferAgentModal from "./TransferAgentModal";
import ResetPasswordModal from "./ResetPasswordModal";
import TransferGroupModal from "./TransferGroupModal";
import WithRoute from "components/WithRoute";
import moment from "moment";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { Modal } from "antd";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import { PAGE_PERMISSION_MAP } from "constant";

export interface Account {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  agent?: number;
  agent_name?: string;
  birth?: string;
  mobile?: string;
  nationality?: string;
  nationality_name?: string;
  country_of_residence?: string;
  country_of_residence_name?: string;
  street?: string;
  city?: string;
  postal?: string;
  email?: string;
  id_card_front?: string;
  id_card_back?: string;
  group_name?: string;
  balance?: string;
  disable_status?: number;
  inspect_status: number;
  read_only?: number;
}

interface AccountListState {
  accountList: Account[];
  tableLoading: boolean;
  selectedRowKeys: string[];
  tempFilter: any;
  total: number;
  currentAccount: Account | null;
  isShowDetailDrawer: boolean;
  isShowBalanceModal: boolean;
  isShowTransferAgentModal: boolean;
  isShowTransferGroupModal: boolean;
  isShowResetPasswordModal: boolean;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/account/account", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/account/account"],
})
@inject("common", "account")
@observer
export default class AccountList extends BaseReact<{}, AccountListState> {
  state = {
    accountList: [],
    tableLoading: false,
    selectedRowKeys: [],
    tempFilter: {},
    total: 0,
    currentAccount: null,
    isShowDetailDrawer: false,
    isShowBalanceModal: false,
    isShowTransferAgentModal: false,
    isShowTransferGroupModal: false,
    isShowResetPasswordModal: false,
  };

  async componentDidMount() {
    const { filter, } = this.props.account;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      page_size: filter.page_size || paginationConfig.defaultPageSize,
      page: filter.page || 1,
    });
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/account/account") {
      this.props.history.replace("/dashboard/account/account/list");
    }
  }

  getDataList = async (filter?: any) => {
    const payload = filter
      ? { ...this.props.account.filter, ...filter, }
      : this.props.account.filter;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.account.getAccountList({ params: payload, });
    const { results, page_size, current_page, count, } = res.data;
    if (res.data.results.length === 0 && res.data.current_page !== 1) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.account.setFilter({
        page_size,
        page: current_page,
        name: payload.name,
      });
      this.setState({
        accountList: results,
        tableLoading: false,
        total: count,
      });
    }
  };

  // @ts-ignore
  private onSearch = async () => {
    const filter: any = {
      page: 1,
      ...this.state.tempFilter,
    };

    if (filter.start_time) {
      filter.start_time = filter.start_time.unix();
    }

    if (filter.end_time) {
      filter.end_time = filter.end_time.unix();
    }

    this.getDataList(filter);
  };

  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    this.getDataList({
      name: undefined,
      page: 1,
    });
    this.setState({
      tempFilter: {},
    });
  };

  onOptionSelect = (field, value, elem) => {
    this.setState((prevState: AccountListState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value,
      },
    }));
  };

  disabledDate = current => {
    if (this.state.tempFilter.start_time) {
      return (
        current > moment().endOf("day") ||
        current >
          this.state.tempFilter.start_time.valueOf() + 60 * 60 * 24 * 90 * 1000
      );
    } else {
      return current > moment().endOf("day");
    }
  };

  onInputChanged = (field, value, elem) => {
    this.setState((prevState: AccountListState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value,
      },
    }));
  };

  goToEditor = (e: any, id?: number) => {
    const url = `/dashboard/account/account/editor?id=${id ? id : 0}`;
    this.props.history.push(url);
  };

  viewDetail = (e: any, record: Account) => {
    this.setState({
      currentAccount: record,
      isShowDetailDrawer: true,
    });
  };

  hideDetailDrawer = () => {
    this.setState({
      currentAccount: null,
      isShowDetailDrawer: false,
    });
  };

  deleteAccount = async (id: string) => {
    const res = await this.$api.account.deleteAccount(id);
    if (res.status === 204) {
      this.getDataList();
    } else {
      this.$msg.error(res.data.message);
    }
  };

  updateAccountDetailField = (
    id: number,
    key: string,
    value: string,
    title: string
  ) => {
    Modal.confirm({
      title: title,
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        await this.$api.account.updateAccount(id, {
          [key]: value,
        });
        this.getDataList();
      },
    });
  };

  handleChangeBalance = (record: Account) => {
    this.setState({
      currentAccount: record,
      isShowBalanceModal: true,
    });
  };

  saveBalance = () => {
    this.hideEditBalanceModal();
    this.getDataList();
  };

  hideEditBalanceModal = () => {
    this.setState({
      currentAccount: null,
      isShowBalanceModal: false,
    });
  };

  handleTransferAgent = (e: any, record: Account) => {
    this.setState({
      currentAccount: record,
      isShowTransferAgentModal: true,
    });
  };

  saveTransferAgent = () => {
    this.hideTransferAgentModal();
    this.getDataList();
  };

  hideTransferAgentModal = () => {
    this.setState({
      currentAccount: null,
      isShowTransferAgentModal: false,
    });
  };

  saveTransferGroup = () => {
    this.hideTransferGroupModal();
    this.getDataList();
  };

  hideTransferGroupModal = () => {
    this.setState({
      isShowTransferGroupModal: false,
      selectedRowKeys: [],
    });
  };

  onBatch = async value => {
    if (value == "group") {
      this.setState({
        isShowTransferGroupModal: true,
      });
    }
  };

  handleResetPassword = (e: any, record: Account) => {
    this.setState({
      currentAccount: record,
      isShowResetPasswordModal: true,
    });
  };

  saveRetsetPassword = () => {
    this.hideResetPassword();
    this.getDataList();
  };

  hideResetPassword = () => {
    this.setState({
      currentAccount: null,
      isShowResetPasswordModal: false,
    });
  };


  render() {
    const { match, } = this.props;
    const {
      isShowDetailDrawer,
      isShowBalanceModal,
      currentAccount,
      isShowTransferAgentModal,
      isShowTransferGroupModal,
      isShowResetPasswordModal,
    } = this.state;
    return (
      <div>
        <CommonHeader {...this.props} links={[]} title="客户列表" />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        <Route
          path={`${match.url}/editor`}
          render={props => (
            <AccountEditor {...props} getAccountList={this.getDataList} />
          )}
        />
        {isShowDetailDrawer && (
          <AccountDetailDrawer
            id={currentAccount.id}
            name={currentAccount.last_name + currentAccount.first_name}
            onClose={this.hideDetailDrawer}
          />
        )}
        {isShowBalanceModal && currentAccount && (
          <EditBalanceModal
            id={currentAccount.id}
            username={currentAccount.first_name + currentAccount.last_name}
            phone={currentAccount.phone}
            balance={currentAccount.balance}
            onOk={this.saveBalance}
            onCancel={this.hideEditBalanceModal}
          />
        )}
        {isShowTransferAgentModal && currentAccount && (
          <TransferAgentModal
            currentAccount={currentAccount}
            onOk={this.saveTransferAgent}
            onCancel={this.hideTransferAgentModal}
          />
        )}
        {isShowResetPasswordModal && currentAccount && (
          <ResetPasswordModal
            currentAccount={currentAccount}
            onOk={this.saveRetsetPassword}
            onCancel={this.hideResetPassword}
          />
        )}
        {isShowTransferGroupModal && (
          <TransferGroupModal
            accounts={this.state.selectedRowKeys}
            onOk={this.saveTransferGroup}
            onCancel={this.hideTransferGroupModal}
          />
        )}
      </div>
    );
  }
}
