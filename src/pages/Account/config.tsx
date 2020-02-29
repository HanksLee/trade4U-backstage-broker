import utils from "utils";
import * as React from "react";
import { Button, Checkbox, Icon, Popconfirm, Select } from "antd";

const Option = Select.Option;

const config = self => {
  const columns = [
    {
      title: "名字",
      width: 150,
      render: (_, record) => {
        return record.first_name + record.last_name;
      },
    },
    {
      title: "手机",
      width: 150,
      dataIndex: 'phone',
    },
    {
      title: "代理",
      width: 150,
      dataIndex: 'agent',
    },
    {
      title: "生日",
      width: 150,
      dataIndex: 'birth',
    },
    {
      title: "电话",
      width: 150,
      dataIndex: 'mobile',
    },
    {
      title: "国籍",
      dataIndex: 'nationality_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: "居住国",
      dataIndex: 'country_of_residence_name',
      width: 150,
      ellipsis: true,
    },
    {
      title: "城市",
      dataIndex: 'city',
      width: 150,
      ellipsis: true,
    },
    {
      title: "街道",
      dataIndex: 'street',
      width: 150,
      ellipsis: true,
    },
    {
      title: "邮编",
      width: 150,
      dataIndex: 'postal',
    },
    {
      title: "邮箱",
      width: 150,
      dataIndex: 'email',
    },
    {
      title: "客户组",
      width: 150,
      dataIndex: 'group_name',
    },
    {
      title: "余额",
      width: 150,
      dataIndex: 'balance',
      render: (text, record) => {
        const handleClick = () => {
          self.handleChangeBalance(record);
        };
        return <>{text} <Icon type="edit" onClick={handleClick} /></>;
      },
    },
    {
      title: "是否只读",
      width: 100,
      align: 'center',
      dataIndex: 'read_only',
      render: (text, record) => {
        const handleChange = (e) => {
          const title = `确认将「${record.first_name + record.last_name}」设为${ text ? '可读' : '不可读'} 吗？`;
          self.updateAccountDetailField(record.id, 'read_only', e.target.checked ? 1 : 0, title);
        };
        return <Checkbox checked={text} onChange={handleChange} />;
      },
    },
    {
      title: "是否禁用",
      width: 100,
      align: 'center',
      dataIndex: 'disable_status',
      render: (text, record) => {
        const handleChange = (e) => {
          const title = `确认将「${record.first_name + record.last_name}」设为${ text ? '禁用' : '不禁用'} 吗？`;
          self.updateAccountDetailField(record.id, 'disable_status', e.target.checked ? 1 : 0, title);
        };
        return <Checkbox checked={text} onChange={handleChange} />;
      },
    },
    {
      title: "审核状态",
      width: 150,
      dataIndex: 'inspect_status',
      render: (text, record) => {
        const handleChange = (value) => {
          const title = `确认将「${record.first_name + record.last_name}」的审核状态设为${value.label} 吗？`;
          self.updateAccountDetailField(record.id, 'inspect_status', value.key, title);
        };
        return (
          <Select labelInValue value={{ key: text, }} style={{ width: '120px', }} onChange={handleChange}>
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
      width: 150,
      fixed: 'right',
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            <span onClick={() => self.goToEditor(record.id)}>编辑</span>
            <span className="common-list-table-operation-spliter"></span>
            <span onClick={() => self.viewDetail(record)}>详情</span>
            <span className="common-list-table-operation-spliter"></span>
            <Popconfirm
              title="请问是否确定删除客户"
              onConfirm={() => self.deleteAccount(record.id)}
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
          label: '用户名',
          placeholder: '请输入用户名',
          value: self.state.tempFilter.username || undefined,
          width: '120px',
          onChange(evt) {
            self.onInputChanged('username', evt.target.value);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        }, {
          type: 'RangePicker',
          label: '创建时间',
          placeholders: ['开始时间', '结束时间'],
          format: ['YYYY-MM-DD', 'YYYY-MM-DD'],
          value: [self.state.tempFilter.start_time, self.state.tempFilter.end_time],
          onChange(values) {
            self.onInputChanged('start_time', values[0]);
            self.onInputChanged('end_time', values[1]);
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
      dataSource: self.state.accountList,
      pagination,
      scroll: { x: 12 * 150 + 2 * 200, },
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
