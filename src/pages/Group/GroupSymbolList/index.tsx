import EditSymbolTypeModal from '../EditSymbolTypeModal';
import WithRoute from 'components/WithRoute';
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { ColumnProps } from "antd/lib/table";
import { inject, observer } from "mobx-react";
import { Button, Icon, Popconfirm, Table } from 'antd';

export interface SymbolType {
  id: string;
  group: string;
  symbol_type: number;
  action: string[];
  max_trading_volume: number;
  min_trading_volume: number;
  taxes: number;
  standard: number;
  leverage: number;
}

interface PermissionListState {
  symbolTypeList: SymbolType[];
  currentSymbolType: SymbolType | null;
  isShowEditSymbolTypeModal: boolean;
};

/* eslint new-cap: "off" */
@WithRoute("/dashboard/group/symbol", { exact: false, })
@inject("common", "group")
@observer
export default class PermissionList extends BaseReact<{}, PermissionListState> {
  groupId: string
  state = {
    symbolTypeList: [],
    currentSymbolType: null,
    isShowEditSymbolTypeModal: false,
  };

  constructor(props) {
    super(props);
    this.groupId = this.$qs.parse(this.props.location.search).id;
  }
  

  async componentDidMount() {
    this.getDataList();
  }

  getDataList = async () => {
    const res = await this.$api.group.getGroupSymbolTypeList({ params: { group: this.groupId, }, });
    this.setState({
      symbolTypeList: res.data,
    });
  };

  showEditSymbolTypeModal = (record?: any): void => {
    this.setState({
      currentSymbolType: record ? record : null,
      isShowEditSymbolTypeModal: true,
    });
  }

  hideEditSymbolTypeModal = () => {
    this.setState({
      currentSymbolType: null,
      isShowEditSymbolTypeModal: false,
    });
  }

  handleEditSymbolType = () => {
    this.hideEditSymbolTypeModal();
    this.getDataList();
  }

  deleteSymbolType = async (id: string) => {
    const res = await this.$api.group.deleteGroupSymbolType(id);
    if (res.status === 204) {
      this.getDataList();
    } else {
      this.$msg.error(res.data.message);
    }
  }

  getTableColumns = (): ColumnProps<SymbolType>[] => {
    return [
      {
        key: "id",
        title: "id",
        dataIndex: "id",
      },
      {
        key: "action",
        title: "买卖方向",
        dataIndex: "action",
        render: text => {
          return text.map(item => item === '1' ? '做空' : '做多').join('、');
        },
      },
      {
        key: "max_trading_volume",
        title: "最大交易量",
        dataIndex: "max_trading_volume",
      },
      {
        key: "min_trading_volume",
        title: "最小交易量",
        dataIndex: "min_trading_volume",
      },
      {
        key: "taxes",
        title: "加收手续费(百分比)",
        dataIndex: "taxes",
      },
      {
        key: "standard",
        title: "交易成本每手加收(百分比)",
        dataIndex: "standard",
      },
      {
        key: "leverage",
        title: "杠杆",
        dataIndex: "leverage",
      },
      {
        key: "actions",
        title: "操作",
        render: (_, record) => {
          return (
            <div className="common-list-table-operation">
              <span onClick={() => this.showEditSymbolTypeModal(record)}>编辑</span>
              <span className="common-list-table-operation-spliter" />
              <Popconfirm
                title="确认删除？"
                onConfirm={() => this.deleteSymbolType(record.id)}
              >
                <span>删除</span>
              </Popconfirm>
            </div>
          );
        },
      }
    ];
  };

  goBack = () => {
    this.props.history.goBack();
    this.props.getGroupList();
  }

  render() {
    const { symbolTypeList, currentSymbolType, isShowEditSymbolTypeModal, } = this.state;
    return (
      <div className="panel-block common-list">
        <section className='common-list-addbtn'>
          <Button type="primary" onClick={() => this.showEditSymbolTypeModal()}>
            <Icon type="plus" /> 添加
          </Button>
          <Button onClick={() => this.goBack()}>取消</Button>
        </section>
        <section className="common-list-table">
          <Table
            rowKey="id"
            columns={this.getTableColumns()}
            dataSource={symbolTypeList}
            pagination={false}
          />
        </section>
        {
          isShowEditSymbolTypeModal && (
            <EditSymbolTypeModal
              groupId={this.groupId}
              symbolType={currentSymbolType}
              onOk={this.handleEditSymbolType}
              onCancel={this.hideEditSymbolTypeModal}
            />
          )
        }
      </div>
    );
  }
}
