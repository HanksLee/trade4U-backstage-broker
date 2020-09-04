import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import * as React from "react";
import ReactDOM from "react-dom";
import { BaseReact } from "components/BaseReact";
import WithdrawEdtior from "pages/Finance/Withdraw/WithdrawEditor";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from "utils";
import { Modal } from "antd";

export interface IWithdrawListProps { }

export interface IWithdrawListState {
  // filter: any;
}

/* eslint new-cap: "off" */
@withRoutePermissionGuard("/dashboard/finance/withdraw", { exact: false, })
@inject("common", "finance")
@observer
export default class WithdrawList extends BaseReact<
IWithdrawListProps,
IWithdrawListState
> {
  private $withdrawEditor = null;

  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    withdrawModalVisible: false,
    user__username: undefined,
    phone: undefined,
    province: undefined,
    city: undefined,
    agent_name: undefined,
    reviewStatus: undefined,
    remitStatus: undefined,
    reviewDateRange: [],
    remitDateRange: [],
    exportExcelBtnStatus: false,
    platform_currency: "",
    withdraw_currency: "",
  };

  async componentDidMount() {
    // @todo 这里需要从 commonStore 中设置默认的分页
    const {
      paginationConfig: { defaultPageSize, defaultCurrent, },
    } = this.props.common;

    this.getCurrency();
    this.resetPagination(defaultPageSize, defaultCurrent);
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/finance/withdraw") {
      this.props.history.replace("/dashboard/finance/withdraw/list");
    }
  }

  getCurrency = async () => {
    const res = await this.$api.system.getBrokerConfigList();
    if (res.status === 200) {
      const self = this;
      res.data.forEach(function (item, index, array) {
        switch (item.key) {
          case "platform_currency":
            self.setState({ platform_currency: item.value, });
            break;
          case "withdraw_currency":
            self.setState({ withdraw_currency: item.value, });
            break;
        }
      });
    }
  };

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
  };

  onModalConfirm = async () => {
    const { currentWithdraw, } = this.props.finance;

    let res;

    if (currentWithdraw.remit_status != 2) {
      if (!currentWithdraw.remit_number) {
        return this.$msg.warn("请输入划款单号");
      }

      if (!currentWithdraw.actual_amount) {
        return this.$msg.warn("请输入实付金额");
      }
    }

    let payload: any = {
      remit_number: currentWithdraw.remit_number,
      actual_amount: currentWithdraw.actual_amount,
      remarks: currentWithdraw.remarks,
      remit_status: currentWithdraw.remit_status,
    };

    if (currentWithdraw.id) {
      // payload['id'] = currentWithdraw.id,
      res = await this.$api.finance.updateWithdraw(currentWithdraw.id, payload);
    } else {
      res = await this.$api.finance.createWithdraw(payload);
    }

    const statusCode = currentWithdraw.id ? 200 : 201;

    if (res.status == statusCode) {
      this.$msg.success(
        !currentWithdraw.id ? "利润规则添加成功" : "利润规则编辑成功"
      );
      this.toggleWithdrawModal();
      this.getDataList(this.props.finance.filterWithdraw);
    } else {
      this.$msg.error(res.data.msg);
    }
  };

  onModalCancel = () => {
    this.setState({
      withdrawModalVisible: false,
    });
    this.props.finance.setCurrentWithdraw({}, true, false);
  };

  resetPagination = async (page_size, current_page) => {
    this.props.finance.setFilterWithdraw({
      page_size,
      current_page,
      // user__username: undefined,
      // phone: undefined,
      // province: undefined,
      // city: undefined,
      // agent_name: undefined,
      // review_status: undefined,
      // remit_status: undefined,
      // reviewDateRange: [],
      // remitDateRange: [],
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
        this.comfirmSearchParams();
        // this.setTableAttrToExportExcel();
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
        phone: undefined,
        province: undefined,
        city: undefined,
        agent_name: undefined,
        reviewStatus: undefined,
        remitStatus: undefined,
        reviewDateRange: [],
        remitDateRange: [],
      },
      () => {
        this.getDataList(this.props.finance.filterWithdraw);
        this.comfirmSearchParams();
      }
    );
  };

  goToEditor = (record: any): void => {
    const url = `/dashboard/finance/withdraw/editor?id=${
      !utils.isEmpty(record) ? record.id : 0
    }`;
    this.props.history.push(url);
  };

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
  };

  onInputChanged = (field, value) => {
    this.setState({
      [field]: value,
    });
    this.props.finance.setFilterWithdraw({
      [field]: value ? value : undefined,
    });
  };

  onOptionSelect = (field, value, elem) => {
    this.setState(
      {
        [`${field}Status`]: value,
      },
      () => {
        this.props.finance.setFilterWithdraw({
          [`${field}_status`]: value,
        });

        // this.getDataList(this.props.finance.filterWithdraw);
      }
    );
  };

  comfirmSearchParams = () => {
    const {
      user__username,
      phone,
      province,
      city,
      agent_name,
      reviewStatus,
      remitStatus,
      reviewDateRange,
      remitDateRange,
    } = this.state;

    if (
      !utils.isEmpty(user__username) ||
      !utils.isEmpty(phone) ||
      !utils.isEmpty(province) ||
      !utils.isEmpty(city) ||
      !utils.isEmpty(agent_name) ||
      reviewStatus !== undefined ||
      remitStatus !== undefined ||
      !utils.isEmpty(reviewDateRange) ||
      !utils.isEmpty(remitDateRange)
    ) {
      this.setState({ exportExcelBtnStatus: true, });
    } else {
      this.setState({ exportExcelBtnStatus: false, });
    }
  };

  exportExcel = async () => {
    let queryString = '?';
    const {
      user__username,
      phone,
      province,
      city,
      agent_name,
      reviewStatus,
      remitStatus,
      reviewDateRange,
      remitDateRange,
    } = this.state;
    const filter: any = {
      user__username,
      phone,
      province,
      city,
      agent_name,
      review_status: reviewStatus,
      remit_statue: remitStatus,
    };

    if (!utils.isEmpty(reviewDateRange)) {
      filter.review_time__start = reviewDateRange[0].unix();
      filter.review_time__end = reviewDateRange[1].unix();
    }

    if (!utils.isEmpty(remitDateRange)) {
      filter.remit_time__start = remitDateRange[0].unix();
      filter.remit_time__end = remitDateRange[1].unix();
    }

    for (var index in filter) {
      if (filter[index] !== undefined && filter[index] !== "" && filter[index] !== null) {
        queryString += index + "=" + filter[index] + "&";
      }
    }


    await this.$api.finance.exportWithdraw({ responseType: 'blob', }, queryString).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${Date.now()}.xls`);
      document.body.appendChild(link);
      link.click();
    });
  }

  // setTableAttrToExportExcel = () => {
  //   const tableCon = ReactDOM.findDOMNode(this.exportExcel.current); // 通过ref属性找到该table
  //   const table = tableCon.querySelector("table"); //获取table
  //   table.setAttribute("id", "table-to-xls"); //给该table设置属性
  // };

  // @ts-ignore
  private onBatch = async value => { };

  render() {
    const { match, } = this.props;
    const computedTitle = "出金管理";
    const { withdrawModalVisible, } = this.state;
    const { currentWithdraw, } = this.props.finance;

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        {withdrawModalVisible && (
          <Modal
            width={720}
            visible={withdrawModalVisible}
            title={utils.isEmpty(currentWithdraw.id) ? "添加出金" : "编辑出金"}
            onOk={this.onModalConfirm}
            onCancel={this.onModalCancel}
          >
            <WithdrawEdtior onRef={ref => (this.$withdrawEditor = ref)} />
          </Modal>
        )}
      </div>
    );
  }
}
