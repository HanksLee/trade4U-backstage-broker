import * as React from "react";
import { Button, Icon, Popconfirm } from "antd";
import utils from "utils";
import StatusText from "components/StatusText";

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
      // width: 120,
      title: "品种类型 ID",
      dataIndex: "id",
    },
    {
      // width: 120,
      title: "品种类型名称",
      dataIndex: "symbol_type_name",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      title: "可用状态",
      render: (text, record) => {
        // [antd v3. Column API] https://3x.ant.design/components/table-cn/#Column
        // console.log('该笔资料 record :>> ', record);
        const { status, } = record;
        if (status === undefined) return;
        const statusInfo = {
          0: { type: "block", text: "不可用", },
          1: { type: "normal", text: "可用", },
        };
        return (
          <StatusText
            type={statusInfo[status]["type"]}
            text={statusInfo[status]["text"]}
          />
        );
      },
    },
    {
      // width: 120,
      title: "操作",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            <span
              onClick={() => {
                self.goToEditor(record);
              }}
            >
              编辑
            </span>
          </div>
        );
      },
    }
  ];

  const pagination = {
    ...self.props.common.paginationConfig,
    // total: self.props.exchange.genreListMeta.total,
    current: self.props.product.genreListPagination.current,
    onChange: (current, pageSize) => {},
    onShowSizeChange: (current, pageSize) => {
      const {
        setGenreListPagination,
        genreListPagination,
      } = self.props.product;
      const pagination = { ...genreListPagination, pageSize, current, };
      setGenreListPagination(pagination);
    },
  };

  return {
    // 是否显示增加按钮
    addBtn: null,
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
      onSearch() {},
      onReset() {},
    },
    table: {
      rowKey: "id",
      // rowSelection,
      columns,
      dataSource: self.props.product.genreList,
      pagination,
      onChange(pagination, filters, sorter) {
        const { setGenreListPagination, getGenreList, } = self.props.product;
        const payload: any = { ...pagination, };
        // console.log("payload :>> ", payload);
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
        // 更新分页后，呼叫回呼重抓数据
        setGenreListPagination(payload);
        getGenreList();
      },
    },
  };
};

export default config;
