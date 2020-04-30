import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { List } from 'antd';
import { inject, observer } from 'mobx-react';
import '../../index.scss';

const ListItem = List.Item;

// @ts-ignore
@inject('common', 'openOrder')
@observer
export default class OpenOrderDetail extends BaseReact<{}> {
  state = {
    orderDetail: null,
    formula: null,
  }

  componentDidMount() {
    const { location, } = this.props;
    const search = this.$qs.parse(location.search);
    this.getOpenOrderDetail(search.id);
    this.getOrderFormula(search.id);
  }

  getOpenOrderDetail = async (id: string) => {
    const res = await this.$api.order.getOpenOrderDetail(id);
    this.setState({
      orderDetail: res.data,
    });
  }

  getOrderFormula = async (id) => {
    const res = await this.$api.order.getOrderFormula(id);
    this.setState({
      formula: res.data,
    });
  }

  renderOrder = () => {
    const { orderDetail, formula, } = this.state;

    if (!orderDetail || !formula) return null;

    return (
      <List
        className="order-list"
        header={<>{`${formula.description}=${formula.amount},${formula.create_time}`}</>}
      >
        <ListItem><span>产品类型</span> {orderDetail.symbol_type_name}</ListItem>
        <ListItem><span>产品名称</span> {orderDetail.symbol_name}</ListItem>
      </List>
    );
  }

  goBack = () => {
    this.props.history.goBack();
  }

  render() {
    return (
      <div className='editor food-card-editor'>
        <section className='editor-content panel-block'>
          {this.renderOrder()}
        </section>
      </div>
    );
  }
}