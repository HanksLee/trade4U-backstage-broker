
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Account } from '../index';
import { BaseReact } from 'components/BaseReact';
import { Card, Descriptions, Drawer, List, Spin, Row, Col } from 'antd';
import './index.scss';

interface IAccountDetailDrawerProps {
  id: number;
  name: string;
  onClose: () => void;
}

interface IAccountDetailDrawertate {
  accountDetail: Account | null;
  metaFund: any;
  loginLogs: {
    id: string;
    platform: string;
    ip: string;
    create_time: number;
  }[];
  logLoading: boolean;
  logHasMore: boolean;
  logPage: number;
}

export default class AccountDetailModal extends BaseReact<IAccountDetailDrawerProps, IAccountDetailDrawertate> {
  state: IAccountDetailDrawertate = {
    accountDetail: null,
    metaFund: null,
    loginLogs: [],
    logLoading: false,
    logHasMore: true,
    logPage: 1,
  }

  componentDidMount() {
    this.getAccountDetail();
    this.getAccountMetaFund();
    this.getAccountLoginLog();
  }

  getAccountDetail = async () => {
    const res = await this.$api.account.getAccountDetail(this.props.id);
    this.setState({
      accountDetail: res.data,
    });
  }

  getAccountMetaFund = async () => {
    const res = await this.$api.account.getAccountMetaFund(this.props.id);
    this.setState({
      metaFund: res.data,
    });
  }

  getAccountLoginLog = async (page = 1) => {
    this.setState({
      logLoading: true,
    });
    const res = await this.$api.account.getAccountLoginLog(this.props.id, { params: { page_size: 10, page, }, });
    this.setState({
      loginLogs: [...this.state.loginLogs, ...res.data.results],
      logLoading: false,
      logHasMore: !!res.data.next,
      logPage: res.data.current_page,
    });
  }

  loadMoreLoginLogs = () => {
    this.getAccountLoginLog(this.state.logPage + 1);
  }

  render() {
    const props = this.props;
    const { accountDetail, metaFund, logLoading, logHasMore, loginLogs, } = this.state;

    return (
      <Drawer
        title="客户详情"
        placement="right"
        closable={false}
        visible={true}
        onClose={props.onClose}
        width={900}
        bodyStyle={{ padding: '20px', }}
      >
        <h3 style={{ marginBottom: '15px', }}>{props.name}</h3>
        {
          metaFund && (
            <div className="meta-fund" style={{ marginBottom: '25px', }}>
              <div>
                <div><span>资金余额:</span><span>{metaFund.balance}</span></div>
                <div><span>预付款:</span><span>{metaFund.margin}</span></div>
                <div><span>可用预付款:</span><span>{metaFund.free_margin}</span></div>
              </div>
              <div>
                <div><span>推广返佣:</span><span>{metaFund.total_commission}</span></div>
                <div><span>已返佣金:</span><span>{metaFund.commission}</span></div>
                <div><span>浮动盈亏:</span><span>{metaFund.float_profit}</span></div>
              </div>
              <div>
                <div><span>盈利笔数:</span><span>{metaFund.profitable_order}</span></div>
                <div><span>亏损笔数:</span><span>{metaFund.loss_order}</span></div>
                <div><span>总笔数:</span><span>{metaFund.total_order}</span></div>
              </div>
              <div>
                <div><span>总入金:</span><span>{metaFund.deposit}</span></div>
                <div><span>总出金:</span><span>{metaFund.deposit}</span></div>
                <div><span>净入金:</span><span>{metaFund.net_deposit}</span></div>
              </div>
              <div>
                <div><span>净值:</span><span>{metaFund.equity}</span></div>
                <div><span>预付款比例:</span><span>{metaFund.margin_level}</span></div>
              </div>
            </div>
          )
        }
        <Row gutter={12}>
          <Col span={12}>
            <Card size="small" title="个人资料" style={{ height: '280px', }}>
              {
                accountDetail && (
                  <div className="account-detail-list">
                    <p><span>生日</span>{accountDetail.birth}</p>
                    <p><span>电话</span>{accountDetail.mobile}</p>
                    <p><span>国籍</span>{accountDetail.nationality_name}</p>
                    <p><span>居住国</span>{accountDetail.country_of_residence_name}</p>
                    <p><span>城市</span>{accountDetail.city}</p>
                    <p><span>街道</span>{accountDetail.street}</p>
                    <p><span>邮编</span>{accountDetail.postal}</p>
                  </div>
                )
              }
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="最近登录" style={{ height: '280px', overflow: 'scroll', }}>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={this.loadMoreLoginLogs}
                hasMore={!logLoading && logHasMore}
                useWindow={false}
              >
                <List
                  dataSource={loginLogs}
                  renderItem={item => (
                    <List.Item key={item.id}>
                      <div>{item.platform}</div>
                      <div>{item.ip}</div>
                      <div>{item.create_time}</div>
                    </List.Item>
                  )}
                >
                  {logLoading && logHasMore && (
                    <div className="list-loading-container">
                      <Spin />
                    </div>
                  )}
                </List>
              </InfiniteScroll>
            </Card>
          </Col>
        </Row>
      </Drawer>
    );
  }
}