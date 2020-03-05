import utils from "utils";
import * as React from "react";
import { Button, Icon, Popconfirm } from "antd";

const config = self => {
  const columns = [
    {
      title: "用户名",
      dataIndex: "name",
      render: (text, record) => {
        return record.username;
      },
    },
    {
      title: "角色ＩＤ",
      dataIndex: "role_id",
      render: (text, record) => {
        return record.role;
      },
    },
    {
      title: "角色名",
      dataIndex: "role_name",
      render: (text, record) => {
        return record.role_name;
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (text, record) => {
        if (record.status === 1) {
          return "启用";
        } else if (record.status === 0) {
          return "禁用";
        }
      },
    },
    {
      title: "操作",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            <span onClick={() => self.showEditUserModal(record)}>编辑</span>
            <span className="common-list-table-operation-spliter"></span>
            {/* <span onClick={() => self.goToPermissionEditor(record.id)}>
              授权
            </span>
            <span className="common-list-table-operation-spliter"></span>
            <span onClick={() => self.brokerLogin(record.id)}>登录</span>
            <span className="common-list-table-operation-spliter"></span> */}
            <Popconfirm
              title="请问是否确定删除此用户"
              onConfirm={() => self.deleteManager(record.id)}
              onCancel={() => {}}
            >
              <span>删除</span>
            </Popconfirm>
          </div>
        );
      },
    }
  ];
  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.manager.filter.page,
    pageSize: self.props.manager.filter.page_size,
    onChange: (current, pageSize) => {},
    onShowSizeChange: (current, pageSize) => {
      self.getDataList({
        page_size: pageSize,
        page: current,
      });
    },
  };

  return {
    // 是否显示增加按钮
    addBtn: {
      title: () => (
        <Button type="primary" onClick={() => self.showEditUserModal()}>
          <Icon type="plus" /> 添加
        </Button>
      ),
    },
    searcher: {
      hideSearcher: true,
      batchControl: {
        placeholder: "请选择",
        showBatchControl: !utils.isEmpty(self.state.selectedRowKeys),
        options: [
          {
            title: "删除",
            value: "delete",
          }
        ],
        onBatch: value => {
          self.onBatch && self.onBatch(value);
        },
      },

      // widgets: [
      //   [
      //     {
      //       type: "Input",
      //       label: "券商名称",
      //       placeholder: "请输入券商名称",
      //       value: self.state.tempFilter.name || undefined,
      //       onChange(evt) {
      //         self.onInputChanged("name", evt.target.value);
      //       },
      //       onPressEnter(evt) {
      //         self.onSearch();
      //       }
      //     }
      //   ]
      // ],
      onSearch() {
        self.onSearch();
      },
      onReset() {
        self.onReset();
      },
    },
    table: {
      rowKey: "id",
      columns,
      dataSource: self.state.managerList,
      pagination,
      onChange(pagination, filters) {
        const payload: any = {};

        if (!utils.isEmpty(filters)) {
          for (let [key, value] of Object.entries(filters)) {
            payload[key] = value ? value[0] : undefined;
          }
        }

        self.getDataList({
          page_size: pagination.pageSize,
          page: pagination.current,
        });
      },
    },
  };
};

export default config;
