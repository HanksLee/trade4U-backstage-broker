import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import ExchangeGenreEdtior from 'pages/Exchange/GenreEditor';
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from 'utils';
import { Modal } from 'antd';

export interface IExchangeGenreProps { }

export interface IExchangeGenreState {
  // filter: any;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/exchange/genre", { exact: false, })
@inject("common", "exchange")
@observer
export default class ExchangeGenre extends BaseReact<IExchangeGenreProps, IExchangeGenreState> {
  private $genreEditor = null;
  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    genreModalVisible: false,
  };

  async componentDidMount() {
    // @todo 这里需要从 commonStore 中设置默认的分页
    const {
      paginationConfig: { defaultPageSize, defaultCurrent, },
    } = this.props.common;

    this.resetPagination(defaultPageSize, defaultCurrent);
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/exchange/genre") {
      this.props.history.replace("/dashboard/exchange/genre/list");
    }
  }

  getDataList = (payload = {}) => {
    this.setState(
      {
        tableLoading: true,
        filter: {
          ...this.state.filter,
          ...payload,
        },
      },
      async () => {
        await this.props.exchange.getGenreList({
          params: this.state.filter,
        });
        this.setState({ tableLoading: false, });
      }
    );
  };

  toggleGenreModal = () => {
    this.setState({
      genreModalVisible: !this.state.genreModalVisible,
    });
  }

  onModalConfirm = async () => {
    const { currentGenre, } = this.props.exchange;

    let res;
    if (!currentGenre.symbol_type_name) {
      return this.$msg.warn('请输入品种类型名称');
    }

    if (currentGenre.in_use == null) {
      return this.$msg.warn('请选择品种类型是否可用');
    }

    let payload: any = {
      name: currentGenre.symbol_type_name,
      in_use: currentGenre.in_use,
    };

    if (currentGenre.id) {
      // payload['id'] = currentGenre.id,
      res = await this.$api.exchange.updateGenre(currentGenre.id, payload);
    } else {
      res = await this.$api.exchange.createGenre(payload);
    }

    const statusCode = currentGenre.id ? 200 : 201;

    if (res.status == statusCode) {
      this.$msg.success(!currentGenre.uid ? '品种类型添加成功' : '品种类型编辑成功');
      this.toggleGenreModal();
      this.getDataList(this.state.filter);
    } else {
      this.$msg.error(res.data.msg);
    }
  }

  onModalCancel = () => {
    this.setState({
      genreModalVisible: false,
    });
    this.props.exchange.setCurrentGenre({});
  }

  resetPagination = async (pageSize, pageNum) => {
    this.setState(
      {
        filter: {
          ...this.state.filter,
          page_size: pageSize,
          page: pageNum,
        },
      },
      async () => {
        const filter = this.state.filter;
        this.getDataList(filter);
      }
    );
  };
  // @ts-ignore
  private onSearch = async () => {
    const filter: any = this.state.filter;

    // console.log('filter', filter);

    this.setState(
      {
        filter: {
          ...filter,
          page: 1,
        },
        currentPage: 1,
      },
      () => {
        this.getDataList(this.state.filter);
      }
    );
  };
  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    const filter: any = { page: 1, page_size: this.state.filter.page_size, };

    this.setState(
      {
        filter,
        currentPage: 1,
      },
      () => {
        this.getDataList(this.state.filter);
      }
    );
  };

  goToEditor = (record: any): void => {
    const url = `/dashboard/exchange/genre/editor?id=${!utils.isEmpty(record) ? record.id : 0}`;
    this.props.history.push(url);
    this.props.exchange.setCurrentGenre(record, true, false);
  }

  renderMenu = (record): JSX.Element => {
    return null;
  };

  // @ts-ignore
  private onBatch = async value => { };

  render() {
    const { match, } = this.props;
    const computedTitle = '交易类型设置';
    const { genreModalVisible, } = this.state;
    const { currentGenre, } = this.props.exchange;

    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        {
          genreModalVisible && (
            <Modal
              width={720}
              visible={genreModalVisible}
              title={
                utils.isEmpty(currentGenre.id) ? '添加品种类型' : '编辑品种类型'
              }
              onOk={this.onModalConfirm}
              onCancel={this.onModalCancel}
            >
              <ExchangeGenreEdtior onRef={ref => this.$genreEditor = ref} />
            </Modal>
          )
        }
      </div>
    );
  }
}
