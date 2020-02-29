
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { BaseReact } from 'components/BaseReact';
import { List, Tabs, Tag, Spin } from 'antd';
import { Account } from '../index';
import './index.scss';

const { TabPane, } = Tabs;

interface IDetailTabsProps {
  id: number;
}

interface IDetailTabsState {
  accountDetail: Account | null;
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

export default class DetailTabsModal extends BaseReact<IDetailTabsProps, IDetailTabsState> {
  state: IDetailTabsState = {
    accountDetail: null,
    loginLogs: [],
    logLoading: false,
    logHasMore: true,
    logPage: 1,
  }

  componentDidMount() {
    this.getAccountDetail();
    this.getAccountLoginLog();
  }

  getAccountDetail = async () => {
    const res = await this.$api.account.getAccountDetail(this.props.id);
    this.setState({
      accountDetail: res.data,
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
    const { accountDetail, logLoading, logHasMore, loginLogs, } = this.state;
    return (
      <Tabs defaultActiveKey="1" className="account-detail-tabs" size="small">
        <TabPane tab="个人资料" key="1">
          {
            accountDetail ? (
              <List size="small">
                <List.Item><Tag color="blue">生日</Tag>{accountDetail.birth}</List.Item>
                <List.Item><Tag color="blue">电话</Tag>{accountDetail.mobile}</List.Item>
                <List.Item><Tag color="blue">国籍</Tag>{accountDetail.nationality_name}</List.Item>
                <List.Item><Tag color="blue">居住国</Tag>{accountDetail.country_of_residence_name}</List.Item>
                <List.Item><Tag color="blue">城市</Tag>{accountDetail.city}</List.Item>
                <List.Item><Tag color="blue">街道</Tag>{accountDetail.street}</List.Item>
                <List.Item><Tag color="blue">街道</Tag>{accountDetail.postal}</List.Item>
              </List>
            ) : <Spin />
          }
        </TabPane>
        <TabPane tab="最近登录" key="2">
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
                <div className="log-loading-container">
                  <Spin />
                </div>
              )}
            </List>
          </InfiniteScroll>
        </TabPane>
      </Tabs>
    );
  }
}