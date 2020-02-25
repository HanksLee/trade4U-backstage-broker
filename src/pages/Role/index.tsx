import CommonHeader from "components/CommonHeader";
import EditRoleModal from "./EditRoleModal";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { Button, Icon, Table, Popconfirm } from "antd";
import { ColumnProps } from "antd/lib/table";
import "./index.scss";

export interface RoleType {
  id: number;
  name: string;
  managers: number;
  permissions: number[];
  create_time: number;
}

interface IRoleState {
  roleList: RoleType[];
  currentRole: RoleType | null;
  isShowEditRoleModal: boolean;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/role", { exact: false, permissionCode: 'xixix', })
export default class Role extends BaseReact<{}, IRoleState> {
  state = {
    roleList: [],
    currentRole: null,
    isShowEditRoleModal: false,
  };

  componentDidMount() {
    this.getRoleList();
  }
  
  getRoleList = async () => {
    const res = await this.$api.role.getRoleList();
    this.setState({
      roleList: res.data.results,
    });
  }

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
      },
      {
        key: "action",
        title: "操作",
        render: (_, record) => {
          return (
            <div className="common-list-table-operation">
              <span onClick={() => this.showEditRoleModal(record)}>编辑</span>
              <span className="common-list-table-operation-spliter" />
              <span onClick={() => this.goToEditor(record.id)}>分配权限</span>
              <span className="common-list-table-operation-spliter" />
              <Popconfirm title="确认删除？" onConfirm={() => this.deleteRole(record.id)}>
                <span>删除</span>
              </Popconfirm>
            </div>
          );
        },
      }
    ];
  };

  goToEditor = (id: any): void => {
    const url = `/dashboard/role/editor?id=${id}`;
    this.props.history.push(url);
  }

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

  render() {
    const { currentRole, roleList, isShowEditRoleModal, } = this.state;

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title="角色管理" />
        <div className="panel-block common-list">
          <section className='common-list-addbtn'>
            <Button type="primary" onClick={() => this.showEditRoleModal()}>
              <Icon type="plus" /> 添加
            </Button>
          </section>
          <section className='common-list-table'>
            <Table
              rowKey="id"
              columns={this.getTableColumns()}
              childrenColumnName="children"
              dataSource={roleList}
              pagination={false}
            />
          </section>
        </div>
        {
          isShowEditRoleModal  && (
            <EditRoleModal
              role={currentRole}
              onOk={this.handleUpdateRole}
              onCancel={this.hideEditRoleModal}
            />
          )
        }
      </div>
    );
  }
}
