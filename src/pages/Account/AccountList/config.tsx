import utils from "utils";
import * as React from "react";
import { Button, Checkbox, Icon, Popconfirm, Select } from "antd";
import moment from "moment";
import { FORMAT_TIME } from "constant";

const Option = Select.Option;
const calcMaxWidth = (list: any, defaultWidth: number, column: string)=>{
  const fontSize = 14;
  const paddingSize = 16;
  if(list.length === 0) {
    return `${defaultWidth}`;
  }
  const sortList = list.sort((a, b)=>{
    const aCol: string = a[column];
    const bCol: string = b[column];

    return (aCol.length - bCol.length) * -1;
  });
  const maxLength: number = sortList[0][column].length;
  const maxWidth = fontSize * maxLength + paddingSize * 2;
  const ret = maxWidth < defaultWidth ? defaultWidth : maxWidth;
  return `${ret}px`;
};
const config = self => {
  const { selectedRowKeys, accountList, } = self.state;
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      self.setState({ selectedRowKeys: selectedRowKeys, });
    },
  };
  const permissions = self.props.common.permissions;
 
  let columns: any = [
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
      width:  calcMaxWidth(accountList, 150, "agent_name"),
      dataIndex: "agent_name",
      ellipsis: true, // 必须保留
    },
    {
      title: "邮箱",
      width: 200,
      dataIndex: "email",
    },
    {
      title: "客户组",
      width: 150,
      dataIndex: "group_name",
    }
  ];

  if (permissions.indexOf("change_account") !== -1) {
    columns.push({
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
        return (
          <Checkbox
            disabled={permissions.indexOf("change_account") === -1}
            checked={text}
            onChange={handleChange}
          />
        );
      },
    });
  }

  if (permissions.indexOf("change_account") !== -1) {
    columns.push({
      title: "禁用",
      width: 80,
      align: "center",
      dataIndex: "disable_status",
      render: (text, record) => {
        const handleChange = e => {
          const title = `确认对「${record.last_name + record.first_name}」${
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
    });
  }

  const columns2: any = [
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
            {text}
            {permissions.indexOf("change_account_balance") !== -1 && (
              <Icon type="edit" onClick={handleClick} />
            )}
          </>
        );
      },
    },
    {
      title: "审核状态",
      width: 150,
      dataIndex: "inspect_status",
      render: (text, record) => {
        const handleChange = (value: { label: any; key: any }) => {
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
            disabled={permissions.indexOf("change_account") === -1}
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
      title: "审核人",
      width: 120,
      dataIndex: "inspect_person_name",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "审核时间",
      width: 200,
      dataIndex: "inspect_time",
      render: (text, record) => {
        return  utils.timestampFormatDate(text , FORMAT_TIME);
      },
    },
    {
      title: "开户时间",
      width: 200,
      dataIndex: "create_time",
      render: (text, record) => {
        return  utils.timestampFormatDate(text , FORMAT_TIME);
      },
    },
    {
      title: "审核原因",
      width: 200,
      dataIndex: "reason",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "操作",
      width: 280,
      fixed: "right",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            {permissions.indexOf("change_account") !== -1 && (
              <>
                <a onClick={e => self.goToEditor(e, record.id)}>编辑</a>
                <span className="common-list-table-operation-spliter"></span>
              </>
            )}
            {permissions.indexOf("view_account") !== -1 && (
              <>
                <a onClick={e => self.viewDetail(e, record)}>详情</a>
                <span className="common-list-table-operation-spliter"></span>
              </>
            )}
            {permissions.indexOf("change_migrate_account") !== -1 && (
              <>
                <a onClick={e => self.handleTransferAgent(e, record)}>
                  划转代理
                </a>
                <span className="common-list-table-operation-spliter"></span>
              </>
            )}
            {permissions.indexOf("change_account_pwd") !== -1 && (
              <>
                <a onClick={e => self.handleResetPassword(e, record)}>
                  修改密码
                </a>
                <span className="common-list-table-operation-spliter"></span>
              </>
            )}
            {permissions.indexOf("delete_account") !== -1 && (
              <Popconfirm
                title="请问是否确定删除客户"
                onConfirm={() => self.deleteAccount(record.id)}
                onCancel={() => {}}
              >
                <a>删除</a>
              </Popconfirm>
            )}
          </div>
        );
      },
    }
  ];

  columns = columns.concat(columns2);

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.account.filter.page,
    pageSize: self.props.account.filter.page_size,
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
        return permissions.indexOf("add_account") !== -1 ? (
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
            value: "group",
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
            value: self.state.tempFilter.username || undefined,
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
            value: self.state.tempFilter.phone || undefined,
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
          value: self.state.tempFilter.agent_name || undefined,
          onChange(evt) {
            self.onInputChanged("agent_name", evt.target.value);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        },
        [
          {
            type: "Select",
            label: "审核状态",
            placeholder: "请选择审核状态",
            // width: 200,
            value: self.state.tempFilter.inspect_status,
            option: {
              key: "id",
              value: "id",
              title: "name",
              data: [
                {
                  id: 0,
                  name: "未审核",
                },
                {
                  id: 1,
                  name: "待审核",
                },
                {
                  id: 2,
                  name: "审核成功",
                },
                {
                  id: 3,
                  name: "审核不通过",
                }
              ],
            },
            onChange(val, elem) {
              self.onOptionSelect("inspect_status", val, elem);
            },
            onSelect(val, elem) {},
            onBlur() {},
          }
        ],
        {
          type: "RangePicker",
          label: "创建时间",
          placeholders: ["开始时间", "结束时间"],
          format: ["YYYY-MM-DD", "YYYY-MM-DD"],
          value: [
            self.state.tempFilter.start_time,
            self.state.tempFilter.end_time
          ],
          onChange(values) {
            self.onInputChanged("start_time", values[0]);
            if (values[1]) {
              self.onInputChanged("end_time", values[1]);
            }
          },
          onPressEnter(evt) {
            self.onSearch();
          },
          disabledDate(current) {
            return self.disabledDate(current);
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
