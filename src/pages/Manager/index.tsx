import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import EditUserModal from "./EditUserModal";
import listConfig from "./config";
import utils from "utils";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import { PAGE_PERMISSION_MAP } from "constant";

export interface ManagerType {
  id: number;
  name: string;
  managers: number;
  permissions: number[];
  create_time: number;
  can_modify: boolean;
}

interface IManagerState {
  managerList: ManagerType[];
  currentUser: ManagerType | null;
  isShowEditUserModal: boolean;
}

interface ManagerListState extends IManagerState {
  tableLoading: boolean;
  selectedRowKeys: string[];
  tempFilter: any;
  total: number;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/manager", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/manager"],
})
@inject("common", "manager")
@observer
export default class ManagerList extends BaseReact<{}, ManagerListState> {
  state = {
    managerList: [],
    tableLoading: false,
    selectedRowKeys: [],
    tempFilter: {},
    total: 0,
    roleList: [],
    currentUser: null,
    isShowEditUserModal: false,
  };

  async componentDidMount() {
    const { filter, } = this.props.manager;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      page_size: filter.page_size || paginationConfig.defaultPageSize,
      page: filter.page || 1,
    });
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/manager") {
      this.props.history.replace("/dashboard/manager/list");
    }
  }

  getDataList = async (filter?: any) => {
    const payload = filter
      ? { ...this.props.manager.filter, ...filter, }
      : this.props.manager.filter;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.manager.getManagerList({ params: payload, });
    const { results, page_size, current_page, count, } = res.data;
    if (results.length === 0 && current_page !== 1) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.manager.setFilter({
        page_size,
        page: current_page,
        name: payload.name,
      });
      this.setState({
        managerList: results,
        tableLoading: false,
        total: count,
      });
    }
  };

  // // @ts-ignore
  // private onSearch = async () => {
  //   this.getDataList({
  //     page: 1,
  //     ...this.state.tempFilter,
  //   });
  // };

  // // @ts-ignore
  // private onReset = async () => {
  //   // @ts-ignore
  //   this.getDataList({
  //     name: undefined,
  //     page: 1,
  //   });
  //   this.setState({
  //     tempFilter: {},
  //   });
  // };

  // onInputChanged = (field, value) => {
  //   this.setState((prevState: BrokerListState) => (
  //     {
  //       tempFilter: {
  //         ...prevState.tempFilter,
  //         [field]: value,
  //       },
  //     }
  //   ));
  // }

  // goToEditor = (id?: number) => {
  //   const url = `/dashboard/broker/editor?id=${id ? id : 0}`;
  //   this.props.history.push(url);
  // }

  // goToPermissionEditor = (id: number) => {
  //   const url = `/dashboard/broker/permission?id=${id}`;
  //   this.props.history.push(url);
  // }

  // brokerLogin = async (id: number) => {
  //   const res = await this.$api.broker.getBrokerLoginUrl(id);
  //   window.open(res.data.url);
  // }

  deleteManager = async (id: string) => {
    const res = await this.$api.manager.deleteManager(id);
    if (res.status === 204) {
      this.getDataList();
    } else {
      this.$msg.error(res.data.message);
    }
  };

  showEditUserModal = (user?: ManagerType) => {
    if (user) {
      this.setState({
        currentUser: user,
      });
    }

    this.setState({
      isShowEditUserModal: true,
    });
  };

  hideEditUserModal = () => {
    this.setState({
      isShowEditUserModal: false,
      currentUser: null,
    });
  };

  handleUpdateUser = () => {
    this.hideEditUserModal();
    this.getDataList();
  };

  render() {
    const { match, } = this.props;
    const { currentUser, isShowEditUserModal, } = this.state;
    return (
      <>
        <div>
          <CommonHeader {...this.props} links={[]} title="管理员管理" />
          {/* {<CommonList {...this.props} config={listConfig(this)} />} */}
          <Route
            path={`${match.url}/list`}
            render={props => (
              <CommonList {...props} config={listConfig(this)} />
            )}
          />
        </div>
        {isShowEditUserModal && (
          <EditUserModal
            user={currentUser}
            onOk={this.handleUpdateUser}
            onCancel={this.hideEditUserModal}
          />
        )}
      </>
    );
  }
}
