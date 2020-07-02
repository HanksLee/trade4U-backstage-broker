import * as React from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import utils from "utils";
import moment from "moment";
import { Row, Col } from "antd";

const config = self => {
  const getOrder = () => {
    return self.state.status === "open"
      ? self.props.openOrder
      : self.props.closeOrder;
  };

  const columns: any = [
    {
      title: "订单号",
      dataIndex: "order_number",
      width: 200,
      fixed: "left",
      ellipsis: true,
      render: (text, record) => {
        return (
          <a className="link" onClick={() => self.goToOrderDetail(record)}>
            {text}
          </a>
        );
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      width: 150,
      fixed: "left",
    },
    {
      title: "手机号",
      dataIndex: "phone",
      width: 150,
    },
    {
      title: "代理",
      dataIndex: "agent_name",
      width: 120,
    },
    {
      title: "产品名称",
      dataIndex: "symbol_name",
      width: 100,
    },
    {
      title: "产品代码",
      dataIndex: "product_code",
      width: 100,
    },
    {
      title: "开仓价",
      dataIndex: "open_price",
      width: 150,
    },
    {
      title: "平仓价",
      dataIndex: "close_price",
      width: 150,
    },
    {
      title: "交易手数",
      dataIndex: "lots",
      width: 100,
    },
    {
      title: "止盈金额",
      dataIndex: "take_profit",
      width: 100,
    },
    {
      title: "止损金额",
      dataIndex: "stop_loss",
      width: 100,
    },
    {
      title: "库存费",
      dataIndex: "swaps",
      width: 100,
    },
    {
      title: "税费",
      dataIndex: "taxes",
      width: 100,
    },
    {
      title: "手续费",
      dataIndex: "fee",
      width: 100,
    },
    {
      title: "原始盈亏",
      dataIndex: "original_profit",
      width: 100,
    },
    {
      title: "盈亏",
      dataIndex: "profit",
      width: 100,
    },
    {
      title: "开仓原因",
      dataIndex: "open_reason",
      width: 100,
    }
  ];

  if (self.state.status === "open") {
    columns.push({
      title: "创建时间",
      dataIndex: "create_time",
      width: 150,
      render: text => moment(text * 1000).format("YYYY-MM-DD HH:mm:ss"),
    });
  } else {
    columns.push(
      {
        title: "平仓时间",
        dataIndex: "close_time",
        width: 150,
        render: text => moment(text * 1000).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        title: "平仓原因",
        dataIndex: "close_reason",
        width: 100,
      }
    );
  }

  const columnsWidth = columns.reduce(function (total, cur) {
    return total + cur.width;
  }, 0);

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: getOrder().filter.page,
    pageSize: getOrder().filter.page_size,
    onChange: (current, pageSize) => { },
    onShowSizeChange: (current, pageSize) => {
      self.getDataList({
        page_size: pageSize,
        page: current,
      });
    },
  };

  return {
    exportExcelBtn: {
      showExportExcelBtn: self.state.exportExcelBtnStatus,
      title: () => (
        <ReactHTMLTableToExcel
          // id="test-table-xls-button"
          className="ant-btn ant-btn-primary"
          table="table-to-xls"
          filename={self.state.excelFileName}
          sheet={self.state.excelFileName}
          buttonText="导出excel"
        />
      ),
    },
    searcher: {
      widgets: [
        [
          // {
          //   type: "Input",
          //   label: "用户ID",
          //   placeholder: "请输入用户ID",
          //   value: self.state.tempFilter.user || undefined,
          //   onChange(evt) {
          //     self.onInputChanged("user", evt.target.value);
          //   },
          //   onPressEnter(evt) {
          //     self.onSearch();
          //   },
          // },
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
        {
          type: "Input",
          label: "上级姓名",
          placeholder: "请输入上级姓名",
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
          self.state.status === "close"
            ? {
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
            }
            : {
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
      ref: self.exportExcel,
      title: () => {
        const totalData = self.state.totalData;

        return (
          <Row style={{ marginBottom: 10, fontSize: 14, }}>
            <Col span={4}>
              <span style={{ fontWeight: 500, }}>盈亏：</span>
              <span style={{ color: "red", }}>{totalData.profit}</span>
            </Col>
            <Col span={4}>
              <span style={{ fontWeight: 500, }}>交易手数：</span>
              <span style={{ color: "red", }}>{totalData.lots}</span>
            </Col>
            <Col span={4}>
              <span style={{ fontWeight: 500, }}>手续费：</span>
              <span style={{ color: "red", }}>{totalData.fee}</span>
            </Col>
            <Col span={4}>
              <span style={{ fontWeight: 500, }}>库存费：</span>
              <span style={{ color: "red", }}>{totalData.swaps}</span>
            </Col>
            <Col span={4}>
              <span style={{ fontWeight: 500, }}>税费：</span>
              <span style={{ color: "red", }}>{totalData.taxes}</span>
            </Col>
          </Row>
        );
      },
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
