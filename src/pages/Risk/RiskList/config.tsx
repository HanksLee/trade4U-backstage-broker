import utils from "utils";
import moment from "moment";
import { FORMAT_TIME } from "constant";

const config = self => {
  const columns = [
    {
      title: "日志时间",
      dataIndex: "timestamp",
      width: 200,
      render: (text, record) => {
        return (text && moment(text * 1000).format(FORMAT_TIME)) || "--";
      },
    },
    {
      title: "日志內容",
      dataIndex: "message",
    }
  ];

  const { start_time, end_time, username, phone, } = self.props.risk.getFilterInfo;
  
  return {
    searcher: {
      widgets:[
        [
          {
            type: "Input",
            label: "姓名",
            placeholder: "请输入姓名",
            value: username || undefined,
            onChange(evt) {
              const username = evt.target.value;
              self.props.risk.setFilterInfo({ username, });
            },
            onPressEnter(evt) {
              if(self.props.isFilterOK)
                self.props.risk.fetchRiskList();
            },
          },
          {
            type: "Input",
            label: "手机号",
            placeholder: "请输入手机号",
            value: phone || undefined,
            onChange(evt) {
              const phone = evt.target.value;
              self.props.risk.setFilterInfo({ phone, });
            },
            onPressEnter(evt) {
              if(self.props.isFilterOK)
                self.props.risk.fetchRiskList();
            },
          }
        ],
        [
          {
            type: "RangePicker",
            label: "时间",
            placeholder: ["开始日期", "结束日期"],
            showTime: { defaultValue: [
              moment("00:00:00", "hh:mm:ss"), moment("00:00:00", "hh:mm:ss")
            ], },
            format: FORMAT_TIME,
            value: [start_time, end_time],
            onChange(dateList) {
              let [start_time, end_time] = dateList;                            
              self.props.risk.setFilterInfo({ start_time, end_time, });
            },
            disabledDate(date) {
              const  { start_time, end_time, }  = self.props.risk.getFilterInfo;
                     
              if(start_time === null)
                return date && date > moment().endOf("day");
              else if(date) {
                return (date.diff(start_time, 'days') > 0) || (date.diff(start_time, 'days') < 0); 
              }                      
            },
            disabledTime(list, type) {
              const lockSencodeFun = {
                disabledSeconds: () => utils.getRangeNumberList(1, 60),
              };

              if(type === "end" && list) {
                const  { start_time, end_time, }  = self.props.risk.getFilterInfo;

                if(start_time === null)
                  return lockSencodeFun;
                const hour = start_time.hour();
                const min = start_time.minute();
                               
                return {
                  disabledHours: () => {
                    const hourList =  utils.getRangeNumberList(0, 24);
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
      searchDisabled: !self.props.risk.isFilterOK,
      onSearch() {
        self.props.risk.fetchRiskList();
      },
      onReset() {
        self.props.risk.setInit();
      },
    },
  
    table: {
      rowKey: "timestamp",
      bordered: true,
      columns,
      pagination:false,
      dataSource: self.props.risk.getHistoryList,
    },
  };
};

export default config;