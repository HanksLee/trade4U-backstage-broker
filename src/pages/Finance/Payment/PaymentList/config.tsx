import * as React from "react";
import { Button, Icon, Popconfirm,Checkbox } from "antd";
import utils from "utils";
import StatusText from 'components/StatusText';

const config = self => {
  // const { selectedRowKeys, } = self.state;
  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     self.setState({ selectedRowKeys: selectedRowKeys, });
  //   },
  // };

  const columns = [
    {
      title: "券商 ID",
      dataIndex: "broker",
    },
    {
      title: "通道名称",
      dataIndex: "name",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "通道编码",
      dataIndex: "code",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "商户名称",
      dataIndex: "merchant",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "商户号",
      dataIndex: "merchant_number",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "最低入金",
      dataIndex: "min_deposit",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "最高入金",
      dataIndex: "max_deposit",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "入金手续费",
      dataIndex: "fee",
      render: (text, record) => {
        return text || '--';
      },
    },
    {
      title: "禁用",
      dataIndex: "status",
      render: (text, record) => {
        const handleChange = async (e) => {
          const res = await self.$api.finance.updatePayment(record.id, {
            status: text == 0 ? 1 : 0
          });
          if (res.status === 200) {
            self.getDataList(self.props.finance.filterPayment);
          } else {
            self.$msg.error(res.data.message);
          }
        };
        return <Checkbox checked={text} onChange={handleChange} />;
        // const statusType = {
        //   1: 'normal',
        //   0: 'hot',
        // };
        // const statusText = {
        //   1: '启用',
        //   0: '禁用',
        // };

        // return <StatusText type={
        //   statusType[record.status]
        // } text={
        //   statusText[record.status]
        // } />;
      },
    },
    {
      // width: 120,
      title: "操作",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            <span onClick={() => {
              self.props.finance.getCurrentPayment(record.id);
              self.togglePaymentModal();
            }}>编辑</span>
            <span className="common-list-table-operation-spliter"></span>
            <Popconfirm
              title="请问是否确定删除当前记录"
              onConfirm={async () => {
                const res = await self.$api.finance.deletePayment(record.id);

                if (res.status === 204) {
                  self.getDataList(self.props.finance.filterPayment);
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
    total: self.props.finance.paymentListMeta.total,
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
          self.props.finance.setCurrentPayment({});
          self.togglePaymentModal();
        }}><Icon type="plus" />添加</Button>
      ),
    },
    searcher: {
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
            type: 'Input',
            label: '通道名称',
            placeholder: '请输入通道名称',
            value: self.state.name || undefined,
            onChange(evt) {
              self.onInputChanged('name', evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: 'Input',
            label: '通道编码',
            placeholder: '请输入通道编码',
            value: self.state.code || undefined,
            onChange(evt) {
              self.onInputChanged('code', evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          }
        ],
        [
          {
            type: 'Select',
            label: '状态',
            placeholder: '请选择状态',
            // width: 200,
            value: self.state.status,
            option: {
              key: 'id',
              value: 'id',
              title: 'name',
              data: [
                {
                  id: 0,
                  name: '禁用',
                },
                {
                  id: 1,
                  name: '启用',
                }
              ],
            },
            onChange(val, elem) {
              self.onOptionSelect('status', val, elem);
            },
            onSelect(val, elem) {
            },
            onBlur() {
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
      columns,
      dataSource: self.props.finance.paymentList,
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

        self.props.finance.setFilterPayment(payload);

        self.setState(
          {
            currentPage: pagination.current,
          },
          () => {
            self.getDataList(self.props.finance.filterPayment);
          }
        );
      },
    },
  };
};

export default config;
