import AccountDetailDrawer from './AccountDetailDrawer';
import AccountEditor from './AccountEditor';
import RebateSettingsEditor from './RebateSettingsEditor';
import CommonHeader from 'components/CommonHeader';
import CommonList from 'components/CommonList';
import EditBalanceModal from './EditBalanceModal';
import TransferCustomModal from './TransferCustomModal';
import TransferAgentModal from './TransferAgentModal';

import listConfig from './config';
import WithRoute from 'components/WithRoute';
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Modal } from 'antd';
import { inject, observer } from 'mobx-react';
import { Route } from 'react-router-dom';
import { PAGE_PERMISSION_MAP } from 'constant';

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
  tempFilterAgent: any;
  total: number;
  currentAccount: {
    id: number;
  } | null;
  currentAgent: any;
  isShowDetailDrawer: boolean;
  isShowBalanceModal: boolean;
  isShowCustomModal: boolean;
  isShowAgentModal: boolean;
};

/* eslint new-cap: "off" */
@WithRoute("/dashboard/agency/agent", { exact: false, permissionCode: PAGE_PERMISSION_MAP['/dashboard/agency/agent'], })
@inject("common", "agency")
@observer
export default class AccountList extends BaseReact<{}, AccountListState> {
  state = {
    accountList: [],
    tableLoading: false,
    selectedRowKeys: [],
    tempFilterAgent: {},
    total: 0,
    currentAccount: null,
    currentAgent: null,
    isShowDetailDrawer: false,
    isShowBalanceModal: false,
    isShowCustomModal: false,
    isShowAgentModal: false,
  };

  async componentDidMount() {
    const { filterAgent, } = this.props.agency;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      page_size: filterAgent.page_size || paginationConfig.defaultPageSize,
      page: filterAgent.page || 1,
    });
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/agency/agent") {
      this.props.history.replace("/dashboard/agency/agent/list");
    }
  }

  getDataList = async (filterAgent?: any) => {
    const payload = filterAgent ? { ...this.props.agency.filterAgent, ...filterAgent, } : this.props.agency.filterAgent;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.agency.getAccountList({ params: payload, });
    const { results, page_size, current_page, count, } = res.data;
    if ((res.data.results.length === 0) && res.data.current_page !== 1) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.agency.setFilterAgent({
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
    const filterAgent: any = {
      page: 1,
      ...this.state.tempFilterAgent,
    };

    if (filterAgent.start_time) {
      filterAgent.start_time = filterAgent.start_time.unix();
    }

    if (filterAgent.end_time) {
      filterAgent.end_time = filterAgent.end_time.unix();
    }

    this.getDataList(filterAgent);
  };

  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    this.getDataList({
      name: undefined,
      page: 1,
    });
    this.setState({
      tempFilterAgent: {},
    });
  };

  onInputChanged = (field, value) => {
    this.setState((prevState: AccountListState) => (
      {
        tempFilterAgent: {
          ...prevState.tempFilterAgent,
          [field]: value,
        },
      }
    ));
  }

  goToEditor = (e: any, id?: number) => {
    const url = `/dashboard/agency/agent/editor?id=${id ? id : 0}`;
    this.props.history.push(url);
  }

  viewDetail = (e: any, record: Account) => {
    this.setState({
      currentAccount: record,
      isShowDetailDrawer: true,
    });
  }

  hideDetailDrawer = () => {
    this.setState({
      currentAccount: null,
      isShowDetailDrawer: false,
    });
  }

  jumpToAgentAdmin = async (id: number) => {
    const res = await this.$api.agency.getJumpUrl(id);
    if (res.status === 200) {
      (window as any).open(res.data.url, '_blank');
    }
  }

  deleteAccount = async (id: string) => {
    const res = await this.$api.agency.deleteAccount(id);
    if (res.status === 204) {
      this.getDataList();
    } else {
      this.$msg.error(res.data.message);
    }
  }

  updateAccountDetailField = (id: number, key: string, value: string, title: string) => {
    Modal.confirm({
      title: title,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await this.$api.agency.updateAccount(id, {
          [key]: value,
        });
        this.getDataList();
      },
    });
  }

  handleChangeBalance = (record: Account) => {
    this.setState({
      currentAccount: record,
      isShowBalanceModal: true,
    });
  }

  saveBalance = () => {
    this.hideEditBalanceModal();
    this.getDataList();
  }

  hideEditBalanceModal = () => {
    this.setState({
      currentAccount: null,
      isShowBalanceModal: false,
    });
  }

  saveCustom = () => {
    this.hideCustomModal();
    this.getDataList();
  }

  hideCustomModal = () => {
    this.setState({
      isShowCustomModal: false,
    });
  }

  saveAgent = () => {
    this.hideAgentModal();
    this.getDataList();
  }

  hideAgentModal = () => {
    this.setState({
      currentAgent: null,
      isShowAgentModal: false,
    });
  }

  onBatch = async (value) => {
    if (value == 'custom_group') {
      this.setState({
        isShowCustomModal: true,
      });
    }
  }

  render() {
    const { match, } = this.props;
    const { isShowDetailDrawer, isShowBalanceModal, currentAccount, isShowCustomModal, isShowAgentModal, currentAgent, } = this.state;
    return (
      <div>
        <CommonHeader {...this.props} links={[]} title="代理商列表" />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        <Route path={`${match.url}/editor`} render={props => (
          <AccountEditor {...props} getAccountList={this.getDataList} />
        )} />
        <Route path={`${match.url}/rebate-editor`} render={props => (
          <RebateSettingsEditor {...props} />
        )} />
        {
          isShowDetailDrawer && (
            <AccountDetailDrawer
              id={currentAccount.id}
              name={currentAccount.last_name + currentAccount.first_name}
              onClose={this.hideDetailDrawer}
            />
          )
        }
        {
          isShowBalanceModal && currentAccount && (
            <EditBalanceModal
              id={currentAccount.id}
              username={currentAccount.first_name + currentAccount.last_name}
              phone={currentAccount.phone}
              balance={currentAccount.balance}
              onOk={this.saveBalance}
              onCancel={this.hideEditBalanceModal}
            />
          )
        }
        {
          isShowCustomModal && (
            <TransferCustomModal
              agents={this.state.selectedRowKeys}
              onOk={this.saveCustom}
              onCancel={this.hideCustomModal}
            />
          )
        }
        {
          isShowAgentModal && (
            <TransferAgentModal
              currentAgent={currentAgent}
              agents={this.state.selectedRowKeys}
              onOk={this.saveAgent}
              onCancel={this.hideAgentModal}
            />
          )
        }
      </div>
    );
  }
}