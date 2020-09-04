import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import EditMessageContentModal from "./EditMessageContentModal";
import listConfig from "./config";
// import utils from "utils";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import { ROUTE_TO_PERMISSION } from "constant";
import utils from "utils";
import "./index.scss";

export interface MessageContent {
  id: number;
  key: string;
  title: string;
  description: string;
}

interface IMessageContentState {
  messageContentList: MessageContent[];
  messageTypeList: any[];
  currentMessageContent: MessageContent | null;
  isShowEditMessageContentModal: boolean;
  brokerId: number;
}

interface MessageContentListState extends IMessageContentState {
  tableLoading: boolean;
  selectedRowKeys: string[];
  tempFilter: any;
  total: number;
}

/* eslint new-cap: "off" */
@withRoutePermissionGuard("/dashboard/message/content", {
  exact: false,
  permissionCode: ROUTE_TO_PERMISSION["/dashboard/message/content"],
})
@inject("common", "message")
@observer
export default class MessageContentList extends BaseReact<
{},
MessageContentListState
> {
  state = {
    messageContentList: [],
    messageTypeList: [],
    tableLoading: false,
    selectedRowKeys: [],
    tempFilter: {},
    total: 0,
    roleList: [],
    currentMessageContent: null,
    isShowEditMessageContentModal: false,
    brokerId: null,
  };

  async componentDidMount() {
    const { filterContent, } = this.props.message;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      page_size: filterContent.page_size || paginationConfig.defaultPageSize,
      page: filterContent.page || 1,
    });
    this.getTypeList();
    this.getBrokerId();
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/message/content") {
      this.props.history.replace("/dashboard/message/content/list");
    }
  }

  getBrokerId = async () => {
    const res = await this.$api.system.getBrokerDealerList();
    if (res.status === 200) {
      this.setState({
        brokerId: res.data.id,
      });
    }
  };

  getTypeList = async () => {
    const res = await this.$api.message.getMessageTypeList();
    const { results, } = res.data;
    this.setState({ messageTypeList: results, });
  };

  getDataList = async (filterContent?: any) => {
    const payload = filterContent
      ? { ...this.props.message.filterContent, ...filterContent, }
      : this.props.message.filterContent;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.message.getMessageContentList({
      params: payload,
    });
    const { results, page_size, current_page, count, } = res.data;
    if (results.length === 0 && current_page !== 1) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.message.setFilterContent({
        page_size,
        page: current_page,
        ...this.state.tempFilter,
      });
      this.setState({
        messageContentList: results,
        tableLoading: false,
        total: count,
      });
    }
  };

  // @ts-ignore
  private onSearch = async () => {
    const filter: any = {
      page: 1,
      ...this.state.tempFilter,
    };
    this.getDataList(filter);
  };

  // @ts-ignore
  private onReset = async () => {
    // @ts-ignore
    this.getDataList({
      page: 1,
      ...utils.resetFilter(this.state.tempFilter),
    });
    this.setState({
      tempFilter: {},
    });
  };

  onInputChanged = (field, value) => {
    this.setState((prevState: MessageContentListState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value,
      },
    }));
  };

  // goToEditor = (id?: number) => {
  //   const url = `/dashboard/broker/editor?id=${id ? id : 0}`;
  //   this.props.history.push(url);
  // }

  // goToPermissionEditor = (id: number) => {
  //   const url = `/dashboard/broker/permission?id=${id}`;
  //   this.props.history.push(url);
  // }

  // brokerLogin = async (id: number) => {
  //   const res = await this.$api.broker.getBrokerLoginUrl(id);
  //   window.open(res.data.url);
  // }

  deleteMessageContent = async (id: string) => {
    const res = await this.$api.message.deleteMessageContent(id);
    if (res.status === 204) {
      this.getDataList();
    } else {
      this.$msg.error(res.data.message);
    }
  };

  showEditMessageContentModal = (messageContent?: MessageContent) => {
    if (messageContent) {
      this.setState({
        currentMessageContent: messageContent,
      });
    }

    this.setState({
      isShowEditMessageContentModal: true,
    });
  };

  hideEditMessageContentModal = () => {
    this.setState({
      isShowEditMessageContentModal: false,
      currentMessageContent: null,
    });
  };

  handleUpdateMessageContent = () => {
    this.hideEditMessageContentModal();
    this.getDataList();
  };

  render() {
    const { match, } = this.props;
    const {
      currentMessageContent,
      isShowEditMessageContentModal,
      brokerId,
    } = this.state;
    return (
      <>
        <div>
          <CommonHeader {...this.props} links={[]} title="内容列表" />
          {/* {<CommonList {...this.props} config={listConfig(this)} />} */}
          <Route
            path={`${match.url}/list`}
            render={props => (
              <CommonList {...props} config={listConfig(this)} />
            )}
          />
        </div>
        {isShowEditMessageContentModal && (
          <EditMessageContentModal
            brokerId={brokerId}
            messageContent={currentMessageContent}
            onOk={this.handleUpdateMessageContent}
            onCancel={this.hideEditMessageContentModal}
          />
        )}
      </>
    );
  }
}
