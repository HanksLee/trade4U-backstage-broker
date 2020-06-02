import * as React from "react";
import { Button, Icon, Popconfirm, Row, Col } from "antd";
import utils from "utils";
import StatusText from "components/StatusText";
import moment from "moment";
import { FORMAT_TIME } from "constant";

const config = self => {
  const { selectedRowKeys } = self.state;
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      self.setState({ selectedRowKeys: selectedRowKeys });
    }
  };

  const columns = [
    {
      title: "客户姓名",
      // width: 100,
      dataIndex: "username",
      render: (text, record) => {
        return text || "--";
      }
    },
    {
      title: "客户手机",
      // width: 100,
      dataIndex: "phone",
      render: (text, record) => {
        return text || "--";
      }
    },
    {
      title: "相关订单号",
      // width: 100,
      dataIndex: "order_number",
      render: (text, record) => {
        return text || "--";
      }
    },
    {
      title: "原有余额",
      dataIndex: "before_balance",
      width: 150
    },
    {
      title: "变动金额",
      dataIndex: "amount",
      width: 150,
      render: (text, record) => {
        return text == 0 ? (
          0
        ) : record.in_or_out === 0 ? (
          <span style={{ color: "red" }}>{`-${text}`}</span>
        ) : (
          <span style={{ color: "green" }}>{`+${text}`}</span>
        );
      }
    },
    {
      title: "现有余额",
      dataIndex: "after_balance",
      width: 150
    },
    {
      title: "ip",
      // width: 100,
      dataIndex: "ip",
      render: (text, record) => {
        return text || "--";
      }
    },
    {
      title: "变动原因",
      // width: 100,
      dataIndex: "cause",
      render: (text, record) => {
        return text || "--";
      }
    },
    {
      title: "创建时间",
      // width: 140,
      dataIndex: "create_time",
      render: (text, record) => {
        return (text && moment(text * 1000).format(FORMAT_TIME)) || "--";
      }
    },
    {
      title: "备注",
      // width: 100,
      dataIndex: "remarks",
      render: (text, record) => {
        return text || "--";
      }
    }
  ];

  // const columnsWidth = columns.reduce(function (total, cur) {
  //   return total + cur.width;
  // }, 0);

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.props.agency.infoListMeta.total,
    current: self.state.currentPage,
    onChange: (current, pageSize) => {},
    onShowSizeChange: (current, pageSize) => {
      // @todo 调用获取表接口
      self.resetPagination(pageSize, current);
    }
  };

  return {
    // 是否显示增加按钮
    addBtn: {
      title: () => (
        <Button
          style={{ display: "none" }}
          type="primary"
          onClick={() => {
            self.props.agency.setCurrentInfo({});
            self.toggleInfoModal();
          }}
        >
          <Icon type="plus" />
          添加
        </Button>
      )
    },
    searcher: {
      batchControl: {
        placeholder: "请选择",
        showBatchControl: !utils.isEmpty(self.state.selectedRowKeys),
        options: [
          {
            title: "删除",
            value: "delete"
          }
        ],
        onBatch: value => {
          self.onBatch(value);
        }
      },
      widgets: [
        [
          {
            type: "Input",
            label: "姓名",
            placeholder: "请输入姓名",
            value: self.state.username || undefined,
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
            value: self.state.phone || undefined,
            onChange(evt) {
              self.onInputChanged("phone", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            }
          }
        ],
        [
          {
            type: "Input",
            label: "ip",
            placeholder: "请输入ip",
            value: self.state.ip || undefined,
            onChange(evt) {
              self.onInputChanged("ip", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            }
          },
          {
            type: "Input",
            label: "订单号",
            placeholder: "请输入订单号",
            value: self.state.order_number || undefined,
            onChange(evt) {
              self.onInputChanged("order_number", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            }
          }
        ],

        {
          type: "Input",
          label: "上级姓名",
          placeholder: "请输入上级姓名",
          value: self.state.agent_name || undefined,
          onChange(evt) {
            self.onInputChanged("agent_name", evt.target.value);
          },
          onPressEnter(evt) {
            self.onSearch();
          }
        },
        {
          type: "RangePicker",
          label: "创建时间",
          placeholder: ["开始日期", "结束日期"],
          showTime: { format: "HH:mm:ss" },
          format: FORMAT_TIME,
          alias: [1, 7, 30],
          value: self.state.DateRange || [],
          onChange(value) {
            self.onDateRangeChange("", value);
          }
        }
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
      // rowSelection,
      // scroll: { x: columnsWidth, },
      // tableLayout: 'fixed',
      columns,
      dataSource: self.props.agency.infoList,
      pagination,
      onChange(pagination, filters, sorter) {
        const payload: any = {
          current_page: pagination.current,
          page_size: pagination.pageSize
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

        self.props.agency.setFilterInfo(payload);

        self.setState(
          {
            currentPage: pagination.current
          },
          () => {
            self.getDataList(self.props.agency.filterInfo);
          }
        );
      }
    }
  };
};

export default config;
