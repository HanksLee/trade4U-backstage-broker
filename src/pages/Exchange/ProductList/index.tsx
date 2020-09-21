import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import listConfig from "./config";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import ProductEditor from "../ProductEditor";
import ProductHistory from "../ProductHistory";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import "./index.scss";
import utils from "utils";

export interface IProductListProps { }

export interface IProductListState {
  // filter: any;
}

/* eslint new-cap: "off" */
@withRoutePermissionGuard("/dashboard/exchange/product", { exact: false, })
@inject("common", "product")
@observer
export default class ProductList extends BaseReact<
IProductListProps,
IProductListState
> {
  state = {
    filter: {},
    tableLoading: false,
    currentPage: 1,
    selectedRowKeys: [],
    name: undefined,
    product__code: undefined,
    type__name: undefined,
    status: undefined,
    typeOptions: undefined,
  };

  async componentDidMount() {
    // @todo 这里需要从 commonStore 中设置默认的分页
    const {
      paginationConfig: { defaultPageSize, defaultCurrent, },
    } = this.props.common;

    this.resetPagination(defaultPageSize, defaultCurrent);
    this.getTypeOptions();
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/exchange/product") {
      this.props.history.replace("/dashboard/exchange/product/list");
    }
  }

  getTypeOptions = async () => {
    const res = await this.$api.product.getGenreList({
      params: {
        page: 1,
        page_size: 200,
      },
    });

    if (res.status === 200) {
      this.setState({
        typeOptions: res.data.results,
      });
    }
  };

  onTypeSelected = (val, elem) => {
    this.setState(
      {
        type__name: val,
      },
      () => {
        this.props.product.setFilterProduct({
          type__name: val,
        });
      }
    );
  };

  onStatusSelected = (val, elem) => {
    this.setState(
      {
        status: val,
      },
      () => {
        this.props.product.setFilterProduct({
          status: val,
        });
      }
    );
  };

  onInputChanged = (field, value) => {
    this.setState({
      [field]: value,
    });
    this.props.product.setFilterProduct({
      [field]: value ? value : undefined,
    });
  };

  getDataList = (payload = {}) => {
    this.setState(
      {
        tableLoading: true,
      },
      async () => {
        this.props.product.setFilterProduct({
          ...payload,
        });
        await this.props.product.getProductList({
          params: this.props.product.filterProduct,
        });
        this.setState({ tableLoading: false, });
      }
    );
  };

  resetPagination = async (page_size, current_page) => {
    this.props.product.setFilterProduct({
      page_size,
      page: current_page,
      // name: undefined,
      // product__code: undefined,
      // type__name: undefined,
      // status: undefined,
    });
    this.setState(
      {
        current_page,
      },
      async () => {
        const filter = this.props.product.filterProduct;

        this.getDataList(filter);
      }
    );
  };
  // @ts-ignore
  private onSearch = async () => {
    this.props.product.setFilterProduct({
      current_page: 1,
    });
    this.setState(
      {
        currentPage: 1,
      },
      () => {
        this.getDataList(this.props.product.filterProduct);
      }
    );
  };
  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    const filter: any = {
      current_page: 1,
    };

    this.props.product.setFilterProduct(filter, true);

    this.setState(
      {
        currentPage: 1,
        name: undefined,
        type__name: undefined,
        product__code: undefined,
        status: undefined,
      },
      () => {
        this.getDataList(this.props.product.filterProduct);
      }
    );
  };

  goToEditor = (record: any): void => {
    const url = `/dashboard/exchange/product/editor?id=${
      !utils.isEmpty(record) ? record.id : 0
    }`;
    this.props.history.push(url);
  };
  goToHistory = (record: any): void => {
    const url = `/dashboard/exchange/product/history?id=${
      !utils.isEmpty(record) ? record.id : 0
    }`;
    this.props.history.push(url);
  };
  render() {
    const { match, } = this.props;
    const computedTitle = "交易品种设置";
    const productList = this.props.product.productList; // productList 需被使用 @observer 才会更新
    return (
      <div>
        <CommonHeader {...this.props} links={[]} title={computedTitle} />
        <Route
          path={`${match.url}/list`}
          render={props => <CommonList {...props} config={listConfig(this)} />}
        />
        <Route
          path={`${match.url}/editor`}
          render={props => <ProductEditor {...props} />}
        />
        <Route
          path={`${match.url}/history`}
          render={props => <ProductHistory {...props} />}
        />
      </div>
    );
  }
}
