
import * as React from 'react';
import DetailTabs from './DetailTabs';
import { BaseReact } from 'components/BaseReact';
import { Collapse, Drawer } from 'antd';

interface IAccountDetailDrawerProps {
  id: number;
  name: string;
  onClose: () => void;
}

interface IAccountDetailDrawertate {
  
}

export default class AccountDetailModal extends BaseReact<IAccountDetailDrawerProps, IAccountDetailDrawertate> {
  state: IAccountDetailDrawertate = {
    accountDetail: null,
  }

  async componentDidMount() {

  }

  render() {
    const props = this.props;

    return (
      <Drawer
        title="客户详情"
        placement="right"
        closable={false}
        visible={true}
        onClose={props.onClose}
        width={650}
        bodyStyle={{ padding: '20px', }}
      >
        <h3 style={{ marginBottom: '15px', }}>{props.name}</h3>
        <DetailTabs id={props.id} />
        <Collapse style={{ margin: '15px 0', }}>
          <Collapse.Panel key="money" header="最近出入金">
            <p>1</p>
          </Collapse.Panel>
        </Collapse>
        <Collapse style={{ marginBottom: '15px', }}>
          <Collapse.Panel key="money2" header="最近出入金2">
            <p>1</p>
          </Collapse.Panel>
        </Collapse>
      </Drawer>
    );
  }
}