import React from "react";
import {
  Button,
  Select,
  Input,
  Table,
  DatePicker,
  Checkbox,
  Icon,
  Pagination,
  Spin,
  Tag
} from "antd";

// ! 栏位名是暂定的，因为后端 api 还没做
// TODO: 串接后端 api 栏位名
const columns = [
  {
    title: "名字",
    dataIndex: "名字",
    key: "名字",
  },
  {
    title: "手机号",
    dataIndex: "手机号",
    key: "手机号",
  },
  {
    title: "客户组",
    dataIndex: "客户组",
    key: "客户组",
  },
  {
    title: "新股申购名称",
    dataIndex: "新股申购名称",
    key: "新股申购名称",
  },
  {
    title: "数量",
    dataIndex: "数量",
    key: "数量",
  },
  {
    title: "申购金额",
    dataIndex: "申购金额",
    key: "申购金额",
  },
  {
    title: "融资比例",
    dataIndex: "融资比例",
    key: "融资比例",
  },
  {
    title: "融资金额",
    dataIndex: "融资金额",
    key: "融资金额",
  },
  {
    title: "已冻结资金",
    dataIndex: "已冻结资金",
    key: "已冻结资金",
  },
  {
    title: "状态",
    dataIndex: "状态",
    key: "状态",
  },
  {
    title: "申购日期",
    dataIndex: "申购日期",
    key: "申购日期",
  },
  {
    title: "中签公布日",
    dataIndex: "中签公布日",
    key: "中签公布日",
  },
  {
    title: "中签状态",
    dataIndex: "中签状态",
    key: "中签状态",
  },
  {
    title: "中签数量",
    dataIndex: "中签数量",
    key: "中签数量",
    render: (text, record, index) => {
      console.log("text,record :>> ", text, record);
      if (record["中签状态"] === "已中签") {
        return <input />;
      }
    },
  }
];
const dataSource = [
  {
    key: 1,
    名字: "张维",
    手机号: "123456",
    客户组: "测试组",
    新股申购名称: "众望布艺",
    数量: "1",
    申购金额: "12500",
    融资比例: "60%",
    融资金额: "7500",
    已冻结资金: "7500",
    状态: "申购中",
    申购日期: "2020-8-15",
    中签公布日: "2020-8-30",
    中签状态: "未中签",
    中签数量: "",
  },
  {
    key: 2,
    名字: "李星星",
    手机号: "3345678",
    客户组: "测试组",
    新股申购名称: "众望布艺",
    数量: "1",
    申购金额: "12500",
    融资比例: "60%",
    融资金额: "7500",
    已冻结资金: "7500",
    状态: "申购中",
    申购日期: "2020-8-15",
    中签公布日: "2020-8-30",
    中签状态: "已中签",
    中签数量: "",
  }
];
class LotteryList extends React.Component {
  state = {};
  renderFilter = () => {
    return (
      <div style={{ display: "flex", }}>
        <div>
          <div>
            用户名: <Input placeholder="请输入品种名称"></Input>
          </div>
          <div>
            手机: <Input placeholder="请输入产品编码"></Input>
          </div>
          <div>
            新股申购名称:
            <Select
              placeholder="请选择新股名称"
              style={{ width: "100%", }}
            ></Select>
          </div>
          <div>
            状态:
            <Select placeholder="请选择状态" style={{ width: "100%", }}></Select>
          </div>
          <div>
            中签状态:
            <Select placeholder="已中签" style={{ width: "100%", }}></Select>
          </div>
        </div>
        <div>
          <Button>查询</Button>
          <Button>重置</Button>
        </div>
      </div>
    );
  };
  render() {
    return (
      <div className="common-list">
        {this.renderFilter()}
        <section className="common-list-table">
          <Table columns={columns} dataSource={dataSource} />
        </section>
      </div>
    );
  }
}

export default LotteryList;
