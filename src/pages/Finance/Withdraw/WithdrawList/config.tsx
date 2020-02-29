import * as React from "react";
import { Button, Icon, Popconfirm } from "antd";
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
      title: "姓名",
      dataIndex: "user_display",
      render: (text, record) => {
        return text && text.username || '--';
      },
    },
    {
      title: "省份",
      dataIndex: "province",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "城市",
      dataIndex: "city",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "银行卡号",
      dataIndex: "card_number",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "开户行",
      dataIndex: "bank",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "支行名称",
      dataIndex: "sub_branch",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "申请时间",
      dataIndex: "create_time",
      render: (text, record) => {
        return text && moment(text * 1000).format(FORMAT_TIME) || '--';      },
    },
    {
      title: "预计出金",
      dataIndex: "expect_amount",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "实际出金",
      dataIndex: "actual_amount",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "审核状态",
      dataIndex: "review_status",
      render: (text, record) => {
        const statusType = {
          2: 'hot',
          1: 'normal',
          0: 'block',
        };
        const statusText = {
          2: '审核不通过',
          1: '审核成功',
          0: '待审核',
        };

        return <StatusText type={
          statusType[record.review_status]
        } text={
          statusText[record.review_status]
        } />;
      },
    },
    {
      title: "审核时间",
      dataIndex: "review_time",
      render: (text, record) => {
        return text && moment(text * 1000).format(FORMAT_TIME) || '--';      },
    },
    {
      title: "审核人",
      dataIndex: "reviewer",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "划款状态",
      dataIndex: "remit_status",
      render: (text, record) => {
        const statusType = {
          2: 'hot',
          1: 'normal',
          0: 'block',
        };
        const statusText = {
          2: '划款失败',
          1: '划款成功',
          0: '待划款',
        };

        return <StatusText type={
          statusType[record.remit_status]
        } text={
          statusText[record.remit_status]
        } />;
      },
    },
    {
      title: "划款人",
      dataIndex: "remitter",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "划款单号",
      dataIndex: "remit_number",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "划款时间",
      dataIndex: "remit_time",
      render: (text, record) => {
        return text && moment(text * 1000).format(FORMAT_TIME) || '--';      },
    },
    {
      title: "备注",
      dataIndex: "remarks",
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
            <span onClick={() => {
              self.props.finance.getCurrentWithdraw(record.id);
              self.toggleWithdrawModal();
            }}>编辑</span>
            <span className="common-list-table-operation-spliter"></span>
            <Popconfirm
              title="请问是否确定删除当前记录"
              onConfirm={async () => {
                const res = await self.$api.finance.deleteWithdraw(record.id);

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
    total: self.props.finance.withdrawListMeta.total,
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
        <Button style={{ display: 'none', }} type='primary' onClick={() => {
          self.props.finance.setCurrentWithdraw({});
          self.toggleWithdrawModal();
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
            label: '省份',
            placeholder: '请输入省份',
            value: self.state.province || undefined,
            onChange(evt) {
              self.onInputChanged('province', evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: 'Input',
            label: '城市',
            placeholder: '请输入城市',
            value: self.state.city || undefined,
            onChange(evt) {
              self.onInputChanged('city', evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          }
        ],
        [
          {
            type: 'Select',
            label: '审核状态',
            placeholder: '请选择审核状态',
            // width: 200,
            value: self.state.reviewStatus,
            option: {
              key: 'id',
              value: 'id',
              title: 'name',
              data: [
                {
                  id: 0,
                  name: '待审核',
                },
                {
                  id: 1,
                  name: '审核成功',
                },
                {
                  id: 2,
                  name: '审核不通过',
                }
              ],
            },
            onChange(val, elem) {
              self.onOptionSelect('review', val, elem);
            },
            onSelect(val, elem) {
            },
            onBlur() {
            },
          },
          {
            type: 'Select',
            label: '划款状态',
            placeholder: '请选择划款状态',
            // width: 200,
            value: self.state.remitStatus,
            option: {
              key: 'id',
              value: 'id',
              title: 'name',
              data: [
                {
                  id: 0,
                  name: '待划款',
                },
                {
                  id: 1,
                  name: '划款成功',
                },
                {
                  id: 2,
                  name: '划款失败',
                }
              ],
            },
            onChange(val, elem) {
              self.onOptionSelect('remit', val, elem);
            },
            onSelect(val, elem) {
            },
            onBlur() {
            },
          }
        ],
        {
          type: 'RangePicker',
          label: '审核时间',
          placeholder: ['开始日期', '结束日期'],
          showTime: { format: 'HH:mm:ss', },
          format: FORMAT_TIME,
          alias: [1, 7, 30],
          value: self.state.reviewDateRange || [],
          onChange(value) {
            self.onDateRangeChange('review', value);
          },
        },
        {
          type: 'RangePicker',
          label: '划款时间',
          placeholder: ['开始日期', '结束日期'],
          showTime: { format: 'HH:mm:ss', },
          format: FORMAT_TIME,
          alias: [1, 7, 30],
          value: self.state.remitDateRange || [],
          onChange(value) {
            self.onDateRangeChange('remit', value);
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
