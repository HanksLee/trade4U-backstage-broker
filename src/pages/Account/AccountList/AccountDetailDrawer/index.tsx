
import * as React from 'react';
import DepositList from './DepositList';
import DetailTabs from './DetailTabs';
import ws from 'utils/ws';
import OpenOrderList from './OpenOrderList';
import CloseOrderList from './CloseOrderList';
import { BaseReact } from 'components/BaseReact';
import { Collapse, Descriptions, Drawer } from 'antd';

interface IAccountDetailDrawerProps {
  id: number;
  name: string;
  onClose: () => void;
}

interface IAccountDetailDrawertate {
  metaFund: any;
}

export default class AccountDetailModal extends BaseReact<IAccountDetailDrawerProps, IAccountDetailDrawertate> {
  wsConnect = null

  state: IAccountDetailDrawertate = {
    metaFund: null,
  }

  async componentDidMount() {
    const res = await this.$api.account.getAccountMetaFund(this.props.id);
    this.setState({
      metaFund: res.data,
    });
    this.connnetWs();
  }

  componentWillUnmount() {
    this.wsConnect.close();
  }

  connnetWs = () => {
    this.wsConnect = ws(`account/${this.props.id}/info`);
    this.wsConnect.onmessage = (event) => {
      const message = event.data;
      const data = JSON.parse(message).data;

      if (data.type === 'meta_fund' && data.data) {
        this.setState({
          metaFund: data.data,
        });
      }
    };
  }

  render() {
    const props = this.props;
    const { metaFund, } = this.state;

    return (
      <Drawer
        title="客户详情"
        placement="right"
        closable={false}
        visible={true}
        onClose={props.onClose}
        width={850}
        bodyStyle={{ padding: '20px', }}
      >
        <h3 style={{ marginBottom: '15px', }}>{props.name}</h3>
        {
          metaFund && (
            <Descriptions>
              <Descriptions.Item label="余额">{metaFund.balance}</Descriptions.Item>
              <Descriptions.Item label="净值">{metaFund.equity}</Descriptions.Item>
              <Descriptions.Item label="预付款">{metaFund.margin}</Descriptions.Item>
              <Descriptions.Item label="可用预付款">{metaFund.free_margin}</Descriptions.Item>
              <Descriptions.Item label="预付款比例">{metaFund.margin_level}</Descriptions.Item>
            </Descriptions>
          )
        }
        <DetailTabs id={props.id} />
        <Collapse style={{ margin: '15px 0', }}>
          <Collapse.Panel key="money" header="最近出入金">
            <DepositList name={props.name} />
          </Collapse.Panel>
          <Collapse.Panel key="money" header="持仓订单">
            <OpenOrderList id={props.id} />
          </Collapse.Panel>
          <Collapse.Panel key="money" header="平仓订单">
            <CloseOrderList id={props.id} />
          </Collapse.Panel>
        </Collapse>
      </Drawer>
    );
  }
}