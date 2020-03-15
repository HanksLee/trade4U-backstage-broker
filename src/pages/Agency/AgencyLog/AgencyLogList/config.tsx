import * as React from "react";
import { Button, Icon, Popconfirm, Row, Col } from "antd";
import utils from "utils";
import StatusText from 'components/StatusText';
import moment from 'moment';
import {
  FORMAT_TIME
} from 'constant';

const config = self => {
  const { selectedRowKeys, } = self.state;
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      self.setState({ selectedRowKeys: selectedRowKeys, });
    },
  };

  const columns = [
    {
      title: "客户姓名",
      // width: 100,
      dataIndex: "username",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "客户手机",
      // width: 100,
      dataIndex: "phone",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "交易订单号",
      // width: 100,
      dataIndex: "order_number",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "金额",
      // width: 100,
      dataIndex: "amount",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "结算状态",
      // width: 100,
      dataIndex: "status",
      ellipsis: true,

      render: (text, record) => {
        const statusType = {
          1: 'hot',
          0: 'block',
        };
        const statusText = {
          1: '已结算',
          0: '未结算',
        };
        const styleMap = {
          1: {
            color: 'red',
          },
          0: {
            color: '',
          },
        };

        return <StatusText type={
          statusType[record.status]
        } text={
          <span style={styleMap[record.status]}>{statusText[record.status]}</span>
        } />;
      },
    },
    {
      title: "交易量",
      // width: 100,
      dataIndex: "trading_volume",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "盈亏",
      // width: 100,
      dataIndex: "profit",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "创建时间",
      // width: 140,
      dataIndex: "create_time",
      render: (text, record) => {
        return text && moment(text * 1000).format(FORMAT_TIME) || '--';
      },
    },
    {
      title: "返佣时间",
      // width: 140,
      dataIndex: "transfer_time",
      render: (text, record) => {
        return text && moment(text * 1000).format(FORMAT_TIME) || '--';
      },
    }
  ];

  const columnsWidth = columns.reduce(function (total, cur) {
    return total + cur.width;
  }, 0);

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.props.agency.logListMeta.total,
    current: self.state.currentPage,
    onChange: (current, pageSize) => { },
    onShowSizeChange: (current, pageSize) => {
      // @todo 调用获取表接口
      self.resetPagination(pageSize, current);
    },
  };

  return {
    // 是否显示增加按钮
    addBtn: {
      title: () => (
        <Button style={{ display: 'none', }} type='primary' onClick={() => {
          self.props.agency.setCurrentLog({});
          self.toggleLogModal();
        }}><Icon type="plus" />添加</Button>
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
          self.onBatch(value);
        },
      },
      widgets: [
        [
          {
            type: 'Input',
            label: '姓名',
            placeholder: '请输入姓名',
            value: self.state.username || undefined,
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
            value: self.state.phone || undefined,
            onChange(evt) {
              self.onInputChanged('phone', evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: 'Input',
            label: '订单号',
            placeholder: '请输入订单号',
            value: self.state.order_number || undefined,
            onChange(evt) {
              self.onInputChanged('order_number', evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          }
        ],
        {
          type: 'RangePicker',
          label: '创建时间',
          placeholder: ['开始日期', '结束日期'],
          showTime: { format: 'HH:mm:ss', },
          format: FORMAT_TIME,
          alias: [1, 7, 30],
          value: self.state.createDateRange || [],
          onChange(value) {
            self.onDateRangeChange('create', value);
          },
        },
        {
          type: 'RangePicker',
          label: '返佣时间',
          placeholder: ['开始日期', '结束日期'],
          showTime: { format: 'HH:mm:ss', },
          format: FORMAT_TIME,
          alias: [1, 7, 30],
          value: self.state.transferDateRange || [],
          onChange(value) {
            self.onDateRangeChange('transfer', value);
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
      // rowSelection,
      scroll: { x: columnsWidth, },
      // tableLayout: 'fixed',
      columns,
      dataSource: self.props.agency.logList,
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

        self.props.agency.setFilterLog(payload);

        self.setState(
          {
            currentPage: pagination.current,
          },
          () => {
            self.getDataList(self.props.agency.filterLog);
          }
        );
      },
    },
  };
};

export default config;
