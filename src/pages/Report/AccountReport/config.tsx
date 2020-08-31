import utils from "utils";
import * as React from "react";

const config = self => {
  const defaultWidth = 150;
  const columns = [
    {
      title: "用户名",
      width:defaultWidth, 
      dataIndex: "username",
      fixed: "left",
    },
    {
      title: "手机号",
      width:defaultWidth,
      dataIndex: "phone",
    },
    {
      title: "代理",
      width: utils.calcColumnMaxWidth(self.state.dataList, defaultWidth, "agent_name"),
      dataIndex: "agent_name",
    },
    {
      title: "入金",
      width:defaultWidth,
      dataIndex: "deposit",
    },
    {
      title: "出金",
      width:defaultWidth,
      dataIndex: "net_withdraw",
    },
    {
      title: "净入金",
      width:defaultWidth,
      dataIndex: "net_deposit",
    },
    // {
    //   title: "盈利笔数",
    //   dataIndex: "profitable_order"
    // },
    // {
    //   title: "亏损笔数",
    //   dataIndex: "loss_order"
    // },
    ...self.state.commissionRuleColumns,
    {
      title: "手续费",
      width:defaultWidth,
      dataIndex: "fee",
    },
    {
      title: "库存费",
      width:defaultWidth,
      dataIndex: "swaps",
    },
    {
      title: "盈亏",
      width:defaultWidth,
      dataIndex: "profit",
    },
    {
      title: "净值",
      width:defaultWidth,
      dataIndex: "equity",
    }
  ];

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.accountReport.filter.page,
    pageSize: self.props.accountReport.filter.page_size,
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
        [
          {
            type: "Input",
            label: "用户名",
            placeholder: "请输入用户名",
            value: self.state.tempFilter.username || undefined,
            //width: 150,
            onChange(evt) {
              self.onInputChanged("username", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: "Input",
            label: "手机号",
            placeholder: "请输入手机号",
            //width: 350,
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
      scroll:{ x:'max-content', },
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
