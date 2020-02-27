import utils from "utils";
import * as React from "react";
import { Button, Icon, Popconfirm } from "antd";

const config = self => {
  const columns = [
    {
      title: "券商名称",
      dataIndex: "name",
    },
    {
      title: "域名",
      dataIndex: 'domain',
      ellipsis: true,
      render: (text) => {
        return <a href={text} target="_blank">{text}</a> || '--';
      },
    },
    {
      title: '后台角标',
      dataIndex: 'background_corner',
      render: (text) => {
        return <div className="upload-image-preview" style={{ backgroundImage: `url(${text})`, }} />;
      },
    },
    {
      title: 'logo',
      dataIndex: 'logo',
      render: (text) => {
        return <div className="upload-image-preview" style={{ backgroundImage: `url(${text})`, }} />;
      },
    },
    {
      title: "操作",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            <span onClick={() => self.goToEditor(record.id)}>编辑</span>
            <span className="common-list-table-operation-spliter"></span>
            <span onClick={() => self.goToPermissionEditor(record.id)}>授权</span>
            <span className="common-list-table-operation-spliter"></span>
            <span onClick={() => self.brokerLogin(record.id)}>登录</span>
            <span className="common-list-table-operation-spliter"></span>
            <Popconfirm
              title="请问是否确定删除券商"
              onConfirm={() => this.deleteBroker(record.id)}
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
    current: self.props.broker.filter.page,
    pageSize: self.props.broker.filter.page_size,
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
        <Button type="primary" onClick={() => self.goToEditor()}>
          <Icon type="plus" /> 添加
        </Button>
      ),
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
          self.onBatch && self.onBatch(value);
        },
      },
      widgets: [
        [{
          type: 'Input',
          label: '券商名称',
          placeholder: '请输入券商名称',
          value: self.state.tempFilter.name || undefined,
          onChange(evt) {
            self.onInputChanged('name', evt.target.value);
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
      dataSource: self.state.brokerList,
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
