import moment from 'moment';
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Table } from 'antd';

interface IOrderListProps {
  userId: number;
  type: 'open' | 'close';
}

interface IOrderListState {
  orderList: {}[];
}

export default class OrderList extends BaseReact<IOrderListProps, IOrderListState> {
  state: IOrderListState = {
    orderList: [],
  }

  componentDidMount() {
    this.getOrderList();
  }

  getOrderList = async () => {
    const { userId, type, } = this.props;
    const getOrderList = type === 'open' ? this.$api.order.getOpenOrderList :  this.$api.order.getCloseOrderList;
    const res = await getOrderList({
      params: {
        user: userId,
        pageSize: 200,
      },
    });
    this.setState({
      orderList: res.data.results,
    });
  }

  getColumns = () => {
    return ;
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