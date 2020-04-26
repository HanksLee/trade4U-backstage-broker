import moment from 'moment';
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Table } from 'antd';

interface ICloseOrderListProps {
  id: number;
}

interface ICloseOrderListState {
  orderList: {}[];
}

export default class CloseOrderList extends BaseReact<ICloseOrderListProps, ICloseOrderListState> {
  state: ICloseOrderListState = {
    orderList: [],
  }

  componentDidMount() {
    this.getOrderList();
  }

  getOrderList = async (page = 1) => {
    const res = await this.$api.order.getCloseOrderList({
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