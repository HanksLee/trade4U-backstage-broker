import utils from "utils";
import * as React from "react";
import moment from "moment";
import { FORMAT_TIME } from "constant";

const config = self => {
  const columns = [
    {
      title: "手机号",
      dataIndex: "phone",
      render: (text, record) => {
        return text || "-";
      },
    },
    {
      title: "短信内容",
      dataIndex: "content",
      render: (text, record) => {
        return text || "-";
      },
    },
    {
      title: "发送结果",
      dataIndex: "result",
      render: (text, record) => {
        return text || "-";
      },
    },
    {
      title: "发送时间",
      dataIndex: "create_time",
      render: (text, record) => {
        return  utils.timestampFormatDate(text, FORMAT_TIME);
      },
    }
  ];
  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.sms.filterRecord.page,
    pageSize: self.props.sms.filterRecord.page_size,
    onChange: (current, pageSize) => {},
    onShowSizeChange: (current, pageSize) => {
      self.getDataList({
        page_size: pageSize,
        page: current,
      });
    },
  };

  return {
    // 是否显示增加按钮
    // addBtn: {
    //   title: () => (
    //     <Button type="primary" onClick={() => self.showEditSMSRecordModal()}>
    //       <Icon type="plus" /> 添加
    //     </Button>
    //   )
    // },
    searcher: {
      hideSearcher: true,
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
          self.onBatch && self.onBatch(value);
        },
      },

      widgets: [
        [
          // {
          //   type: "Input",
          //   label: "手机号码",
          //   placeholder: "请输入手机号码",
          //   value: self.state.tempFilter.phone || undefined,
          //   width: 150,
          //   onChange(evt) {
          //     self.onInputChanged("phone", evt.target.value);
          //   },
          //   onPressEnter(evt) {
          //     self.onSearch();
          //   }
          // },
          // {
          //   type: "Input",
          //   label: "名称",
          //   placeholder: "请输入名称",
          //   value: self.state.tempFilter.title || undefined,
          //   width: 150,
          //   onChange(evt) {
          //     self.onInputChanged("title", evt.target.value);
          //   },
          //   onPressEnter(evt) {
          //     self.onSearch();
          //   }
          // }
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
      columns,
      dataSource: self.state.smsRecordList,
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
