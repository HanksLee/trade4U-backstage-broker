import * as React from "react";
import utils from "utils";
import moment from "moment";

const config = self => {
  const getOrder = () => {
    return self.state.status === 'open' ? self.props.openOrder : self.props.closeOrder;
  };

  const columns: any = [
    {
      title: '产品名称',
      dataIndex: 'symbol_name',
      render: (text, record) => {
        return <a className="link" onClick={() => self.goToOrderDetail(record)}>{text}</a>;
      },
    },
    {
      title: '产品代码',
      dataIndex: 'symbol',
    },
    {
      title: '开仓价',
      dataIndex: 'open_price',
    },
    {
      title: '平仓价',
      dataIndex: 'close_price',
    },
    {
      title: '交易手数',
      dataIndex: 'lots',
    },
    {
      title: '订单号',
      dataIndex: 'order_number',
    },
    {
      title: '库存费',
      dataIndex: 'swaps',
    },
    {
      title: '税费',
      dataIndex: 'taxes',
    },
    {
      title: '手续费',
      dataIndex: 'swaps',
    },
    {
      title: '盈亏',
      dataIndex: 'profit',
    }
  ];

  if (self.state.status === 'open') {
    columns.push({
      title: '创建时间',
      dataIndex: 'create_time',
      render: (text) => moment(text * 1000).format('YYYY-MM-DD hh:mm:ss'),
    });
  } else {
    columns.push({
      title: '平仓时间',
      dataIndex: 'close_time',
      render: (text) => moment(text * 1000).format('YYYY-MM-DD hh:mm:ss'),
    }, {
      title: '平仓原因',
      dataIndex: 'close_reason',
    });
  }

  const columnsWidth = columns.reduce(function(total, cur) {
    return total + cur.width;
  }, 0);

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: getOrder().filter.page,
    pageSize: getOrder().filter.page_size,
    onChange: (current, pageSize) => {},
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
            label: "用户ID",
            placeholder: "请输入用户ID",
            value: self.state.tempFilter.user || undefined,
            onChange(evt) {
              self.onInputChanged("user", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: "Input",
            label: "手机号",
            width: 100,
            placeholder: "请输入手机号",
            value: self.state.tempFilter.phone || undefined,
            onChange(evt) {
              self.onInputChanged("phone", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: "Input",
            label: "用户名",
            width: 100,
            placeholder: "请输入用户名",
            value: self.state.tempFilter.username || undefined,
            onChange(evt) {
              self.onInputChanged("username", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          }
        ],
        [
          {
            type: "Input",
            label: "订单号",
            placeholder: "请输入订单号",
            value: self.state.tempFilter.order_number || undefined,
            onChange(evt) {
              self.onInputChanged("order_number", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: "Input",
            label: "交易产品名",
            width: 100,
            placeholder: "请输入交易产品名",
            value: self.state.tempFilter.symbol_name || undefined,
            onChange(evt) {
              self.onInputChanged("symbol_name", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: "Input",
            label: "交易产品代号",
            width: 100,
            placeholder: "请输入交易产品代号",
            value: self.state.tempFilter.product_code || undefined,
            onChange(evt) {
              self.onInputChanged("product_code", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          }
        ],
        [
          self.state.status === 'close' ?
            {
              type: "RangePicker",
              label: "平仓时间",
              placeholder: ["平仓起始时间", "平仓截止时间"],
              format: ["YYYY-MM-DD", "YYYY-MM-DD"],
              value: [
                self.state.tempFilter.close_start_time,
                self.state.tempFilter.close_end_time
              ],
              onChange(values) {
                self.onInputChanged("close_start_time", values[0]);
                self.onInputChanged("close_end_time", values[1]);
              },
              onPressEnter(evt) {
                self.onSearch();
              },
            } : {
              type: "RangePicker",
              label: "创建时间",
              placeholder: ["创建起始时间", "创建截止时间"],
              format: ["YYYY-MM-DD", "YYYY-MM-DD"],
              value: [
                self.state.tempFilter.create_start_time,
                self.state.tempFilter.create_end_time
              ],
              onChange(values) {
                self.onInputChanged("create_start_time", values[0]);
                self.onInputChanged("create_end_time", values[1]);
              },
              onPressEnter(evt) {
                self.onSearch();
              },
            }
        ]
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
      scroll: { x: columnsWidth, },
      bordered: true,
      columns,
      dataSource: self.state.orderList,
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
