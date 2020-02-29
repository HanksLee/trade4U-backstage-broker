import * as React from "react";
import { Button, Icon, Popconfirm } from "antd";
import utils from "utils";
import moment from 'moment';
import {
  FORMAT_TIME
} from 'constant';
import StatusText from 'components/StatusText';

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
      title: "姓名",
      dataIndex: "user_display",
      render: (text, record) => text.username || '--',
    },
    {
      title: "上级",
      dataIndex: "superior",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "通道名称",
      render: (text, record) => {
        return record.payment_display && record.payment_display.name || '--';
      },
    },
    {
      title: "收款商户",
      render: (text, record) => {
        return record.payment_display && record.payment_display.merchant || '--';
      },
    },
    {
      title: "充值金额",
      dataIndex: "expect_amount",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "支付金额",
      dataIndex: "actual_amount",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "支付状态",
      dataIndex: "status",
      render: (text, record) => {
        const statusType = {
          1: 'normal',
          0: 'block',
        };
        const statusText = {
          1: '已支付',
          0: '未支付',
        };

        return <StatusText type={
          statusType[record.status]
        } text={
          statusText[record.status]
        } />;
      },
    },
    {
      title: "支付单号",
      dataIndex: "order_number",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "提交时间",
      dataIndex: "create_time",
      render: (text, record) => {
        return text && moment(text * 1000).format(FORMAT_TIME) || '--';
      },
    },
    {
      title: "回执时间",
      dataIndex: "notify_time",
      render: (text, record) => {
        return text && moment(text * 1000).format(FORMAT_TIME) || '--';
      },
    },
    {
      title: "回执单号",
      dataIndex: "notify_ordernumber",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      // width: 120,
      title: "操作",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            <span onClick={async () => {
              await self.props.finance.getCurrentDeposit(record.id);
              self.setState({
                initStatus: self.props.finance.currentDeposit.status,
              });
              self.toggleDepositModal(record.id);
            }}>编辑</span>
            <span className="common-list-table-operation-spliter"></span>
            <Popconfirm
              title="请问是否确定删除当前记录"
              onConfirm={async () => {
                const res = await self.$api.finance.deleteDeposit(record.id);

                if (res.status === 204) {
                  self.getDataList(self.state.filter);
                } else {
                  self.$msg.error(res.data.message);
                }
              }}
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
    total: self.props.finance.depositListMeta.total,
    current: self.state.currentPage,
    onChange: (current, pageSize) => {},
    onShowSizeChange: (current, pageSize) => {
      // @todo 调用获取表接口
      self.resetPagination(pageSize, current);
    },
  };

  return {
    // 是否显示增加按钮
    addBtn: {
      title: () => (
        <Button  type='primary' style={{ display: 'none', }} onClick={() => {
          self.props.finance.setCurrentDeposit({}, true, false);
          self.toggleDepositModal();
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
            value: self.state.user__username || undefined,
            onChange(evt) {
              self.onInputChanged('user__username', evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: 'Input',
            label: '金额',
            placeholder: '请输入金额',
            value: self.state.expect_amount || undefined,
            onChange(evt) {
              self.onInputChanged('expect_amount', evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          }
        ],
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
        },
        {
          type: 'RangePicker',
          label: '提交时间',
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
          label: '回执时间',
          placeholder: ['开始日期', '结束日期'],
          showTime: { format: 'HH:mm:ss', },
          format: FORMAT_TIME,
          alias: [1, 7, 30],
          value: self.state.notifyDateRange || [],
          onChange(value) {
            self.onDateRangeChange('notify', value);
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
      columns,
      dataSource: self.props.finance.depositList,
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

        self.props.finance.setFilterDeposit(payload);

        self.setState(
          {
            currentPage: pagination.current,
          },
          () => {
            self.getDataList(self.props.finance.filterDeposit);
          }
        );
      },
    },
  };
};

export default config;
