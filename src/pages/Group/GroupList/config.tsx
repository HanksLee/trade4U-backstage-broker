import * as React from "react";
import { Button, Icon, Popconfirm } from "antd";
import utils from "utils";

const config = self => {
  const permissions = self.props.common.permissions;
  const columns = [
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: text => text ? '启用' : '禁用',
    },
    {
      title: "预警线(百分比)",
      dataIndex: 'margin_call',
    },
    {
      title: "强平线(百分比)",
      dataIndex: 'stop_out_level',
    },
    {
      title: "操作",
      render: (_, record) => {
        return (
          <div className="common-list-table-operation">
            {
              permissions.indexOf('change_group') !== -1 && (
                <>
                  <span onClick={() => self.showEditGroupModal(record)}>编辑</span>
                  <span className="common-list-table-operation-spliter"></span>
                </>
              )
            }
            {
              permissions.indexOf('view_group_symbol_type') !== -1 && (
                <span onClick={() => self.goToGroupSymbolList(record)}>交易品种编辑</span>
              )
            }
            {
              permissions.indexOf('delete_group') !== -1 && record.is_default !== 1 && (
                <>
                  <span className="common-list-table-operation-spliter"></span>
                  <Popconfirm
                    title="请问是否确定删除客户组"
                    onConfirm={() => self.deleteGroup(record.id)}
                  >
                    <span>删除</span>
                  </Popconfirm>
                </>
              )
            }
          </div>
        );
      },
    }
  ];

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.group.filter.page,
    pageSize: self.props.group.filter.page_size,
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
      title: () => {
        return permissions.indexOf('create_group') !== -1 ? (
          <Button type="primary" onClick={() => self.showAddGroupModal()}>
            <Icon type="plus" /> 添加
          </Button>
        ) : null;
      },
    },
    searcher: {
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
          self.onBatch(value);
        },
      },
      widgets: [
        [{
          type: 'Input',
          label: '客户组名称',
          labelWidth: 85,
          placeholder: '请输入客户组名称',
          value: self.state.tempFilter.name || undefined,
          onChange(evt) {
            self.onInputChanged('name', evt.target.value);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        }, {
          type: 'Select',
          label: '状态',
          labelWidth: 45,
          placeholder: '请选择状态',
          option: {
            key: 'id',
            value: 'id',
            title: 'name',
            data: [{ id: 1, name: '启用', }, { id: 0, name: '禁用', }],
          },
          value: self.state.tempFilter.status !== undefined ? self.state.tempFilter.status : undefined,
          width: '120px',
          onChange(value) {
            self.onInputChanged('status', value);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        }]
      ],
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
      dataSource: self.state.groupList,
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
