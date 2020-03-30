import utils from "utils";
import * as React from "react";
import { Popconfirm } from "antd";
import moment from "moment";
import { FORMAT_TIME } from "constant";

const config = self => {
  const columns = [
    {
      title: "名字",
      width: 100,
      dataIndex: "username",
      fixed: "left"
    },
    {
      title: "手机",
      width: 200,
      dataIndex: "phone",
      ellipsis: true
    },
    {
      title: "单号",
      width: 250,
      dataIndex: "order_number"
    },
    {
      title: "省份",
      width: 100,
      dataIndex: "province"
    },
    {
      title: "城市",
      width: 100,
      dataIndex: "city"
    },
    {
      title: "银行卡号",
      width: 250,
      dataIndex: "card_number"
    },
    {
      title: "开户银行",
      width: 100,
      dataIndex: "bank"
    },
    {
      title: "支行名称",
      width: 100,
      dataIndex: "sub_branch"
    },
    {
      title: "预计出金金额",
      width: 250,
      dataIndex: "expect_amount"
    },
    {
      title: "预计出金货币单位",
      width: 100,
      dataIndex: "expect_currency"
    },
    {
      title: "实际出金金额",
      width: 250,
      dataIndex: "actual_amount"
    },
    {
      title: "实际出金货币单位",
      width: 100,
      dataIndex: "actual_currency"
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
      }
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
      }
    },
    {
      title: "审核者",
      width: 100,
      dataIndex: "reviewer"
    },
    {
      title: "审核者姓名",
      width: 120,
      dataIndex: "reviewer_name"
    },
    // {
    //   title: "划款状态",
    //   width: 100,
    //   dataIndex: "remit_status",
    //   render: (text, record) => {
    //     switch (record.remit_status) {
    //       case 0:
    //         return "待划款";
    //         break;
    //       case 1:
    //         return "划款通过";
    //         break;
    //       case 2:
    //         return "划款不通过";
    //         break;
    //       default:
    //         return "--";
    //     }
    //   }
    // },
    // {
    //   title: "划款者",
    //   width: 100,
    //   dataIndex: "remitter"
    // },
    // {
    //   title: "划款者姓名",
    //   width: 120,
    //   dataIndex: "remitter_name"
    // },
    // {
    //   title: "划款单号",
    //   width: 250,
    //   dataIndex: "remit_number"
    // },
    // {
    //   title: "划款时间",
    //   width: 250,
    //   dataIndex: "remit_time",
    //   render: (text, record) => {
    //     return (
    //       (record.remit_time &&
    //         moment(record.remit_time * 1000).format(FORMAT_TIME)) ||
    //       "--"
    //     );
    //   }
    // },
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
      }
    },
    {
      title: "操作",
      // width: 150,
      fixed: "right",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            <span onClick={() => self.showEditWithdrawApplyModal(record)}>
              编辑
            </span>
            {/* <span className="common-list-table-operation-spliter"></span> */}
            {/* <span onClick={() => self.goToPermissionEditor(record.id)}>
              授权
            </span>
            <span className="common-list-table-operation-spliter"></span>
            <span onClick={() => self.brokerLogin(record.id)}>登录</span> */}
            <span className="common-list-table-operation-spliter"></span>
            <Popconfirm
              title="请问是否确定删除此用户"
              onConfirm={() => self.deleteWithdrawApply(record.id)}
              onCancel={() => {}}
            >
              <span>删除</span>
            </Popconfirm>
          </div>
        );
      }
    }
  ];

  const columnsWidth = columns.reduce(function(total, cur) {
    return total + cur.width;
  }, 0);

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.verify.filter.page,
    pageSize: self.props.verify.filter.page_size,
    onChange: (current, pageSize) => {},
    onShowSizeChange: (current, pageSize) => {
      self.getDataList({
        page_size: pageSize,
        page: current
      });
    }
  };

  return {
    // 是否显示增加按钮
    // addBtn: {
    //   title: () => (
    //     <Button type="primary" onClick={() => self.showEditUserModal()}>
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
            value: "delete"
          }
        ],
        onBatch: value => {
          self.onBatch && self.onBatch(value);
        }
      },

      // widgets: [
      //   [
      //     {
      //       type: "Input",
      //       label: "券商名称",
      //       placeholder: "请输入券商名称",
      //       value: self.state.tempFilter.name || undefined,
      //       onChange(evt) {
      //         self.onInputChanged("name", evt.target.value);
      //       },
      //       onPressEnter(evt) {
      //         self.onSearch();
      //       }
      //     }
      //   ]
      // ],
      onSearch() {
        self.onSearch();
      },
      onReset() {
        self.onReset();
      }
    },
    table: {
      rowKey: "id",
      scroll: { x: columnsWidth },
      columns,
      dataSource: self.state.withdrawApplyList,
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
          page: pagination.current
        });
      }
    }
  };
};

export default config;
