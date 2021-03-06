import * as React from "react";
import { Button, Icon, Popconfirm, Row, Col } from "antd";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import utils from "utils";
import StatusText from "components/StatusText";
import moment from "moment";
import { FORMAT_TIME } from "constant";

const config = self => {
  const { selectedRowKeys, } = self.state;
  const permissions = self.props.common.permissions;
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      self.setState({ selectedRowKeys: selectedRowKeys, });
    },
  };

  const columns = [
    {
      title: "用户名",
      width: 100,
      dataIndex: "user_display",
      render: (text, record) => {
        return (text && text.username) || "--";
      },
      fixed: "left",
    },
    {
      title: "手机号",
      width: 150,
      render: (text, record) => record.user_display.phone || "--",
    },
    {
      title: "省份",
      width: 100,
      dataIndex: "province",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "城市",
      width: 100,
      dataIndex: "city",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "银行卡号",
      width: 160,
      dataIndex: "card_number",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "开户行",
      width: 160,
      dataIndex: "bank",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "支行名称",
      width: 140,
      dataIndex: "sub_branch",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "申请时间",
      width: 200,
      dataIndex: "create_time",
      render: (text, record) => {
        return utils.timestampFormatDate(text, FORMAT_TIME);
      },
    },
    {
      title: `预计出金(${self.state.platform_currency})`,
      width: 140,
      dataIndex: "expect_amount",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: `实际出金(${self.state.withdraw_currency})`,
      width: 140,
      dataIndex: "actual_amount",
      render: (text, record) => {
        return text || "--";
      },
    },
    { //parseInt(agent_name_width)==140?140:agent_name_width
      title: "代理姓名",
      width: parseInt(utils.calcColumnMaxWidth(self.props.finance.withdrawList, 140, "agent_name")) == 140 
        ? 140 
        : utils.calcColumnMaxWidth(self.props.finance.withdrawList, 140, "agent_name"),
      dataIndex: "agent_name",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "审核状态",
      width: 120,
      dataIndex: "review_status",
      ellipsis: true,

      render: (text, record) => {
        const statusType = {
          2: "hot",
          1: "normal",
          0: "block",
        };
        const statusText = {
          2: "审核不通过",
          1: "审核成功",
          0: "待审核",
        };
        const styleMap = {
          2: {
            color: "red",
          },
          1: {
            color: "#1890ff",
          },
          0: {
            color: "",
          },
        };

        return (
          <StatusText
            type={statusType[record.review_status]}
            text={
              <span style={styleMap[record.review_status]}>
                {statusText[record.review_status]}
              </span>
            }
          />
        );
      },
    },
    {
      title: "审核时间",
      width: 140,
      dataIndex: "review_time",
      render: (text, record) => {
        return utils.timestampFormatDate(text, FORMAT_TIME);
      },
    },
    {
      title: "审核人",
      width: 110,
      dataIndex: "reviewer",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "划款状态",
      width: 120,
      dataIndex: "remit_status",
      render: (text, record) => {
        const statusType = {
          2: "hot",
          1: "normal",
          0: "block",
        };
        const statusText = {
          2: "划款失败",
          1: "划款成功",
          0: "待划款",
        };

        const styleMap = {
          2: {
            color: "red",
          },
          1: {
            color: "#1890ff",
          },
          0: {
            color: "",
          },
        };

        return (
          <StatusText
            type={statusType[record.remit_status]}
            text={
              <span style={styleMap[record.remit_status]}>
                {statusText[record.remit_status]}
              </span>
            }
          />
        );
      },
    },
    {
      title: "划款人",
      width: 100,
      dataIndex: "remitter",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "划款单号",
      width: 220,
      dataIndex: "remit_number",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "划款时间",
      width: 200,
      dataIndex: "remit_time",
      render: (text, record) => {
        return utils.timestampFormatDate(text, FORMAT_TIME);
      },
    },
    {
      // width: 120,
      title: "操作",
      width: 260,
      fixed: "right",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            {permissions.includes("withdraw_record") && (
              <span
                onClick={() => {
                  self.props.finance.getCurrentWithdraw(record.id);
                  self.props.finance.setInitWithdrawStatus(record.remit_status);
                  self.toggleWithdrawModal();
                }}
              >
                划款登记
              </span>
            )}

            <span className="common-list-table-operation-spliter"></span>
            {permissions.includes("delete_withdraw") && (
              <Popconfirm
                title="请问是否确定删除当前记录"
                onConfirm={async () => {
                  const res = await self.$api.finance.deleteWithdraw(record.id);

                  if (res.status === 204) {
                    self.getDataList(self.props.filterWithdraw);
                  } else {
                    self.$msg.error(res.data.message);
                  }
                }}
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

  const columnsWidth = columns.reduce(function (total, cur) {
    return total + cur.width;
  }, 0);

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.props.finance.withdrawListMeta.total,
    current: self.state.currentPage,
    onChange: (current, pageSize) => { },
    onShowSizeChange: (current, pageSize) => {
      // @todo 调用获取表接口
      self.resetPagination(pageSize, current);
    },
  };

  return {
    // 是否显示增加按钮
    // addBtn: {
    //   title: () => (
    //     <Button
    //       // style={{ display: "none", }}
    //       type="primary"
    //       onClick={() => {
    //         self.props.finance.setCurrentWithdraw({});
    //         self.toggleWithdrawModal();
    //       }}
    //     >
    //       <Icon type="plus" />
    //       添加
    //     </Button>
    //   )
    // },
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
    // tableHeader: () => {
    //   const {
    //     total_amount
    //   } = self.props.finance.withdrawListMeta;

    //   return <Row style={{marginBottom: 10, fontSize: 14}}>
    //     <Col span={2}>
    //       <span>预计总入金：</span>
    //       <span style={{color: '#1890ff'}}>{total_amount && total_amount.expect_total_amount}</span>
    //     </Col>
    //     <Col span={2}>
    //       <span>实际总入金：</span>
    //       <span style={{color: '#1890ff'}}>
    //         {total_amount && total_amount.actual_total_amount}</span>
    //     </Col>
    //   </Row>
    // },
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
          self.onBatch(value);
        },
      },
      widgets: [
        [
          {
            type: "Input",
            label: "用户名",
            placeholder: "请输入用户名",
            value: self.state.user__username || undefined,
            onChange(evt) {
              self.onInputChanged("user__username", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: "Input",
            label: "手机号",
            placeholder: "请输入手机号",
            value: self.state.phone || undefined,
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
            label: "省份",
            placeholder: "请输入省份",
            value: self.state.province || undefined,
            onChange(evt) {
              self.onInputChanged("province", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: "Input",
            label: "城市",
            placeholder: "请输入城市",
            value: self.state.city || undefined,
            onChange(evt) {
              self.onInputChanged("city", evt.target.value);
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
          value: self.state.agent_name || undefined,
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
            value: self.state.reviewStatus,
            option: {
              key: "id",
              value: "id",
              title: "name",
              data: [
                {
                  id: 0,
                  name: "待审核",
                },
                {
                  id: 1,
                  name: "审核成功",
                },
                {
                  id: 2,
                  name: "审核不通过",
                }
              ],
            },
            onChange(val, elem) {
              self.onOptionSelect("review", val, elem);
            },
            onSelect(val, elem) { },
            onBlur() { },
          },
          {
            type: "Select",
            label: "划款状态",
            placeholder: "请选择划款状态",
            // width: 200,
            value: self.state.remitStatus,
            option: {
              key: "id",
              value: "id",
              title: "name",
              data: [
                {
                  id: 0,
                  name: "待划款",
                },
                {
                  id: 1,
                  name: "划款成功",
                },
                {
                  id: 2,
                  name: "划款失败",
                }
              ],
            },
            onChange(val, elem) {
              self.onOptionSelect("remit", val, elem);
            },
            onSelect(val, elem) { },
            onBlur() { },
          }
        ],
        {
          type: "RangePicker",
          label: "审核时间",
          placeholder: ["开始日期", "结束日期"],
          showTime: { format: "HH:mm:ss", },
          format: FORMAT_TIME,
          alias: [1, 7, 30],
          value: self.state.reviewDateRange || [],
          onChange(value) {
            self.onDateRangeChange("review", value);
          },
        },
        {
          type: "RangePicker",
          label: "划款时间",
          placeholder: ["开始日期", "结束日期"],
          showTime: { format: "HH:mm:ss", },
          format: FORMAT_TIME,
          alias: [1, 7, 30],
          value: self.state.remitDateRange || [],
          onChange(value) {
            self.onDateRangeChange("remit", value);
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
      // ref: self.exportExcel,
      // rowSelection,
      title: () => {
        const { total_amount, } = self.props.finance.withdrawListMeta;

        return (
          <Row style={{ marginBottom: 10, fontSize: 14, }}>
            <Col span={4}>
              <span style={{ fontWeight: 500, }}>充值总金额：</span>
              <span style={{ color: "red", }}>
                {total_amount && total_amount.expect_total_amount}
              </span>
            </Col>
            <Col span={4}>
              <span style={{ fontWeight: 500, }}>支付总金额：</span>
              <span style={{ color: "red", }}>
                {total_amount && total_amount.actual_total_amount}
              </span>
            </Col>
          </Row>
        );
      },
      scroll: { x: columnsWidth, },
      // tableLayout: 'fixed',
      bordered: true,
      columns,
      dataSource: self.props.finance.withdrawList,
      pagination,
      onChange(pagination, filters, sorter) {
        const payload: any = {
          current_page: pagination.current,
          page_size: pagination.pageSize,
        };

        if (!utils.isEmpty(filters)) {
          for (let [key, value] of Object.entries(filters)) {
            payload[key] = value ? value[0] : undefined;
          }
        }

        if (!utils.isEmpty(sorter)) {
          payload.orderBy = `${sorter.field}`;
          payload.sort = `${sorter.order === "descend" ? "desc" : "asc"}`;
        } else {
          delete payload.orderBy;
          delete payload.sort;
        }

        self.props.finance.setFilterWithdraw(payload);

        self.setState(
          {
            currentPage: pagination.current,
          },
          () => {
            self.getDataList(self.props.finance.filterWithdraw);
          }
        );
      },
    },
  };
};

export default config;
