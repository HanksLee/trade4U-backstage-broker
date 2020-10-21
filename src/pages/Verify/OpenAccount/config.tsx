import utils from "utils";
import * as React from "react";
import { Button, Icon, Popconfirm } from "antd";
import moment from "moment";
import { FORMAT_TIME } from "constant";

const config = self => {

  const columns = [
    {
      title: "用户名",
      width: 200,
      dataIndex: "username",
      render: (text, record) => {
        return record.username || "--";
      },
      // fixed: "left"
    },
    {
      title: "手机号",
      width: 200,
      dataIndex: "phone",
      render: (text, record) => {
        return record.phone || "--";
      },
    },
    {
      title: "身分证",
      width: 200,
      dataIndex: "id_card",
      render: (text, record) => {
        return record.id_card || "--";
      },
    },
    {
      title: "身分证正面",
      width: 200,
      dataIndex: "id_card_front",
      render: (text, record) => {
        return <img
          src={record.id_card_front} 
          onClick={() => { window.open(record.id_card_front, "_blank", "width=500,height=500", false); }}
        /> || "--";
      },
    },
    {
      title: "身分证反面",
      width: 200,
      dataIndex: "id_card_back",
      render: (text, record) => {
        return <img
          src={record.id_card_back} 
          onClick={() => { window.open(record.id_card_back, "_blank", "width=500,height=500", false); }}
        /> || "--";
      },
    },
    {
      title: "开户时间",
      width: 200,
      dataIndex: "create_time",
      render: (text, record) => {
        return utils.timestampFormatDate(text, FORMAT_TIME);
      },
    },
    {
      title: "审核状态",
      width: 200,
      dataIndex: "inspect_status",
      render: (text, record) => {
        switch (record.inspect_status) {
          case 0:
            return "未审核";
            break;
          case 1:
            return "待审核";
            break;
          case 2:
            return "审核通过";
            break;
          case 3:
            return "审核失败";
            break;
          default:
            return "--";
        }
      },
    },
    {
      title: "审核时间",
      width: 200,
      dataIndex: "inspect_time",
      render: (text, record) => {
        return (
          (record.inspect_time &&
            moment(record.inspect_time * 1000).format(FORMAT_TIME)) ||
          "--"
        );
      },
    },
    {
      title: "开户时间",
      width: 200,
      dataIndex: "create_time",
      render: (text, record) => {
        return (
          (record.create_time &&
            moment(record.create_time * 1000).format(FORMAT_TIME)) ||
          "--"
        );
      },
    },
    {
      title: "审核人",
      width: 200,
      dataIndex: "inspect_person",
      render: (text, record) => {
        return record.inspect_person || "--";
      },
    },
    {
      title: "审核原因",
      width: 300,
      dataIndex: "inspect_reason",
      render: (text, record) => {
        return record.reason || "--";
      },
    },
    // {
    //   title: "启用",
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
      width: 200,
      fixed: "right",
      render: (text, record) => {
        return (
          <div className="common-list-table-operation">
            <span onClick={() => self.showEditVerifyModal(record)}>编辑</span>
            <span className="common-list-table-operation-spliter"></span>
            {/* <span onClick={() => self.goToPermissionEditor(record.id)}>
              授权
            </span>
            <span className="common-list-table-operation-spliter"></span>
            <span onClick={() => self.brokerLogin(record.id)}>登录</span>
            <span className="common-list-table-operation-spliter"></span> */}
            <Popconfirm
              title="请问是否确定删除此用户"
              onConfirm={() => self.deleteVerify(record.id)}
              onCancel={() => { }}
            >
              <span>删除</span>
            </Popconfirm>
          </div>
        );
      },
    }
  ];

  const columnsWidth = columns.reduce(function (total, cur) {
    return total + cur.width;
  }, 0);

  const pagination = {
    ...self.props.common.paginationConfig,
    total: self.state.total,
    current: self.props.verify.filter.page,
    pageSize: self.props.verify.filter.page_size,
    onChange: (current, pageSize) => { },
    onShowSizeChange: (current, pageSize) => {
      self.getDataList({
        page_size: pageSize,
        page: current,
      });
    },
  };

  return {
    
    // 是否显示增加按钮
    // addBtn: {
    //   title: () => (
    //     <Button type="primary" onClick={() => self.showEditUserModal()}>
    //       <Icon type="plus" /> 添加
    //     </Button>
    //   )
    // },
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

      // widgets: [
      //   [
      //     {
      //       type: "Input",
      //       label: "券商名称",
      //       placeholder: "请输入券商名称",
      //       value: self.state.tempFilter.name || undefined,
      //       onChange(evt) {
      //         self.onInputChanged("name", evt.target.value);
      //       },
      //       onPressEnter(evt) {
      //         self.onSearch();
      //       }
      //     }
      //   ]
      // ],
      onSearch() {
        self.onSearch();
      },
      onReset() {
        self.onReset();
      },
    },
    table: {
      rowKey: "id",
      scroll: { x: columnsWidth, },
      columns,
      dataSource: self.state.verifyList,
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
