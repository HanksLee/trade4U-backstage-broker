import * as React from "react";
import { Button, Icon, Popconfirm } from "antd";
import utils from "utils";
import StatusText from 'components/StatusText';

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
      dataIndex: "name",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: '可用状态',
      render: (text, record) => {
        const statusType = {
          1: 'normal',
          0: 'block',
        };
        const statusText = {
          1: '可用',
          0: '不可用',
        };

        return <StatusText type={
          statusType[record.in_use]
        } text={
          statusText[record.in_use]
        } />;
      },
    },
    {
      // width: 120,
      title: "操作",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            <span onClick={() => {
              self.props.exchange.setCurrentGenre(record, true, false);
              self.toggleGenreModal();
            }}>编辑</span>
            <span className="common-list-table-operation-spliter"></span>
            <Popconfirm
              title="请问是否确定删除品种类型"
              onConfirm={async () => {
                const res = await self.$api.exchange.deleteGenre(record.id);

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
    total: self.props.exchange.genreListMeta.total,
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
        <Button type='primary' onClick={() => {
          self.props.exchange.setCurrentGenre({});
          self.toggleGenreModal();
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
      dataSource: self.props.exchange.genreList,
      pagination,
      onChange(pagination, filters, sorter) {
        const payload: any = {
          page: pagination.current,
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
