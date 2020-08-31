import utils from "utils";
import * as React from "react";
import { Button, Checkbox, Icon, Popconfirm, Select } from "antd";
import moment from "moment";
import { FORMAT_TIME } from "constant";

const config = self => {
  const columns = [
    {
      title: "用户名",
      width: 100,
      dataIndex: "username",
      fixed: "left",
    },
    {
      title: "手机号",
      width: 200,
      dataIndex: "phone",
      ellipsis: true,
    },
    {
      title: "单号",
      width: 250,
      dataIndex: "order_number",
    },
    {
      title: "省份",
      width: 100,
      dataIndex: "province",
    },
    {
      title: "城市",
      width: 100,
      dataIndex: "city",
    },
    {
      title: "银行卡号",
      width: 250,
      dataIndex: "card_number",
    },
    {
      title: "开户银行",
      width: 100,
      dataIndex: "bank",
    },
    {
      title: "支行名称",
      width: 100,
      dataIndex: "sub_branch",
    },
    {
      title: "预计出金金额",
      width: 250,
      dataIndex: "expect_amount",
    },
    {
      title: "预计出金货币单位",
      width: 100,
      dataIndex: "expect_currency",
    },
    {
      title: "实际出金金额",
      width: 250,
      dataIndex: "actual_amount",
    },
    {
      title: "实际出金货币单位",
      width: 100,
      dataIndex: "actual_currency",
    },
    {
      title: "启用状态",
      width: 100,
      dataIndex: "review_status",
      render: (text, record) => {
        switch (record.review_status) {
          case 0:
            return "待审核";
            break;
          case 1:
            return "审核通过";
            break;
          case 2:
            return "审核不通过";
            break;
          default:
            return "--";
        }
      },
    },
    {
      title: "审核时间",
      width: 250,
      dataIndex: "review_time",
      render: (text, record) => {
        return (
          (record.review_time &&
            moment(record.review_time * 1000).format(FORMAT_TIME)) ||
          "--"
        );
      },
    },
    {
      title: "审核者",
      width: 100,
      dataIndex: "reviewer",
    },
    {
      title: "审核者姓名",
      width: 120,
      dataIndex: "reviewer_name",
    },
    {
      title: "提交时间",
      width: 250,
      dataIndex: "create_time",
      render: (text, record) => {
        return (
          (record.create_time &&
            moment(record.create_time * 1000).format(FORMAT_TIME)) ||
          "--"
        );
      },
    },
    {
      title: "操作",
      // width: 150,
      fixed: "right",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            <span onClick={() => self.showEditCommissionModal(record)}>
              编辑
            </span>
            {/* <span className="common-list-table-operation-spliter"></span> */}
            {/* <span onClick={() => self.goToPermissionEditor(record.id)}>
              授权
            </span>
            <span className="common-list-table-operation-spliter"></span>
            <span onClick={() => self.brokerLogin(record.id)}>登录</span>
            <span className="common-list-table-operation-spliter"></span> */}
            {/* <Popconfirm
              title="请问是否确定删除此用户"
              onConfirm={() => self.deleteVerify(record.id)}
              onCancel={() => {}}
            >
              <span>删除</span>
            </Popconfirm> */}
          </div>
        );
      },
    }
  ];

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.verify.filter.page,
    pageSize: self.props.verify.filter.page_size,
    onChange: (current, pageSize) => {},
    onShowSizeChange: (current, pageSize) => {
      self.getDataList({
        page_size: pageSize,
        current_page: current,
      });
    },
  };

  return {
    // 是否显示增加按钮
    // addBtn: {
    //   title: () => (
    //     <Button type="primary" onClick={() => self.goToEditor()}>
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
            title: "划转客户组",
            value: "custom_group",
          }
        ],
        onBatch: value => {
          self.onBatch(value);
        },
      },
      // widgets: [
      //   [
      //     {
      //       type: "Input",
      //       label: "用户名",
      //       placeholder: "请输入用户名",
      //       value: self.state.tempFilterAgent.username || undefined,
      //       onChange(evt) {
      //         self.onInputChanged("username", evt.target.value);
      //       },
      //       onPressEnter(evt) {
      //         self.onSearch();
      //       }
      //     },
      //     {
      //       type: "Input",
      //       label: "手机",
      //       placeholder: "请输入手机号",
      //       value: self.state.tempFilterAgent.phone || undefined,
      //       onChange(evt) {
      //         self.onInputChanged("phone", evt.target.value);
      //       },
      //       onPressEnter(evt) {
      //         self.onSearch();
      //       }
      //     }
      //   ],
      //   {
      //     type: "RangePicker",
      //     label: "创建时间",
      //     placeholders: ["开始时间", "结束时间"],
      //     format: ["YYYY-MM-DD", "YYYY-MM-DD"],
      //     value: [
      //       self.state.tempFilterAgent.start_time,
      //       self.state.tempFilterAgent.end_time
      //     ],
      //     onChange(values) {
      //       self.onInputChanged("start_time", values[0]);
      //       self.onInputChanged("end_time", values[1]);
      //     },
      //     onPressEnter(evt) {
      //       self.onSearch();
      //     }
      //   }
      // ],
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
      dataSource: self.state.commissionList,
      pagination,
      scroll: { x: 3500, },
      onChange(pagination, filterAgents) {
        const payload: any = {};

        if (!utils.isEmpty(filterAgents)) {
          for (let [key, value] of Object.entries(filterAgents)) {
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
