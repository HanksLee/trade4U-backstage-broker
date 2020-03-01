import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { withRouter } from 'react-router-dom';
import AppRouter from '../../router';
import { Layout, Menu, Icon, Spin } from 'antd';
import UserDropdown from 'components/UserDropdown';
import union from 'lodash/union';
import './index.scss';
import { inject, observer } from 'mobx-react';
import { PAGE_PERMISSION_MAP } from 'constant';

const { Header, Sider, Content, } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

export interface IndexProps {}

export interface IIndexState {
  collapsed: boolean;
  selectedKeys: string[];
  openKeys: string[];
  showContainer: boolean;
}

// 用于计算出侧边栏的展开路径的数组
function computedPathLevel(path: string) {
  let pathElems = path.split("/").slice(1),
    total = "",
    ret = [];

  for (var i = 0; i < pathElems.length; i++) {
    total += "/" + pathElems[i];
    ret.push(total);
  }

  return ret;
}

function exactFromSidebarPath(pathlist) {
  const list = [];

  function walk(pathlist) {
    pathlist.forEach(item => {
      list.push(item.path);

      if (item.children instanceof Array) {
        walk(item.children);
      }
    });
  }

  walk(pathlist);
  return list;
}
/* eslint new-cap: "off" */
// @ts-ignore
@withRouter
@inject("common")
@observer
export default class Index extends BaseReact<IndexProps, IIndexState> {
  state = {
    collapsed: false,
    openKeys: [],
    selectedKeys: [],
    showContainer: true,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      location: { pathname, },
      common: { sidebar, },
    } = nextProps;

    if (!sidebar) return null;

    const pathLevel = union(
      prevState.openKeys,
      computedPathLevel(pathname)
    ).sort((a, b) => b.length - a.length);

    const pathlist = exactFromSidebarPath(sidebar);
    let selectedKeys = [];
    pathlist.forEach(item => {
      if (
        pathname
          .split("/")
          .slice(0, 5)
          .join("/")
          .indexOf(item) >= 0
      ) {
        selectedKeys = [item];
      }
    });

    return {
      openKeys: pathLevel,
      selectedKeys,
    };
  }

  async componentDidMount() {
    const res = await this.$api.role.getMenus();
    this.props.common.setPermissions(res.data.permission);
    this.props.common.setSidebar(res.data.menu);
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onMenuItemClick = item => {
    this.setState({
      openKeys: item.keyPath,
    });
    this.props.history.push(item.key);
  };

  onOpenChange = item => {
    this.setState({
      openKeys: item,
    });
  };

  renderMenu = (): JSX.Element => {
    const { selectedKeys, openKeys, } = this.state;
    const { sidebar, } = this.props.common;

    return (
      <Menu
        mode="inline"
        className="app-menu"
        openKeys={openKeys}
        onOpenChange={this.onOpenChange}
        onClick={this.onMenuItemClick}
        selectedKeys={selectedKeys}
      >
        {sidebar.map(route => this.renderMenuItem(route))}
      </Menu>
    );
  };

  renderMenuItem = (route: any): JSX.Element => {
    const { permissions, } = this.props.common;
    if (permissions.indexOf(PAGE_PERMISSION_MAP[route.path]) === -1) return null;

    if (route.children && route.children.length > 0) {
      return (
        <SubMenu key={route.path} title={route.name}>
          {route.children.map(subRoute => this.renderMenuItem(subRoute))}
        </SubMenu>
      );
    }

    return (
      <MenuItem key={route.path}>
        <span>
          <a>{route.name}</a>
        </span>
      </MenuItem>
    );
  };

  render() {
    const { collapsed, showContainer, } = this.state;
    const { location, common, } = this.props;

    // 还未加载到菜单数据
    if (!common.sidebar) {
      return (
        <Layout className="layout">
          <Spin className="absolute-center" />
        </Layout>
      );
    }

    return (
      <Layout className="layout">
        {showContainer && (
          <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
            <div className="logo">
              {!collapsed && <span>Wetrade 券商后台</span>}
            </div>
            {this.renderMenu()}
          </Sider>
        )}
        <Layout
          style={{
            // minWidth: 1280,
            overflow: "hidden",
          }}
        >
          {showContainer && (
            <Header className="header">
              <Icon
                style={{ visibility: "hidden", }}
                className="trigger"
                type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                onClick={this.toggle}
              />
              <UserDropdown />
            </Header>
          )}
          <Content
            className="content"
            style={
              {
                // height: wrapperHeight - headerHeight,
              }
            }
          >
            {location.pathname === "/dashboard" ||
            location.pathname === "/dashboard/" ? (
                <p style={{ fontSize: 30, fontWeight: 500, margin: 20, }}>
                🐕 🐩 🐈 &nbsp;Welcome to Wetrade!
                </p>
              ) : null}
            <AppRouter />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
