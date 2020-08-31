import * as React from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import moment from "moment";
import utils from "utils";

const config = self => {
  const defaultWidth = 150;
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      width: defaultWidth,
      fixed: "left",
    },
    {
      title: "手机号",
      dataIndex: "phone",
      width: defaultWidth,
    },
    {
      title: "代理",
      dataIndex: "agent_name",
      width: utils.calcColumnMaxWidth(self.state.transactionList, defaultWidth, "agent_name"),
    },
    {
      title: "明细类型",
      dataIndex: "cause",
      ellipsis: true,
      width: defaultWidth,
    },
    {
      title: "原有余额",
      dataIndex: "before_balance",
      width: defaultWidth,
    },
    {
      title: "变动金额",
      dataIndex: "amount",
      width: defaultWidth,
      render: (text, record) => {
        return text == 0 ? (
          0
        ) : record.in_or_out === 0 ? (
          <span style={{ color: "red", }}>{`-${text}`}</span>
        ) : (
          <span style={{ color: "green", }}>{`+${text}`}</span>
        );
      },
    },
    {
      title: "现有余额",
      dataIndex: "after_balance",
      width: defaultWidth,
    },
    {
      title: "相关订单",
      dataIndex: "order_number",
      width: 200,
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      width: 200,
      render: text => moment(text * 1000).format("YYYY-MM-DD: HH:mm:ss"),
    },
    {
      title: "ip",
      dataIndex: "ip",
      width: defaultWidth,
    },
    {
      title: "备注",
      dataIndex: "remarks",
      ellipsis: true,
      width: 200,
    }
  ];

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.transaction.filter.page,
    pageSize: self.props.transaction.filter.page_size,
    onChange: (current, pageSize) => {
    },
    onShowSizeChange: (current, pageSize) => {
      self.getDataList({
        page_size: pageSize,
        page: current,
        // ...self.state.tempFilter
      });
    },
  };

  return {
    exportExcelBtn: {
      showExportExcelBtn: self.state.exportExcelBtnStatus,
      title: () => (
        // <ReactHTMLTableToExcel
        //   // id="test-table-xls-button"
        //   className="ant-btn ant-btn-primary"
        //   table="table-to-xls"
        //   filename={self.state.excelFileName}
        //   sheet={self.state.excelFileName}
        //   buttonText="导出excel"
        // />
        <div className="ant-btn ant-btn-primary excel-btn" onClick={() => { self.exportExcel(); }}>导出excel</div>
      ),
    },
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
            //width: 150,
            value: self.state.tempFilter.phone || undefined,
            onChange(evt) {
              self.onInputChanged("phone", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          }
        ],
        [
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
          }
        ],
        {
          type: "Input",
          label: "ip",
          placeholder: "请输入ip",
          value: self.state.tempFilter.ip || undefined,
          // width: 150,
          onChange(evt) {
            self.onInputChanged("ip", evt.target.value);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        },
        [
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
              self.onInputChanged("end_time", values[1]);
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
      // ref: self.exportExcel,
      columns,
      dataSource: self.state.transactionList,
      pagination,
      scroll: { x: 7 * 150 + 3 * 200, },
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
