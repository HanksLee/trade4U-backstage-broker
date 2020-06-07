import utils from "utils";
import * as React from "react";
import { Button, Icon, Popconfirm, Checkbox } from "antd";
import moment from "moment";
import { FORMAT_TIME } from "constant";

const config = self => {
  const permissions = self.props.common.permissions;
  const columns = [
    {
      title: "类型",
      dataIndex: "type",
      render: (text, record) => {
        return text || "-";
      },
    },
    {
      title: "API key",
      dataIndex: "key",
      render: (text, record) => {
        return text || "-";
      },
    },
    {
      title: "启用",
      dataIndex: "status",
      render: (text, record) => {
        const handleChange = async e => {
          const res = await self.$api.sms.updateSMSChannel(record.id, {
            status: text == 0 ? 1 : 0,
          });
          if (res.status === 200) {
            self.getDataList(self.props.sms.filterChannel);
          } else {
            self.$msg.error(res.data.message);
          }
        };
        return <Checkbox checked={text} onChange={handleChange} />;
      },
    },
    {
      title: "额外参数",
      dataIndex: "extra_params",
      render: (text, record) => {
        if (record["extra_params"]) {
          const extra_params = JSON.parse(record["extra_params"]);
          let extra_params_str = "";
          for (let item in extra_params) {
            extra_params_str += `${extra_params[item]}:${item};`;
          }

          return extra_params_str;
        } else {
          return "-";
        }
      },
    },
    {
      title: "描述",
      dataIndex: "description",
      render: (text, record) => {
        return text || "-";
      },
    },
    {
      title: "类型(翻译后)",
      dataIndex: "type_display",
      render: (text, record) => {
        return text || "-";
      },
    },

    {
      title: "操作",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            {permissions.indexOf("change_sms_channel") !== -1 && (
              <span onClick={() => self.showEditSMSChannelModal(record)}>
                编辑
              </span>
            )}
            {permissions.indexOf("delete_sms_channel") !== -1 && (
              <>
                <span className="common-list-table-operation-spliter"></span>
                <Popconfirm
                  title="请问是否确定删除此通道"
                  onConfirm={() => self.deleteSMSChannel(record.id)}
                  onCancel={() => {}}
                >
                  <span>删除</span>
                </Popconfirm>
              </>
            )}
          </div>
        );
      },
    }
  ];
  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.sms.filterChannel.page,
    pageSize: self.props.sms.filterChannel.page_size,
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
      title: () => {
        return permissions.indexOf("add_sms_channel") !== -1 ? (
          <Button type="primary" onClick={() => self.showEditSMSChannelModal()}>
            <Icon type="plus" /> 添加
          </Button>
        ) : null;
      },
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
          self.onBatch && self.onBatch(value);
        },
      },

      widgets: [
        [
          // {
          //   type: "Input",
          //   label: "所属key",
          //   placeholder: "请输入所属key",
          //   value: self.state.tempFilter.key || undefined,
          //   width: 150,
          //   onChange(evt) {
          //     self.onInputChanged("key", evt.target.value);
          //   },
          //   onPressEnter(evt) {
          //     self.onSearch();
          //   }
          // },
          // {
          //   type: "Input",
          //   label: "名称",
          //   placeholder: "请输入名称",
          //   value: self.state.tempFilter.title || undefined,
          //   width: 150,
          //   onChange(evt) {
          //     self.onInputChanged("title", evt.target.value);
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
      },
    },
    table: {
      rowKey: "id",
      columns,
      dataSource: self.state.smsChannelList,
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
