import utils from "utils";
import moment from "moment";
import { FORMAT_TIME } from "constant";

const config = self => {
  const columns = [
    {
      title: "时间",
      dataIndex: "timestamp",
      width: 200,
      render: (text, record) => {
        return utils.timestampFormatDate(text, FORMAT_TIME);
      },
    },
    {
      title: "客户买入汇率",
      dataIndex: "buy",
    },
    {
      title: "客户卖出汇率",
      dataIndex: "sell",
    },
    {
      title: "货币名称",
      dataIndex: "name",
    },
    {
      title: "货币代码",
      dataIndex: "currency",
    }
  ];

  const { start_time, end_time, currency, } = self.props.currencyHistory.getFilterInfo;

  return {
    searcher: {
      widgets: [
        [
          {
            type: "Input",
            label: "货币",
            labelWidth: 45,
            placeholder: "请输入货币",
            value: currency || undefined,
            onChange(evt) {
              const currency = evt.target.value;
              self.props.currencyHistory.setFilterInfo({ currency, });
            },
            onPressEnter(evt) {
              if (self.props.isFilterOK)
                self.props.currencyHistory.fetchCurrencyHistoryList();
            },
          }
        ],
        [
          {
            type: "RangePicker",
            label: "时间",
            labelWidth: 45,
            placeholder: ["开始日期", "结束日期"],
            showTime: {
              defaultValue: [
                moment("00:00:00", "hh:mm:ss"), moment("00:00:00", "hh:mm:ss")
              ],
            },
            format: FORMAT_TIME,
            value: [start_time, end_time],
            onChange(dateList) {
              let [start_time, end_time] = dateList;
              self.props.currencyHistory.setFilterInfo({ start_time, end_time, });
            },
            disabledDate(date) {
              const { start_time, end_time, } = self.props.currencyHistory.getFilterInfo;

              if (start_time === null)
                return date && date > moment().endOf("day");
              else if (date) {
                return (date.diff(start_time, 'days') > 0) || (date.diff(start_time, 'days') < 0);
              }
            },
            disabledTime(list, type) {
              const lockSencodeFun = {
                disabledSeconds: () => utils.getRangeNumberList(1, 60),
              };

              if (type === "end" && list) {
                const { start_time, end_time, } = self.props.currencyHistory.getFilterInfo;

                if (start_time === null)
                  return lockSencodeFun;
                const hour = start_time.hour();
                const min = start_time.minute();

                return {
                  disabledHours: () => {
                    const hourList = utils.getRangeNumberList(0, 24);
                    hourList.splice(hour, 1);
                    return hourList;
                  },
                  disabledMinutes: () => {
                    const minList = utils.getRangeNumberList(0, 60);
                    minList.splice(min, 10);
                    return minList;
                  },
                  ...lockSencodeFun,
                };
              }


              return lockSencodeFun;
            },
          }
        ]
      ],
      searchDisabled: !self.props.currencyHistory.isFilterOK,
      onSearch() {
        self.props.currencyHistory.fetchCurrencyHistoryList();
      },
      onReset() {
        self.props.currencyHistory.setInit();
      },
    },

    table: {
      rowKey: "timestamp",
      bordered: true,
      columns,
      pagination: false,
      dataSource: self.props.currencyHistory.currencyHistoryList,
    },
  };
};

export default config;