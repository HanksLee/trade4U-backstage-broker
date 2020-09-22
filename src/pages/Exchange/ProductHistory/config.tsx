import * as React from "react";
import { Button, Icon, Popconfirm, Checkbox } from "antd";
import utils from "utils";
import { WEEKLY_ORDER } from "constant";
import moment from "moment";
import { FORMAT_TIME } from "constant";

function checkTimeLimit(start, end) {   
  return end.diff(start, 'm') < 10;
}
  
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
      title: "时间",
      dataIndex: "timestamp",
      width: 100,
      render: (text, record) => {
        return  utils.timestampFormatDate(text, FORMAT_TIME);
      },
    },
    {
      title: "产品名称",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "产品代码",
      dataIndex: "symbol",
      width: 100,
    },
    {
      title: "买价",
      dataIndex: "buy",
      width: 100,
    },
    {
      title: "卖价",
      dataIndex: "sell",
      width: 100,
    }
  ];

    
  return {
    searcher: {
      onBackClick:()=>{
        self.props.product.setInit();
        const url = `/dashboard/exchange/product`;
        self.props.history.push(url);
      },
      widgets:[
        [
          {
            type: "RangePicker",
            label: "时间",
            placeholder: ["开始日期", "结束日期"],
            showTime: { defaultValue: [
              moment("00:00:00", "hh:mm:ss"), moment("00:00:00", "hh:mm:ss")
            ], },
            format: FORMAT_TIME,
            value: self.props.product.getFilterHistoryDateList || [],
            onChange(dateList) {
              let [start, end] = dateList;

                            
                            
              self.props.product.setFilterHistoryDate([start, end]);
            },
            disabledDate(date) {
              const dateList = self.props.product.getFilterHistoryDateList;
                     
              const [start, end] = dateList;
              if(start === null)
                return date && date > moment().endOf("day");
              else if(date) {
                return (date.diff(start, 'days') > 0) || (date.diff(start, 'days') < 0); 
              }                      
            },
            disabledTime(list, type) {
              const lockSencodeFun = {
                disabledSeconds: () => utils.getRangeNumberList(1, 60),
              };

              if(type === "end" && list) {
                const dateList = self.props.product.getFilterHistoryDateList;
                const [start] = dateList;
                if(start === null)
                  return lockSencodeFun;
                const hour = start.hour();
                const min = start.minute();
                               
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
      searchDisabled: !self.props.product.checkFilter,
      onSearch() {
        const search = self.$qs.parse(self.props.location.search);
    
        const dateList = self.props.product.getFilterHistoryDateList;

        self.props.product.fetchHistoryList(search.id, dateList[0].unix(), dateList[1].unix(), {});
      },
      onReset() {
        self.props.product.setInit();
      },
    },
  
    table: {
      rowKey: "timestamp",
      bordered: true,
      columns,
      pagination:false,
      dataSource: self.props.product.getHistoryList,
    },
  };
};

export default config;