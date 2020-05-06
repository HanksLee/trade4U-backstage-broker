import utils from 'utils';
import * as React from 'react';

const config = self => {
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      render: (text) => {
        return <a className="link" onClick={() => self.pushAgencyStack(text)}>{text}</a>;
      },
    },
    {
      title: "手机号",
      dataIndex: 'phone',
    },
    {
      title: '下级代理数量',
      dataIndex: 'account_count',
    },
    {
      title: '上级代理数量',
      dataIndex: 'agent_count',
    },
    {
      title: '入金',
      dataIndex: 'deposit',
    },
    {
      title: '出金',
      dataIndex: 'net_withdraw',
    },
    {
      title: '净入金',
      dataIndex: 'net_deposit',
    },
    {
      title: '盈利笔数',
      dataIndex: 'profitable_order',
    },
    {
      title: '亏损笔数',
      dataIndex: 'loss_order',
    },
    {
      title: "手续费",
      dataIndex: "fee",
    },
    {
      title: '库存费',
      dataIndex: 'swaps',
    },
    {
      title: '盈亏',
      dataIndex: 'profit',
    },
    {
      title: '已返佣金',
      dataIndex: 'commission',
    },
    {
      title: '总佣金',
      dataIndex: 'total_commission',
    },
    {
      title: '已提款佣金',
      dataIndex: 'net_withdraw_commission',
    }
  ];

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.agencyReport.filter.page,
    pageSize: self.props.agencyReport.filter.page_size,
    onChange: (current, pageSize) => { },
    onShowSizeChange: (current, pageSize) => {
      self.getDataList({
        page_size: pageSize,
        page: current,
      });
    },
  };

  return {
    searcher: {
      widgets: [
        [{
          type: 'Input',
          label: '用户名',
          placeholder: '请输入用户名',
          value: self.state.tempFilter.username || undefined,
          width: 150,
          onChange(evt) {
            self.onInputChanged('username', evt.target.value);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        },
        {
          type: 'Input',
          label: '手机',
          placeholder: '请输入手机',
          width: 150,
          value: self.state.tempFilter.phone || undefined,
          onChange(evt) {
            self.onInputChanged('phone', evt.target.value);
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
      dataSource: self.state.dataList,
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