import * as React from "react";
import InfiniteScroll from "react-infinite-scroller";
import moment from "moment";
import { Account } from "../index";
import { BaseReact } from "components/BaseReact";
import { Card, Drawer, List, Spin, Row, Col } from "antd";
import "./index.scss";

interface IAccountDetailDrawerProps {
  id: number;
  name: string;
  onClose: () => void;
}

interface IAccountDetailDrawertate {
  accountDetail: Account | null;
  symbolType: any;
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

export default class AccountDetailModal extends BaseReact<
IAccountDetailDrawerProps,
IAccountDetailDrawertate
> {
  state: IAccountDetailDrawertate = {
    accountDetail: null,
    symbolType: undefined,
    metaFund: null,
    loginLogs: [],
    logLoading: false,
    logHasMore: true,
    logPage: 1,
  };

  componentDidMount() {
    this.getAccountDetail();
    this.getAccountMetaFund();
    this.getAccountLoginLog();
  }

  getSymbolType = async () => {
    const res = await this.$api.product.getGenreList();
    this.setState({
      symbolType: res.data.results,
    });
  };

  getAccountDetail = async () => {
    const res = await this.$api.account.getAccountDetail(this.props.id);
    this.setState({
      accountDetail: res.data,
    });
  };

  getAccountMetaFund = async () => {
    const res = await this.$api.account.getAccountMetaFund(this.props.id);
    this.setState(
      {
        metaFund: res.data,
      },
      () => {
        this.getSymbolType();
      }
    );
  };

  getAccountLoginLog = async (page = 1) => {
    this.setState({
      logLoading: true,
    });
    const res = await this.$api.account.getAccountLoginLog(this.props.id, {
      params: { page_size: 10, page, },
    });
    this.setState({
      loginLogs: [...this.state.loginLogs, ...res.data.results],
      logLoading: false,
      logHasMore: !!res.data.next,
      logPage: res.data.current_page,
    });
  };

  loadMoreLoginLogs = () => {
    this.getAccountLoginLog(this.state.logPage + 1);
  };

  render() {
    const props = this.props;
    const {
      accountDetail,
      metaFund,
      logLoading,
      logHasMore,
      loginLogs,
      symbolType,
    } = this.state;

    return (
      <Drawer
        title="????????????"
        placement="right"
        closable={false}
        visible={true}
        onClose={props.onClose}
        width={900}
        bodyStyle={{ padding: "20px", }}
      >
        <h3 style={{ marginBottom: "15px", }}>{props.name}</h3>
        {metaFund && (
          <div className="meta-fund" style={{ marginBottom: "25px", }}>
            <div>
              <div>
                <span>????????????:</span>
                <span>{metaFund.balance}</span>
              </div>
              <div>
                <span>?????????:</span>
                <span>{metaFund.margin}</span>
              </div>
              <div>
                <span>???????????????:</span>
                <span>{metaFund.free_margin}</span>
              </div>
            </div>
            <div>
              <div>
                <span>????????????:</span>
                <span>{metaFund.total_commission}</span>
              </div>
              <div>
                <span>????????????:</span>
                <span>{metaFund.commission}</span>
              </div>
              <div>
                <span>????????????:</span>
                <span>{metaFund.float_profit}</span>
              </div>
            </div>
            <div>
              {/* <div><span>????????????:</span><span>{metaFund.profitable_order}</span></div>
                <div><span>????????????:</span><span>{metaFund.loss_order}</span></div> */}
              {symbolType &&
                symbolType.map((item, index) => {
                  return (
                    <div>
                      <span>{`${item.symbol_type_name}?????????:`}</span>
                      <span>{Object.values(metaFund.trading_data)[index]}</span>
                    </div>
                  );
                })}
              <div>
                <span>?????????:</span>
                <span>{metaFund.total_order}</span>
              </div>
            </div>
            <div>
              <div>
                <span>?????????:</span>
                <span>{metaFund.deposit}</span>
              </div>
              <div>
                <span>?????????:</span>
                <span>{metaFund.net_withdraw}</span>
              </div>
              <div>
                <span>?????????:</span>
                <span>{metaFund.net_deposit}</span>
              </div>
            </div>
            <div>
              <div>
                <span>??????:</span>
                <span>{metaFund.equity}</span>
              </div>
              <div>
                <span>???????????????:</span>
                <span>
                  {metaFund.margin_level === 0
                    ? "-"
                    : metaFund.margin_level + "%"}
                </span>
              </div>
            </div>
          </div>
        )}
        <Row gutter={12}>
          <Col span={12}>
            <Card size="small" title="????????????" style={{ height: "280px", }}>
              {accountDetail && (
                <div className="account-detail-list">
                  <p>
                    <span>??????</span>
                    {accountDetail.birth}
                  </p>
                  <p>
                    <span>??????</span>
                    {accountDetail.mobile}
                  </p>
                  <p>
                    <span>??????</span>
                    {accountDetail.nationality_name}
                  </p>
                  <p>
                    <span>?????????</span>
                    {accountDetail.country_of_residence_name}
                  </p>
                  <p>
                    <span>??????</span>
                    {accountDetail.city}
                  </p>
                  <p>
                    <span>??????</span>
                    {accountDetail.street}
                  </p>
                  <p>
                    <span>??????</span>
                    {accountDetail.postal}
                  </p>
                </div>
              )}
            </Card>
          </Col>
          <Col span={12}>
            <Card
              size="small"
              title="????????????"
              style={{ height: "280px", overflow: "scroll", }}
            >
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
                      <div>
                        {moment(item.create_time * 1000).format(
                          "YYYY-MM-DD HH:mm:ss"
                        )}
                      </div>
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
