import utils from "utils";
import * as React from "react";
import { Button, Icon, Popconfirm, Checkbox } from "antd";
import moment from "moment";
import { FORMAT_TIME } from "constant";

const config = self => {
  let columnsNum = 1;
  const columns = [
    {
      title: "序号",
      dataIndex: "id",
      render: (text, record) => {
        return columnsNum++;
      },
    },
    {
      title: "所属key",
      dataIndex: "key",
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "名称",
      dataIndex: "title",
      render: (text, record) => {
        return text;
      },
    },
    {
      title: "描述",
      dataIndex: "description",
      render: (text, record) => {
        return text || "";
      },
    },
    // {
    //   title: "是否顯示",
    //   dataIndex: "status",
    //   render: (text, record) => {
    //     const handleChange = async e => {
    //       const res = await self.$api.manager.updateManager(record.id, {
    //         status: text == 0 ? 1 : 0
    //       });
    //       if (res.status === 200) {
    //         self.getDataList(self.props.manager.filter);
    //       } else {
    //         self.$msg.error(res.data.message);
    //       }
    //     };
    //     return <Checkbox checked={text} onChange={handleChange} />;
    //   }
    // },
    {
      title: "操作",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            <span onClick={() => self.showEditMessageTypeModal(record)}>
              编辑
            </span>
            <span className="common-list-table-operation-spliter"></span>
            {/* <span onClick={() => self.goToPermissionEditor(record.id)}>
              授权
            </span>
            <span className="common-list-table-operation-spliter"></span>
            <span onClick={() => self.brokerLogin(record.id)}>登录</span>
            <span className="common-list-table-operation-spliter"></span> */}
            <Popconfirm
              title="请问是否确定删除此分類"
              onConfirm={() => self.deleteMessageType(record.id)}
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
    total: self.state.total,
    current: self.props.message.filterType.page,
    pageSize: self.props.message.filterType.page_size,
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
    addBtn: {
      title: () => (
        <Button type="primary" onClick={() => self.showEditMessageTypeModal()}>
          <Icon type="plus" /> 添加
        </Button>
      ),
    },
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
          self.onBatch && self.onBatch(value);
        },
      },

      widgets: [
        [
          {
            type: "Input",
            label: "所属key",
            placeholder: "请输入所属key",
            value: self.state.tempFilter.key || undefined,
            //width: 150,
            onChange(evt) {
              self.onInputChanged("key", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            },
          },
          {
            type: "Input",
            label: "名称",
            labelWidth:45,
            placeholder: "请输入名称",
            value: self.state.tempFilter.title || undefined,
            //width: 150,
            onChange(evt) {
              self.onInputChanged("title", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
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
      columns,
      dataSource: self.state.messageTypeList,
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
