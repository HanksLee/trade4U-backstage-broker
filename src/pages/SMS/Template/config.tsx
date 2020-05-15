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
      title: "短信内容",
      dataIndex: "content",
      render: (text, record) => {
        return text || "-";
      },
    },
    {
      title: "启用",
      dataIndex: "status",
      render: (text, record) => {
        const handleChange = async e => {
          const res = await self.$api.sms.updateSMSTemplate(record.id, {
            status: text == 0 ? 1 : 0,
          });
          if (res.status === 200) {
            self.getDataList(self.props.sms.filterTemplate);
          } else {
            self.$msg.error(res.data.message);
          }
        };
        return <Checkbox checked={text} onChange={handleChange} />;
      },
    },
    {
      title: "操作",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            {permissions.indexOf("change_sms_template") !== -1 && (
              <span onClick={() => self.showEditSMSTemplateModal(record)}>
                编辑
              </span>
            )}

            {permissions.indexOf("delete_sms_template") !== -1 && (
              <>
                <span className="common-list-table-operation-spliter"></span>
                <Popconfirm
                  title="请问是否确定删除此通道模版"
                  onConfirm={() => self.deleteSMSTemplate(record.id)}
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
    current: self.props.sms.filterTemplate.page,
    pageSize: self.props.sms.filterTemplate.page_size,
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
        return permissions.indexOf("add_sms_template") !== -1 ? (
          <Button
            type="primary"
            onClick={() => self.showEditSMSTemplateModal()}
          >
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
      dataSource: self.state.smsTemplateList,
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
