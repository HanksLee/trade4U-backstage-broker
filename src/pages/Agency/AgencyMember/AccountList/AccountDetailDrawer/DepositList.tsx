
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { List, Spin } from 'antd';

interface IDepositListProps {
  id: number;
  name: string;
}

interface IDepositListState {
  depositList: {
    id: string;
    expect_amount: number;
    status: number;
    create_time: number;
  }[];
  loading: boolean;
  hasMore: boolean;
  page: number;
}

export default class DetailTabsModal extends BaseReact<IDepositListProps, IDepositListState> {
  state: IDepositListState = {
    depositList: [],
    loading: false,
    hasMore: true,
    page: 1,
  }

  componentDidMount() {
    this.getDepositList();
  }

  getDepositList = async (page = 1) => {
    this.setState({
      loading: true,
    });
    const res = await this.$api.finance.getDepositList({
      params: {
        user__username: this.props.name,
        page_size: 10,
        page,
      },
    });
    this.setState({
      depositList: [...this.state.depositList, ...res.data.results],
      loading: false,
      hasMore: !!res.data.next,
      page: res.data.current_page,
    });
  }

  loadMoreLoginLogs = () => {
    this.getDepositList(this.state.page + 1);
  }

  render() {
    const { loading, hasMore, depositList, } = this.state;
    return (
      <div style={{ height: '260px', overflow: 'auto', }}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.loadMoreLoginLogs}
          hasMore={!loading && hasMore}
          useWindow={false}
        >
          <List size="small">
            <List.Item key="title">
              <div>金额</div>
              <div>状态</div>
              <div>创建时间</div>
            </List.Item>
            {
              depositList.map(item => {
                return (
                  <List.Item key={item.id}>
                    <div>{item.expect_amount}</div>
                    <div>{item.status === 1 ? '已支付' : '未支付'}</div>
                    <div>{moment(item.create_time * 1000).format('YYYY-MM-DD hh:mm:ss')}</div>
                  </List.Item>
                );
              })
            }
            {loading && hasMore && (
              <div className="list-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    );
  }
}