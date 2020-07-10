import utils from "utils";
import * as React from "react";
import { Button, Checkbox, Icon, Popconfirm, Select } from "antd";

const Option = Select.Option;

const config = self => {
  const { selectedRowKeys, } = self.state;

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      self.setState({ selectedRowKeys: selectedRowKeys, });
    },
  };

  const columns = [
    {
      title: "名字",
      width: 150,
      render: (_, record) => {
        return record.last_name + record.first_name;
      },
    },
    {
      title: "手机",
      width: 150,
      dataIndex: "phone",
    },
    {
      title: "代理",
      width: 150,
      dataIndex: "agent_name",
      ellipsis: true, // 必须保留
    },
    {
      title: "邮箱",
      width: 150,
      dataIndex: "email",
    },
    {
      title: "分组",
      width: 150,
      dataIndex: "group_name",
    },
    {
      title: "只读",
      width: 80,
      align: "center",
      dataIndex: "read_only",
      render: (text, record) => {
        const handleChange = e => {
          const title = `确认对「${record.first_name + record.last_name}」${
            e.target.checked ? "启用" : "关闭"
          }只读？`;
          self.updateAccountDetailField(
            record.id,
            "read_only",
            e.target.checked ? 1 : 0,
            title
          );
        };
        return <Checkbox checked={text} onChange={handleChange} />;
      },
    },
    {
      title: "禁用",
      width: 80,
      align: "center",
      dataIndex: "disable_status",
      render: (text, record) => {
        const handleChange = e => {
          const title = `确认对「${record.first_name + record.last_name}」${
            e.target.checked ? "开启" : "关闭"
          }禁用？`;
          self.updateAccountDetailField(
            record.id,
            "disable_status",
            e.target.checked ? 1 : 0,
            title
          );
        };
        return <Checkbox checked={text} onChange={handleChange} />;
      },
    },
    {
      title: "余额",
      width: 150,
      dataIndex: "balance",
      render: (text, record) => {
        const handleClick = () => {
          self.handleChangeBalance(record);
        };
        return (
          <>
            {text} <Icon type="edit" onClick={handleClick} />
          </>
        );
      },
    },
    {
      title: "审核状态",
      width: 150,
      dataIndex: "inspect_status",
      render: (text, record) => {
        const handleChange = value => {
          const title = `确认将「${record.first_name +
            record.last_name}」的审核状态设为${value.label} 吗？`;
          self.updateAccountDetailField(
            record.id,
            "inspect_status",
            value.key,
            title
          );
        };
        return (
          <Select
            labelInValue
            value={{ key: text, }}
            style={{ width: "120px", }}
            onChange={handleChange}
          >
            <Option value={0}>未审核</Option>
            <Option value={1}>待审核</Option>
            <Option value={2}>审核成功</Option>
            <Option value={3}>审核拒绝</Option>
          </Select>
        );
      },
    },
    {
      title: "操作",
      // width: 150,
      fixed: "right",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            {permissions.includes("edit_agent") && (
              <span onClick={e => self.goToEditor(e, record.id)}>编辑</span>
            )}
            <span className="common-list-table-operation-spliter"></span>
            {permissions.includes("jump_agent") && (
              <span onClick={e => self.jumpToAgentAdmin(record.id)}>跳转</span>
            )}
            <span className="common-list-table-operation-spliter"></span>
            {permissions.includes("agent_commission_settings") && (
              <span
                onClick={e => {
                  const url = `/dashboard/agency/agent/rebate-editor?id=${
                    !utils.isEmpty(record) ? record.id : 0
                  }`;
                  self.props.history.push(url);
                }}
              >
                返佣设置
              </span>
            )}
            <span className="common-list-table-operation-spliter"></span>
            {permissions.includes("agent_distribute_customers") && (
              <span
                onClick={e => {
                  self.setState({
                    selectedRowKeys: [record.id],
                    isShowCustomModal: true,
                  });
                }}
              >
                分配客户组
              </span>
            )}
            <span className="common-list-table-operation-spliter"></span>
            {permissions.includes("agent_transfer") && (
              <span
                onClick={e => {
                  self.setState({
                    isShowAgentModal: true,
                    currentAgent: record,
                  });
                }}
              >
                移交划转
              </span>
            )}
            <span className="common-list-table-operation-spliter"></span>
            {permissions.includes("delete_agent") && (
              <Popconfirm
                title="请问是否确定删除代理商"
                onConfirm={() => self.deleteAccount(record.id)}
                onCancel={() => { }}
              >
                <span>删除</span>
              </Popconfirm>
            )}
          </div>
        );
      },
    }
  ];

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.agency.filterAgent.page,
    pageSize: self.props.agency.filterAgent.page_size,
    onChange: (current, pageSize) => { },
    onShowSizeChange: (current, pageSize) => {
      self.getDataList({
        page_size: pageSize,
        page: current,
      });
    },
  };

  const permissions = self.props.common.permissions;

  return {
    // 是否显示增加按钮
    addBtn: {
      title: () => {
        return permissions.includes("add_agent") ? (
          <Button type="primary" onClick={() => self.goToEditor()}>
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
            title: "划转客户组",
            value: "custom_group",
          }
        ],
        onBatch: value => {
          self.onBatch(value);
        },
      },
      widgets: [
        [
          {
            type: "Input",
            label: "用户名",
            placeholder: "请输入用户名",
            value: self.state.tempFilterAgent.username || undefined,
            onChange(evt) {
              self.onInputChanged("username", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: "Input",
            label: "手机",
            placeholder: "请输入手机号",
            value: self.state.tempFilterAgent.phone || undefined,
            onChange(evt) {
              self.onInputChanged("phone", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          }
        ],
        {
          type: "Input",
          label: "代理姓名",
          placeholder: "请输入代理姓名",
          value: self.state.tempFilterAgent.agent_name || undefined,
          onChange(evt) {
            self.onInputChanged("agent_name", evt.target.value);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        },
        {
          type: "RangePicker",
          label: "创建时间",
          placeholders: ["开始时间", "结束时间"],
          format: ["YYYY-MM-DD", "YYYY-MM-DD"],
          value: [
            self.state.tempFilterAgent.start_time,
            self.state.tempFilterAgent.end_time
          ],
          onChange(values) {
            self.onInputChanged("start_time", values[0]);
            self.onInputChanged("end_time", values[1]);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        }
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
      rowSelection,
      columns,
      dataSource: self.state.accountList,
      pagination,
      scroll: { x: 9 * 150, },
      onChange(pagination, filterAgents) {
        const payload: any = {};

        if (!utils.isEmpty(filterAgents)) {
          for (let [key, value] of Object.entries(filterAgents)) {
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
