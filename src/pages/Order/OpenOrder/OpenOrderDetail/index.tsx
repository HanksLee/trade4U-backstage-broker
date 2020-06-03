import * as React from 'react';
import moment from 'moment';
import { BaseReact } from 'components/BaseReact';
import { Button, Card, Menu, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import '../../index.scss';

// @ts-ignore
@inject('common', 'openOrder')
@observer
export default class OpenOrderDetail extends BaseReact<{}> {
  orderNumber = '';
  state = {
    orderDetail: null,
    formula: null,
    transactionChoices: [],
    currentTransactionChoice: null,
  }

  constructor(props) {
    super(props);
    const { location, } = this.props;
    const search = this.$qs.parse(location.search);
    this.orderNumber = search.id;
  }
  

  async componentDidMount() {
    this.getOpenOrderDetail();
    this.getOrderTransactionChoices();
  }

  getOpenOrderDetail = async () => {
    const res = await this.$api.order.getOpenOrderDetail(this.orderNumber);
    this.setState({
      orderDetail: res.data,
    });
  }

  getOrderTransactionChoices = async() => {
    const res = await this.$api.common.getConstantByKey('ORDER_TRANSACTION_CHOICES');
    const data = res.data.data;
    this.setState({
      transactionChoices: data,
      currentTransactionChoice: data[0].field || null,
    });

    if (data[0]) {
      this.getOrderFormula(data[0].field);
    }
  }

  getOrderFormula = async (cause: string) => {
    const res = await this.$api.order.getOrderFormula(this.orderNumber, {
      params: {
        cause,
      },
    });
    this.setState({
      formula: res.data,
    });
  }

  renderOrderDetail = () => {
    const { orderDetail, } = this.state;

    if (!orderDetail) return null;

    return (
      <Card title="订单详情">
        <div className="order-list">
          {
            orderDetail ? (
              <>
                <div>
                  <div><span>产品类型</span> {orderDetail.symbol_type_name}</div>
                  <div><span>产品名称</span> {orderDetail.symbol_name}</div>
                  <div><span>产品杠杆</span> {orderDetail.leverage}</div>
                  <div><span>止损</span> {orderDetail.stop_loss}</div>
                  <div><span>税金</span> {orderDetail.taxes}</div>
                </div>
                <div>
                  <div><span>交易方向</span> {orderDetail.action}</div>
                  <div><span>开仓价</span> {orderDetail.open_price}</div>
                  <div><span>开仓时间</span> {moment(orderDetail.create_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
                  <div><span>手续费</span> {orderDetail.fee}</div>
                  <div><span>当前价格</span> {orderDetail.new_price}</div>
                </div>
                <div>
                  <div><span>交易手数</span> {orderDetail.lots}</div>
                  <div><span>合约量</span> {orderDetail.trading_volume}</div>
                  <div><span>止盈</span> {orderDetail.take_profit}</div>
                  <div><span>库存费</span> {orderDetail.swaps}</div>
                  <div><span>当前盈亏</span> {orderDetail.profit}</div>
                </div>
              </>
            ) : null
          }
        </div>
      </Card>
    );
  }

  goBack = () => {
    this.props.history.goBack();
    this.props.getDataList();
  }

  getFormulaColumns = () => {
    const columns = [
      {
        title: '公式',
        dataIndex: 'description',
        render: (text, { amount, }) => {
          return `${text}=${amount}`;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        render: (text) => moment(text * 1000).format('YYYY-MM-DD HH:mm:ss'),
      }
    ];
    return columns;
  }

  changeTransactionChoice = (e) => {
    this.setState({
      currentTransactionChoice: e.key,
    });
    this.getOrderFormula(e.key);
  }

  render() {
    const { currentTransactionChoice, transactionChoices, formula, } = this.state;
    return (
      <div className='editor food-card-editor'>
        <section className='editor-content panel-block'>
          <Button onClick={this.goBack} style={{ marginBottom: '10px', }}>返回</Button>
          {this.renderOrderDetail()}
          <Menu
            selectedKeys={[currentTransactionChoice]}
            style={{ marginTop: '20px', }}
            mode="horizontal"
            onClick={this.changeTransactionChoice}
          >
            {
              transactionChoices.map(choice => {
                return <Menu.Item key={choice.field}>{choice.translation}</Menu.Item>;
              })
            }
          </Menu>
          <Table
            rowKey="id"
            columns={this.getFormulaColumns()}
            dataSource={formula}
            pagination={false}
          />
        </section>
      </div>
    );
  }
}