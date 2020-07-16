import CommonHeader from "components/CommonHeader";
import CommonList from "components/CommonList";
import EditMessageTypeModal from "./EditMessageTypeModal";
import listConfig from "./config";
// import utils from "utils";
import WithRoute from "components/WithRoute";
import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { inject, observer } from "mobx-react";
import { Route } from "react-router-dom";
import { PAGE_PERMISSION_MAP } from "constant";
import utils from "utils";
import "./index.scss";

export interface MessageType {
  id: number;
  key: string;
  title: string;
  description: string;
}

interface IMessageTypeState {
  messageTypeList: MessageType[];
  currentMessageType: MessageType | null;
  isShowEditMessageTypeModal: boolean;
  brokerId: number;
}

interface MessageTypeListState extends IMessageTypeState {
  tableLoading: boolean;
  selectedRowKeys: string[];
  tempFilter: any;
  total: number;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/message/type", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/message/type"],
})
@inject("common", "message")
@observer
export default class MessageTypeList extends BaseReact<
{},
MessageTypeListState
> {
  state = {
    messageTypeList: [],
    tableLoading: false,
    selectedRowKeys: [],
    tempFilter: {},
    total: 0,
    roleList: [],
    currentMessageType: null,
    isShowEditMessageTypeModal: false,
    brokerId: null,
  };

  async componentDidMount() {
    const { filterType, } = this.props.message;
    const { paginationConfig, } = this.props.common;

    this.getDataList({
      page_size: filterType.page_size || paginationConfig.defaultPageSize,
      page: filterType.page || 1,
    });
    this.getBrokerId();
  }

  componentDidUpdate() {
    if (this.props.location.pathname === "/dashboard/message/type") {
      this.props.history.replace("/dashboard/message/type/list");
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

  getDataList = async (filterType?: any) => {
    const payload = filterType
      ? { ...this.props.message.filterType, ...filterType, }
      : this.props.message.filterType;
    this.setState({
      tableLoading: true,
    });

    const res = await this.$api.message.getMessageTypeList({ params: payload, });
    const { results, page_size, current_page, count, } = res.data;
    if (results.length === 0 && current_page !== 1) {
      // 删除非第一页的最后一条记录，自动翻到下一页
      this.getDataList({ ...payload, page: current_page - 1, });
    } else {
      this.props.message.setFilterType({
        page_size,
        page: current_page,
        ...this.state.tempFilter,
      });
      this.setState({
        messageTypeList: results,
        tableLoading: false,
        total: count,
      });
    }
  };

  deleteMessageType = async (id: string) => {
    const res = await this.$api.message.deleteMessageType(id);
    if (res.status === 204) {
      this.getDataList();
    } else {
      this.$msg.error(res.data.message);
    }
  };

  showEditMessageTypeModal = (messageType?: MessageType) => {
    if (messageType) {
      this.setState({
        currentMessageType: messageType,
      });
    }

    this.setState({
      isShowEditMessageTypeModal: true,
    });
  };

  hideEditMessageTypeModal = () => {
    this.setState({
      isShowEditMessageTypeModal: false,
      currentMessageType: null,
    });
  };

  handleUpdateMessageType = () => {
    this.hideEditMessageTypeModal();
    this.getDataList();
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
    this.setState((prevState: MessageTypeListState) => ({
      tempFilter: {
        ...prevState.tempFilter,
        [field]: value,
      },
    }));
  };

  render() {
    const { match, } = this.props;
    const {
      currentMessageType,
      isShowEditMessageTypeModal,
      brokerId,
    } = this.state;
    return (
      <>
        <div>
          <CommonHeader {...this.props} links={[]} title="内容分类" />
          {/* {<CommonList {...this.props} config={listConfig(this)} />} */}
          <Route
            path={`${match.url}/list`}
            render={props => (
              <CommonList {...props} config={listConfig(this)} />
            )}
          />
        </div>
        {isShowEditMessageTypeModal && (
          <EditMessageTypeModal
            brokerId={brokerId}
            messageType={currentMessageType}
            onOk={this.handleUpdateMessageType}
            onCancel={this.hideEditMessageTypeModal}
          />
        )}
      </>
    );
  }
}
