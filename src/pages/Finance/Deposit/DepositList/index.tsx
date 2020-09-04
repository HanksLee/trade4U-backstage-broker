import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import * as React from "react";
import ReactDOM from "react-dom";
import { BaseReact } from "components/BaseReact";
import DepositEdtior from "pages/Finance/Deposit/DepositEditor";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from "utils";
import { Modal } from "antd";

export interface IDepositListProps { }

export interface IDepositListState {
  // filter: any;
}

/* eslint new-cap: "off" */
@withRoutePermissionGuard("/dashboard/finance/deposit", { exact: false, })
@inject("common", "finance")
@observer
export default class DepositList extends BaseReact<
IDepositListProps,
IDepositListState
> {
  private $depositEditor = null;
  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    depositModalVisible: false,
    user__username: undefined,
    expect_amount: undefined,
    phone: undefined,
    order_number: undefined,
    agent_name: undefined,
    status: undefined,
    createDateRange: [],
    notifyDateRange: [],
    initStatus: 0, // 订单状态
    exportExcelBtnStatus: false,
    excelFileName: "入金管理",
  };

  async componentDidMount() {
    // @todo 这里需要从 commonStore 中设置默认的分页
    const {
      paginationConfig: { defaultPageSize, defaultCurrent, },
    } = this.props.common;

    this.resetPagination(defaultPageSize, defaultCurrent);
    // this.getScopeOptions();
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/finance/deposit") {
      this.props.history.replace("/dashboard/finance/deposit/list");
    }
  }

  getScopeOptions = async () => {
    const res = await this.$api.finance.getScopeOptions();

    if (res.data.status == 200) {
      this.setState({
        scopeOptions: res.data.list,
      });
    }
  };

  getDataList = (payload = {}) => {
    this.setState(
      {
        tableLoading: true,
      },
      async () => {
        this.props.finance.setFilterDeposit({
          ...payload,
        });
        await this.props.finance.getDepositList({
          params: this.props.finance.filterDeposit,
        });
        this.setState({ tableLoading: false, });
      }
    );
  };

  onInputChanged = (field, value) => {
    this.setState({
      [field]: value,
    });
    this.props.finance.setFilterDeposit({
      [field]: value ? value : undefined,
    });
  };

  toggleDepositModal = async (id?) => {
    this.setState({
      depositModalVisible: !this.state.depositModalVisible,
    });
  };

  onModalConfirm = async () => {
    const { currentDeposit, } = this.props.finance;

    let res;
    if (currentDeposit.status == null) {
      return this.$msg.warn("请选择支付状态");
    }

    let payload: any = {
      order_number: currentDeposit.order_number,
      status: currentDeposit.status,
      remarks: currentDeposit.remarks,
    };

    if (currentDeposit.id) {
      // payload['id'] = currentDeposit.id,
      res = await this.$api.finance.updateDeposit(currentDeposit.id, payload);
    } else {
      res = await this.$api.finance.createDeposit(payload);
    }

    const statusCode = currentDeposit.id ? 200 : 201;

    if (res.status == statusCode) {
      this.$msg.success(
        !currentDeposit.id ? "订单状态添加成功" : "订单状态编辑成功"
      );
      this.toggleDepositModal();
      this.getDataList(this.props.finance.filterDeposit);
    } else {
      this.$msg.error(res.data.msg);
    }
  };

  onModalCancel = () => {
    this.setState({
      depositModalVisible: false,
    });
    this.props.finance.setCurrentDeposit({}, true, false);
  };

  onDateRangeChange = (field, dateRange) => {
    this.props.finance.setFilterDeposit({
      [`${field}_time__start`]: dateRange[0].unix(),
      [`${field}_time__end`]: dateRange[1].unix(),
    });

    this.setState({
      [`${field}DateRange`]: dateRange,
    });
  };

  resetPagination = async (page_size, current_page) => {
    this.props.finance.setFilterDeposit({
      page_size,
      current_page,
      // user__username: undefined,
      // expect_amount: undefined,
      // phone: undefined,
      // order_number: undefined,
      // agent_name: undefined,
      // status: undefined,
      // createDateRange: [],
      // notifyDateRange: [],
    });
    this.setState(
      {
        current_page,
      },
      async () => {
        const filter = this.props.finance.filterDeposit;

        this.getDataList(filter);
      }
    );
  };
  // @ts-ignore
  private onSearch = async () => {
    this.props.finance.setFilterDeposit({
      current_page: 1,
    });
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.comfirmSearchParams();
        // this.setTableAttrToExportExcel();
        this.getDataList(this.props.finance.filterDeposit);
      }
    );
  };
  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    const filter: any = {
      current_page: 1,
      page_size: this.props.finance.filterDeposit.page_size,
    };

    this.props.finance.setFilterDeposit(filter, true);

    this.setState(
      {
        currentPage: 1,
        user__username: undefined,
        expect_amount: undefined,
        phone: undefined,
        order_number: undefined,
        agent_name: undefined,
        status: undefined,
        createDateRange: [],
        notifyDateRange: [],
      },
      () => {
        this.getDataList(this.props.finance.filterDeposit);
        this.comfirmSearchParams();
      }
    );
  };

  goToEditor = (record: any): void => {
    const url = `/dashboard/finance/deposit/editor?id=${
      !utils.isEmpty(record) ? record.id : 0
    }`;
    this.props.history.push(url);
  };

  renderMenu = (record): JSX.Element => {
    return null;
  };

  onOptionSelect = (field, value, elem) => {
    this.setState(
      {
        [`${field}`]: value,
      },
      () => {
        this.props.finance.setFilterDeposit({
          [`${field}`]: value,
        });
      }
    );
  };

  comfirmSearchParams = () => {
    const {
      user__username,
      expect_amount,
      phone,
      order_number,
      agent_name,
      createDateRange,
      notifyDateRange,
      status,
    } = this.state;

    if (
      !utils.isEmpty(user__username) ||
      !utils.isEmpty(phone) ||
      !utils.isEmpty(expect_amount) ||
      !utils.isEmpty(order_number) ||
      !utils.isEmpty(agent_name) ||
      !utils.isEmpty(createDateRange) ||
      !utils.isEmpty(notifyDateRange) ||
      status !== undefined

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
      expect_amount,
      phone,
      order_number,
      agent_name,
      createDateRange,
      notifyDateRange,
      status,
    } = this.state;
    const filter: any = {
      user__username,
      phone,
      expect_amount,
      order_number,
      agent_name,
      status,
    };

    if (!utils.isEmpty(createDateRange)) {
      filter.create_time__start = createDateRange[0].unix();
      filter.create_time__end = createDateRange[1].unix();
    }

    if (!utils.isEmpty(notifyDateRange)) {
      filter.notify_time__start = notifyDateRange[0].unix();
      filter.notify_time__end = notifyDateRange[1].unix();
    }

    for (var index in filter) {
      if (filter[index] !== undefined && filter[index] !== "" && filter[index] !== null) {
        queryString += index + "=" + filter[index] + "&";
      }
    }


    await this.$api.finance.exportDeposit({ responseType: 'blob', }, queryString).then((response) => {
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
    const computedTitle = "入金管理";
    const { depositModalVisible, initStatus, } = this.state;
    const { currentDeposit, } = this.props.finance;

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        {depositModalVisible && (
          <Modal
            width={720}
            visible={depositModalVisible}
            title={
              utils.isEmpty(currentDeposit.id) ? "添加订单状态" : "更改订单状态"
            }
            onOk={this.onModalConfirm}
            onCancel={this.onModalCancel}
          >
            <DepositEdtior
              initStatus={initStatus}
              onRef={ref => (this.$depositEditor = ref)}
            />
          </Modal>
        )}
      </div>
    );
  }
}
