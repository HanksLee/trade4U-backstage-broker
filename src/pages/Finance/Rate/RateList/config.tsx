import * as React from "react";
import { Button, Icon, Popconfirm, Popover } from "antd";
import utils from "utils";

const config = self => {
  // const { selectedRowKeys, } = self.state;
  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     self.setState({ selectedRowKeys: selectedRowKeys, });
  //   },
  // };
  const permissions = self.props.common.permissions;
  const columns = [
    {
      title: "券商 ID",
      dataIndex: "broker",
    },
    {
      title: () => {
        return <div>
          <span style={{ marginRight: 4, }}>交易货币</span>
          <Popover content={"平台结算的货币类型"}>
            <Icon type="question-circle"/>
          </Popover>
        </div>;
      },
      dataIndex: "trade_currency_display",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: () => {
        return <div>
          <span style={{ marginRight: 4, }}>支付货币</span>
          <Popover content={"客户支付或者收款的货币类型"}>
            <Icon type="question-circle"/>
          </Popover>
        </div>;
      },
      dataIndex: "pay_currency_display",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "入金汇率",
      dataIndex: "rate",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "出金汇率",
      dataIndex: "out_rate",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      // width: 120,
      title: "操作",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">

            {
              permissions.includes("edit_rate") && <span onClick={() => {
                self.props.finance.getCurrentRate(record.id);
                self.toggleRateModal(record.id);
              }}>编辑</span>
            }
            <span className="common-list-table-operation-spliter"></span>
            {
              permissions.includes("delete_rate") && <Popconfirm
                title="请问是否确定删除当前记录"
                onConfirm={async () => {
                  const res = await self.$api.finance.deleteRate(record.id);

                  if (res.status === 204) {
                    self.getDataList(self.props.finance.filterRate);
                  } else {
                    self.$msg.error(res.data.message);
                  }
                }}
                onCancel={() => {
                }}
              >
                <span>删除</span>
              </Popconfirm>
            }
          </div>
        );
      },
    }
  ];

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.props.finance.rateListMeta.total,
    current: self.state.currentPage,
    onChange: (current, pageSize) => {
    },
    onShowSizeChange: (current, pageSize) => {
      // @todo 调用获取表接口
      self.resetPagination(pageSize, current);
    },
  };

  return {
    // 是否显示增加按钮
    addBtn: {
      title: () => (
        <Button type='primary' style={{ display: "none", }} onClick={() => {
          self.props.finance.setCurrentRate({});
          self.toggleRateModal();
        }}><Icon type="plus"/>添加</Button>
      ),
    },
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
          self.onBatch(value);
        },
      },
      widgets: [],
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
      dataSource: self.props.finance.rateList,
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

        self.props.finance.setFilterRate(payload);

        self.setState(
          {
            currentPage: pagination.current,
          },
          () => {
            self.getDataList(self.props.finance.filterRate);
          }
        );
      },
    },
  };
};

export default config;
