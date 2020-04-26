import moment from 'moment';
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Table } from 'antd';

interface IOpenOrderListProps {
  id: number;
}

interface IOpenOrderListState {
  orderList: {}[];
}

export default class OpenOrderList extends BaseReact<IOpenOrderListProps, IOpenOrderListState> {
  state: IOpenOrderListState = {
    orderList: [],
  }

  componentDidMount() {
    this.getOrderList();
  }

  getOrderList = async (page = 1) => {
    const res = await this.$api.order.getOpenOrderList({
      params: {
        user: this.props.id,
      },
    });
    this.setState({
      orderList: res.data,
    });
  }

  getColumns = () => {
    return [];
  }

  render() {
    const { orderList, } = this.state;
    return (
      <div style={{ height: '260px', overflow: 'auto', }}>
        <Table
          columns={this.getColumns()}
          dataSource={orderList}
          pagination={false}
        />
      </div>
    );
  }
}