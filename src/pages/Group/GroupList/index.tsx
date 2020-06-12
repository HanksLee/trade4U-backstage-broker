import AddGroupModal from "../AddGroupModal";
import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import GroupSymbolList from "../GroupSymbolList";
import listConfig from "./config";
import EditGroupModal from "../EditGroupModal";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import { PAGE_PERMISSION_MAP } from "constant";
import utils from "utils";

interface Group {
  id: string;
  name: string;
  status: number;
  is_default: number;
  margin_call: number;
  stop_out_level: number;
  symbol_type?: string[];
}

interface GroupListState {
  groupList: Group[];
  tableLoading: boolean;
  selectedRowKeys: string[];
  currentGroup: Group | null;
  isShowAddGroupModal: boolean;
  isShowEditGroupModal: boolean;
  tempFilter: any;
  total: number;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/group", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/group"],
})
@inject("common", "group")
@observer
export default class GroupList extends BaseReact<{}, GroupListState> {
  state = {
    groupList: [],
    tableLoading: false,
    selectedRowKeys: [],
    currentGroup: null,
    isShowAddGroupModal: false,
    isShowEditGroupModal: false,
    tempFilter: {},
    total: 0,
  };

  async componentDidMount() {
    const { filter, } = this.props.group;
    const { paginationConfig, } = this.props.common;
    this.getDataList({
      ...utils.resetFilter(filter),
      page_size: paginationConfig.defaultPageSize,
      page: 1,
    });
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/group") {
      this.props.history.replace("/dashboard/group/list");
    }
  }

  getDataList = async (filter?: any) => {
    const payload = filter
      ? { ...this.props.group.filter, ...filter, }
      : this.props.group.filter;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.group.getGroupList({ params: payload, });
    const { results, page_size, current_page, count, } = res.data;
    if (results.length === 0 && current_page !== 1) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.group.setFilter({
        page_size,
        page: current_page,
        name: payload.name,
        status: payload.status,
      });
      this.setState({
        groupList: results,
        tableLoading: false,
        total: count,
      });
    }
  };

  // @ts-ignore
  private onSearch = async () => {
    this.getDataList({
      page: 1,
      ...this.state.tempFilter,
    });
  };

  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    this.getDataList({
      page: 1,
      ...utils.resetFilter(this.state.tempFilter),
    });
    this.setState({
      tempFilter: {},
    });
  };

  onInputChanged = (field, value) => {
    this.setState((prevState: GroupListState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value,
      },
    }));
  };

  showAddGroupModal = (): void => {
    this.setState({
      isShowAddGroupModal: true,
    });
  };

  hideAddGroupModal = () => {
    this.setState({
      isShowAddGroupModal: false,
    });
  };

  handleAddGroup = () => {
    this.hideAddGroupModal();
    this.getDataList();
  };

  showEditGroupModal = (record?: any): void => {
    this.setState({
      currentGroup: record ? record : null,
      isShowEditGroupModal: true,
    });
  };

  hideEditGroupModal = () => {
    this.setState({
      currentGroup: null,
      isShowEditGroupModal: false,
    });
  };

  handleEditGroup = () => {
    this.hideEditGroupModal();
    this.getDataList();
  };

  goToGroupSymbolList = record => {
    const url = `/dashboard/group/symbol?id=${record.id}`;
    this.props.history.push(url);
  };

  deleteGroup = async (id: string) => {
    const res = await this.$api.group.deleteGroup(id);
    if (res.status === 204) {
      this.getDataList();
    } else {
      this.$msg.error(res.data.message);
    }
  };

  render() {
    const { match, } = this.props;
    const {
      currentGroup,
      isShowAddGroupModal,
      isShowEditGroupModal,
    } = this.state;
    return (
      <div>
        <CommonHeader {...this.props} links={[]} title="客户组管理" />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        <Route
          path={`${match.url}/symbol`}
          render={props => (
            <GroupSymbolList getGroupList={this.getDataList} {...props} />
          )}
        />
        {isShowAddGroupModal && (
          <AddGroupModal
            onOk={this.handleAddGroup}
            onCancel={this.hideAddGroupModal}
          />
        )}
        {isShowEditGroupModal && (
          <EditGroupModal
            group={currentGroup}
            onOk={this.handleEditGroup}
            onCancel={this.hideEditGroupModal}
          />
        )}
      </div>
    );
  }
}
