import * as React from "react";
import { Button, Icon, Popconfirm, Checkbox } from "antd";
import utils from "utils";
import { WeeklyOrder } from "constant";
import moment from "moment";
import { toJS } from "mobx";

// 传给 CommentList 的设定，渲染列表
const config = self => {
  const { selectedRowKeys, } = self.state;
  const permissions = self.props.common.permissions;

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      self.setState({ selectedRowKeys: selectedRowKeys, });
    },
  };

  const columns = [
    {
      width: 80,
      title: "品种 ID",
      dataIndex: "id",
      ellipsis: true,
    },
    {
      width: 100,
      title: "品种名称",
      dataIndex: "name",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      width: 100,
      title: "品种类型",
      dataIndex: "type_display",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      width: 100,
      title: "行情产品",
      dataIndex: "product_display",
      render: (text, record) => {
        return text.name || "--";
      },
    },
    {
      width: 100,
      title: "产品编码",
      render: (text, record) => {
        return (record.product_display && record.product_display.code) || "--";
      },
    },
    {
      width: 50,
      title: "小数位",
      dataIndex: "decimals_place",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      width: 100,
      title: "合约大小",
      dataIndex: "contract_size",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      width: 50,
      title: "点差",
      dataIndex: "spread",
      render: (text, record) => {
        return text || "--";
      },
    },
    {
      width: 100,
      title: "点差模式",
      dataIndex: "spread_mode_display",
    },
    {
      title: "启用",
      width: 50,
      dataIndex: "status",
      render: (text, record) => {
        // console.log("record :>> ", toJS(record));
        const handleChange = async e => {
          const status = e.target.checked ? 1 : 0;
          const res = await self.$api.product.updateProduct(record.id, {
            status,
          });
          if (res.status === 200) {
            self.getDataList(self.props.product.filterProduct);
          } else {
            self.$msg.error(res.data.message);
          }
        };
        const isEnable = record.status === 1 ? true : false;
        return <Checkbox checked={isEnable} onChange={handleChange} />;
      },
    },
    {
      width: 130,
      // fixed: 'right',
      title: "操作",
      render: (text, record) => {
        // console.log('permissions :>> ', toJS(permissions));
        return (
          <div className="common-list-table-operation">
            {permissions.includes("view_broker_symbol_history") && (
              <>
                <span
                  onClick={() => {
                    self.goToHistory(record);
                  }}
                >
                  行情
                </span>
                <span className="common-list-table-operation-spliter"></span>
              </>
            )}
            {permissions.includes("edit_product") && (
              <span
                onClick={() => {
                  self.goToEditor(record);
                }}
              >
                编辑
              </span>
            )}
            <span className="common-list-table-operation-spliter"></span>
            {permissions.includes("delete_product") && (
              <Popconfirm
                title="请问是否确定删除当前规则"
                onConfirm={async () => {
                  const res = await self.$api.product.deleteProduct(record.id);

                  if (res.status === 204) {
                    self.$msg.success("当期记录删除成功");
                    self.getDataList(self.state.filter);
                  } else {
                    self.$msg.error(res.data.message);
                  }
                }}
                onCancel={() => {}}
              >
                <span>删除</span>
              </Popconfirm>
            )}
          </div>
        );
      },
    }
  ];

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.props.product.productListMeta.total,
    current: self.state.currentPage,
    onChange: (current, pageSize) => {},
    onShowSizeChange: (current, pageSize) => {
      // @todo 调用获取表接口
      self.resetPagination(pageSize, current);
    },
  };

  return {
    searcher: {
      // hideSearcher: true,
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
        [
          {
            type: "Input",
            label: "品种名称",
            placeholder: "请输入品种名称",
            value: self.state.name || undefined,
            onChange(evt) {
              self.onInputChanged("name", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: "Select",
            label: "品种类型",
            showSearch: false,
            placeholder: "请选择品种类型",
            allowClear: false,
            width: 150,
            value: self.state.type__name,
            option: {
              key: "id",
              value: "symbol_type_name",
              title: "symbol_type_name",
              data: self.state.typeOptions || [],
            },
            onSelect(val, elem) {
              self.onTypeSelected(val, elem);
            },
          }
        ],
        [
          {
            type: "Input",
            label: "产品编码",
            placeholder: "请输入产品编码",
            value: self.state.product__code || undefined,
            onChange(evt) {
              self.onInputChanged("product__code", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: "Select",
            label: "状态",
            showSearch: false,
            placeholder: "请选择状态",
            allowClear: false,
            width: 150,
            value: self.state.status,
            option: {
              key: "id",
              value: "id",
              title: "name",
              data: [
                {
                  id: 0,
                  name: "禁用",
                },
                {
                  id: 1,
                  name: "启用",
                }
              ],
            },
            onSelect(val, elem) {
              self.onStatusSelected(val, elem);
            },
          }
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
      // rowSelection,
      tableLayout: "fixed",
      columns,
      dataSource: self.props.product.productList,
      pagination,
      scroll: { x: (columns.length - 1) * 100 + 240, },
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

        self.props.product.setFilterProduct(payload);

        self.setState(
          {
            currentPage: pagination.current,
          },
          () => {
            self.getDataList(self.props.product.filterProduct);
          }
        );
      },
    },
  };
};

export default config;
