import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import WithdrawEdtior from 'pages/Finance/Withdraw/WithdrawEditor';
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from 'utils';
import { Modal } from 'antd';

export interface IWithdrawListProps { }

export interface IWithdrawListState {
  // filter: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/finance/withdraw", { exact: false, })
@inject("common", "finance")
@observer
export default class WithdrawList extends BaseReact<IWithdrawListProps, IWithdrawListState> {
  private $withdrawEditor = null;
  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    withdrawModalVisible: false,
    user__username: undefined,
    province: undefined,
    city: undefined,
    reviewStatus: undefined,
    remitStatus: undefined,
    reviewDateRange: [],
    remitDateRange: [],
  };

  async componentDidMount() {
    // @todo 这里需要从 commonStore 中设置默认的分页
    const {
      paginationConfig: { defaultPageSize, defaultCurrent, },
    } = this.props.common;

    this.resetPagination(defaultPageSize, defaultCurrent);
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/finance/withdraw") {
      this.props.history.replace("/dashboard/finance/withdraw/list");
    }
  }

  getDataList = (payload = {}) => {
    this.setState(
      {
        tableLoading: true,
      },
      async () => {
        this.props.finance.setFilterWithdraw({
          ...payload,
        });
        await this.props.finance.getWithdrawList({
          params: this.props.finance.filterWithdraw,
        });
        this.setState({ tableLoading: false, });
      }
    );
  };

  toggleWithdrawModal = async (id?) => {
    this.setState({
      withdrawModalVisible: !this.state.withdrawModalVisible,
    });
  }

  onModalConfirm = async () => {
    const { currentWithdraw, } = this.props.finance;

    let res;
    if (!currentWithdraw.remit_number) {
      return this.$msg.warn('请输入划款单号');
    }

    if (!currentWithdraw.actual_amount) {
      return this.$msg.warn('请输入实付金额');
    }


    let payload: any = {
      remit_number: currentWithdraw.remit_number,
      actual_amount: currentWithdraw.actual_amount,
    };

    if (currentWithdraw.id) {
      // payload['id'] = currentWithdraw.id,
      res = await this.$api.finance.updateWithdraw(currentWithdraw.id, payload);
    } else {
      res = await this.$api.finance.createWithdraw(payload);
    }

    const statusCode = currentWithdraw.id ? 200 : 201;

    if (res.status == statusCode) {
      this.$msg.success(!currentWithdraw.id ? '利润规则添加成功' : '利润规则编辑成功');
      this.toggleWithdrawModal();
      this.getDataList(this.state.filter);
    } else {
      this.$msg.error(res.data.msg);
    }
  }

  onModalCancel = () => {
    this.setState({
      withdrawModalVisible: false,
    });
    this.props.finance.setCurrentWithdraw({}, true, false);
  }

  resetPagination = async (page_size, current_page) => {
    this.props.finance.setFilterWithdraw({
      page_size,
      current_page,
    });
    this.setState(
      {
        current_page,
      },
      async () => {
        const filter = this.props.finance.filterWithdraw;

        this.getDataList(filter);
      }
    );
  };
  // @ts-ignore
  private onSearch = async () => {
    this.props.finance.setFilterWithdraw({
      current_page: 1,
    });
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getDataList(this.props.finance.filterWithdraw);
      }
    );
  };
  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    const filter: any = {
      current_page: 1,
    };

    this.props.finance.setFilterWithdraw(filter, true);

    this.setState(
      {
        currentPage: 1,
        user__username: undefined,
        province: undefined,
        city: undefined,
        reviewStatus: undefined,
        remitStatus: undefined,
        reviewDateRange: [],
        remitDateRange: [],
      },
      () => {
        this.getDataList(this.props.finance.filterWithdraw);
      }
    );
  };

  goToEditor = (record: any): void => {
    const url = `/dashboard/finance/withdraw/editor?id=${!utils.isEmpty(record) ? record.id : 0}`;
    this.props.history.push(url);
  }

  renderMenu = (record): JSX.Element => {
    return null;
  };

  onDateRangeChange = (field, dateRange) => {
    this.props.finance.setFilterWithdraw({
      [`${field}_time__start`]: dateRange[0].unix(),
      [`${field}_time__end`]: dateRange[1].unix(),
    });

    this.setState({
      [`${field}DateRange`]: dateRange,
    });
  }

  onInputChanged = (field, value) => {
    this.setState({
      [field]: value,
    });
    this.props.finance.setFilterWithdraw({
      [field]: value ? value : undefined,
    });
  }

  onOptionSelect = (field, value, elem) => {
    this.setState({
      [`${field}Status`]: value,
    }, () => {
      this.props.finance.setFilterWithdraw({
        [`${field}_status`]: value,
      });

      this.getDataList(this.state.filter);
    });
  }

  // @ts-ignore
  private onBatch = async value => { };

  render() {
    const { match, } = this.props;
    const computedTitle = '出金管理';
    const { withdrawModalVisible, } = this.state;
    const { currentWithdraw, } = this.props.finance;

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        {
          withdrawModalVisible && (
            <Modal
              width={720}
              visible={withdrawModalVisible}
              title={
                utils.isEmpty(currentWithdraw.id) ? '添加利润规则' : '编辑利润规则'
              }
              onOk={this.onModalConfirm}
              onCancel={this.onModalCancel}
            >
              <WithdrawEdtior onRef={ref => this.$withdrawEditor = ref} />
            </Modal>
          )
        }
      </div>
    );
  }
}
