import CommonHeader from "components/CommonHeader";
import EditRoleModal from "./EditRoleModal";
import PermissionEditor from "./PermissionEditor";
import moment from "moment";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { Button, Icon, Table, Popconfirm } from "antd";
import { ColumnProps } from "antd/lib/table";
import { Route } from "react-router-dom";
import { ROUTE_TO_PERMISSION } from "constant";
import "./index.scss";

export interface RoleType {
  id: number;
  name: string;
  managers: number;
  permissions: number[];
  create_time: number;
  can_modify: boolean;
}

interface IRoleState {
  roleList: RoleType[];
  currentRole: RoleType | null;
  isShowEditRoleModal: boolean;
}

/* eslint new-cap: "off" */
@withRoutePermissionGuard("/dashboard/role", {
  exact: false,
  permissionCode: ROUTE_TO_PERMISSION["/dashboard/role"],
})
export default class Role extends BaseReact<{}, IRoleState> {
  state = {
    roleList: [],
    currentRole: null,
    isShowEditRoleModal: false,
  };

  componentDidMount() {
    this.getRoleList();
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/role") {
      this.props.history.replace("/dashboard/role/list");
    }
  }

  getRoleList = async () => {
    const res = await this.$api.role.getRoleList();
    this.setState({
      roleList: res.data.results,
    });
  };

  getTableColumns = (): ColumnProps<RoleType>[] => {
    return [
      {
        key: "name",
        title: "角色名称",
        dataIndex: "name",
      },
      {
        key: "name",
        title: "账户数量",
        dataIndex: "managers",
      },
      {
        key: "create_time",
        title: "创建时间",
        dataIndex: "create_time",
        render: text => moment(text * 1000).format("YYYY-MM-DD"),
      },
      {
        key: "action",
        title: "操作",
        render: (_, record) => {
          if (!record.can_modify) return null;

          return (
            <div className="common-list-table-operation">
              <span onClick={() => this.showEditRoleModal(record)}>编辑</span>
              <span className="common-list-table-operation-spliter" />
              <span onClick={() => this.goToEditor(record.id)}>授权</span>
              <span className="common-list-table-operation-spliter" />
              <Popconfirm
                title="确认删除？"
                onConfirm={() => this.deleteRole(record.id)}
              >
                <span>删除</span>
              </Popconfirm>
            </div>
          );
        },
      }
    ];
  };

  goToEditor = (id: any): void => {
    const url = `/dashboard/role/permission?id=${id}`;
    this.props.history.push(url);
  };

  showEditRoleModal = (role?: RoleType) => {
    if (role) {
      this.setState({
        currentRole: role,
      });
    }

    this.setState({
      isShowEditRoleModal: true,
    });
  };

  hideEditRoleModal = () => {
    this.setState({
      isShowEditRoleModal: false,
      currentRole: null,
    });
  };

  handleUpdateRole = () => {
    this.hideEditRoleModal();
    this.getRoleList();
  };

  deleteRole = async (id: number) => {
    const res = await this.$api.role.deleteRole(id);
    if (res.status === 204) {
      this.getRoleList();
    } else {
      this.$msg.error(res.data.message);
    }
  };

  renderListPage = () => {
    const { currentRole, roleList, isShowEditRoleModal, } = this.state;
    return (
      <>
        <div className="panel-block common-list">
          <section className="common-list-addbtn">
            <Button type="primary" onClick={() => this.showEditRoleModal()}>
              <Icon type="plus" /> 添加
            </Button>
          </section>
          <section className="common-list-table">
            <Table
              rowKey="id"
              columns={this.getTableColumns()}
              childrenColumnName="children"
              dataSource={roleList}
              pagination={false}
            />
          </section>
        </div>
        {isShowEditRoleModal && (
          <EditRoleModal
            role={currentRole}
            onOk={this.handleUpdateRole}
            onCancel={this.hideEditRoleModal}
          />
        )}
      </>
    );
  };

  render() {
    const { match, } = this.props;

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title="角色管理" />
        <Route path={`${match.url}/list`} render={this.renderListPage} />
        <Route
          path={`${match.url}/permission`}
          render={props => (
            <PermissionEditor {...props} getRoleList={this.getRoleList} />
          )}
        />
      </div>
    );
  }
}
