import utils from "utils";
import * as React from "react";
import { Button, Icon, Popconfirm, Checkbox } from "antd";
import moment from "moment";
import { FORMAT_TIME } from "constant";

const config = self => {
  const { messageTypeList, brokerId } = self.state;
  let columnsNum = 1;
  const columns = [
    {
      title: "序号",
      dataIndex: "id",
      render: (text, record) => {
        return columnsNum++;
      }
    },
    {
      title: "内容分类",
      dataIndex: "message_type",
      render: (text, record) => {
        for (let item of messageTypeList) {
          if (item.id == text) return item.title;
        }
      }
    },
    {
      title: "标题",
      dataIndex: "title",
      render: (text, record) => {
        return text;
      }
    },
    // {
    //   title: "內容描述",
    //   dataIndex: "content",
    //   render: (text, record) => {
    //     return text || "";
    //   },
    // },
    {
      title: "创建时间",
      width: 200,
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
      title: "是否显示",
      dataIndex: "is_display",
      render: (text, record) => {
        const handleChange = async e => {
          const res = await self.$api.message.updateMessageContent(record.id, {
            brokerId,
            is_display: text == 0 ? 1 : 0
          });
          if (res.status === 200) {
            self.getDataList(self.props.message.filterContent);
          } else {
            self.$msg.error(res.data.message);
          }
        };
        return <Checkbox checked={text} onChange={handleChange} />;
      }
    },
    {
      title: "操作",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            <span onClick={() => self.showEditMessageContentModal(record)}>
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
              title="请问是否确定删除此內容"
              onConfirm={() => self.deleteMessageContent(record.id)}
              onCancel={() => {}}
            >
              <span>删除</span>
            </Popconfirm>
          </div>
        );
      }
    }
  ];
  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.message.filterContent.page,
    pageSize: self.props.message.filterContent.page_size,
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
    addBtn: {
      title: () => (
        <Button
          type="primary"
          onClick={() => self.showEditMessageContentModal()}
        >
          <Icon type="plus" /> 添加
        </Button>
      )
    },
    searcher: {
      // hideSearcher: true,
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

      widgets: [
        [
          {
            type: "Input",
            label: "标题",
            placeholder: "请输入标题",
            value: self.state.tempFilter.title || undefined,
            width: 150,
            onChange(evt) {
              self.onInputChanged("title", evt.target.value);
            },
            onPressEnter(evt) {
              self.onSearch();
            }
          }
          // {
          //   type: "Input",
          //   label: "内容分类",
          //   placeholder: "请输入内容分类",
          //   value: self.state.tempFilter.message_type || undefined,
          //   width: 150,
          //   onChange(evt) {
          //     self.onInputChanged("message_type", Number(evt.target.value));
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
      }
    },
    table: {
      rowKey: "id",
      columns,
      dataSource: self.state.messageContentList,
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
