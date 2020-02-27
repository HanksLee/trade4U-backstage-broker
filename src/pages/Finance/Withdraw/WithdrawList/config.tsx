import * as React from "react";
import { Button, Icon, Popconfirm } from "antd";
import utils from "utils";

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
      dataIndex: "name",
    },
    {
      title: "上级",
      dataIndex: "parent",
      render: (text, record) => {
        return text || '--';
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
      dataIndex: "bank_no",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "开户行",
      dataIndex: "acount",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "支行名称",
      dataIndex: "func_name",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "申请时间",
      dataIndex: "func_name",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "出金",
      dataIndex: "func_name",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "审核状态",
      dataIndex: "func_name",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "审核时间",
      dataIndex: "func_name",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "审核人",
      dataIndex: "func_name",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "划款状态",
      dataIndex: "func_name",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "划款人",
      dataIndex: "func_name",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "划款单号",
      dataIndex: "func_name",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "划款时间",
      dataIndex: "func_name",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "备注",
      dataIndex: "func_name",
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
              self.props.finance.setCurrentWithdraw(record, true, false);
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
      widgets: [
      ],
      onSearch() {
      },
      onReset() {
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

        self.setState(
          {
            filter: {
              ...self.state.filter,
              ...payload,
            },
            currentPage: pagination.current,
          },
          () => {
            self.getDataList(self.state.filter);
          }
        );
      },
    },
  };
};

export default config;
