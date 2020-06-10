import utils from "utils";
import * as React from "react";

const config = self => {
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      width: 150,
      fixed: "left",
      ellipsis: true,
      render: (text, record) => {
        if (record.account_count > 0 || record.agent_count > 0) {
          return (
            <a className="link" onClick={() => self.pushAgencyStack(text)}>
              {text}
            </a>
          );
        } else {
          return <span>{text}</span>;
        }
      }
    },
    {
      title: "手机号",
      dataIndex: "phone",
      width: 150
    },
    {
      title: "下级客户数",
      dataIndex: "account_count",
      width: 150
    },
    {
      title: "下级代理数",
      dataIndex: "agent_count",
      width: 150
    },
    {
      title: "入金",
      dataIndex: "deposit",
      width: 200
    },
    {
      title: "出金",
      dataIndex: "net_withdraw",
      width: 200
    },
    {
      title: "净入金",
      dataIndex: "net_deposit",
      width: 200
    },
    // {
    //   title: '盈利笔数',
    //   dataIndex: 'profitable_order',
    // },
    // {
    //   title: '亏损笔数',
    //   dataIndex: 'loss_order',
    // },
    ...self.state.commissionRuleColumns,
    {
      title: "手续费",
      dataIndex: "fee",
      width: 150
    },
    {
      title: "库存费",
      dataIndex: "swaps",
      width: 150
    },
    {
      title: "盈亏",
      dataIndex: "profit",
      width: 200
    },
    {
      title: "已返佣金",
      dataIndex: "commission",
      width: 200
    },
    {
      title: "总佣金",
      dataIndex: "total_commission",
      width: 200
    },
    {
      title: "已提款佣金",
      dataIndex: "net_withdraw_commission",
      width: 200
    }
  ];

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.agencyReport.filter.page,
    pageSize: self.props.agencyReport.filter.page_size,
    onChange: (current, pageSize) => {},
    onShowSizeChange: (current, pageSize) => {
      self.getDataList({
        page_size: pageSize,
        page: current
      });
    }
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
            width: 150,
            onChange(evt) {
              self.onInputChanged("username", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            }
          },
          {
            type: "Input",
            label: "手机",
            placeholder: "请输入手机",
            width: 150,
            value: self.state.tempFilter.phone || undefined,
            onChange(evt) {
              self.onInputChanged("phone", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            }
          }
        ]
      ],
      onSearch() {
        self.onSearch();
      },
      onReset() {
        self.onReset();
      }
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
          page: pagination.current
        });
      }
    }
  };
};

export default config;
