import moment from 'moment';
import utils from 'utils';

const config = self => {
  const columns = [
    {
      title: "ip",
      dataIndex: "ip",
    },
    {
      title: "手机",
      dataIndex: 'phone',
    },
    {
      title: '方式',
      dataIndex: 'in_or_out',
      render: (text) => (text ? '减少' : '增加'),
    },
    {
      title: '金额',
      dataIndex: 'amount',
    },
    {
      title: '变动前金额',
      dataIndex: 'before_balance',
    },
    {
      title: '变动后金额',
      dataIndex: 'after_balance',
    },
    {
      title: '原因',
      dataIndex: 'cause',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      render: (text) => moment(text * 1000).format('YYYY-MM-DD: hh-mm-ss'),
    }
  ];

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.account.filter.page,
    pageSize: self.props.account.filter.page_size,
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
        [{
          type: 'Input',
          label: '用户名',
          placeholder: '请输入用户名',
          value: self.state.tempFilter.username || undefined,
          width: 150,
          onChange(evt) {
            self.onInputChanged('username', evt.target.value);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        },
        {
          type: 'Input',
          label: 'ip',
          placeholder: '请输入ip',
          value: self.state.tempFilter.ip || undefined,
          width: 150,
          onChange(evt) {
            self.onInputChanged('ip', evt.target.value);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        },
        {
          type: 'Input',
          label: '手机',
          placeholder: '请输入手机',
          width: 150,
          value: self.state.tempFilter.phone || undefined,
          onChange(evt) {
            self.onInputChanged('phone', evt.target.value);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        }],
        [{
          type: 'Input',
          label: '提现订单号',
          placeholder: '请输入提现订单号',
          value: self.state.tempFilter.withdraw_ordernum || undefined,
          onChange(evt) {
            self.onInputChanged('withdraw_ordernum', evt.target.value);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        },
        {
          type: 'Input',
          label: '入金订单号',
          placeholder: '请输入入金订单号',
          value: self.state.tempFilter.deposit_ordernum || undefined,
          onChange(evt) {
            self.onInputChanged('deposit_ordernum', evt.target.value);
          },
          onPressEnter(evt) {
            self.onSearch();
          },
        }],
        {
          type: 'RangePicker',
          label: '创建时间',
          placeholders: ['开始时间', '结束时间'],
          format: ['YYYY-MM-DD', 'YYYY-MM-DD'],
          value: [self.state.tempFilter.start_time, self.state.tempFilter.end_time],
          onChange(values) {
            self.onInputChanged('start_time', values[0]);
            self.onInputChanged('end_time', values[1]);
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
      rowKey: "id",
      columns,
      dataSource: self.state.transactionList,
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
