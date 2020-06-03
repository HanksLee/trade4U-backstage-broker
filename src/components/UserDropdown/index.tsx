import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { Menu, Dropdown, Icon } from "antd";
import "./index.scss";
import { inject, observer } from "mobx-react";

export interface IUserDropdownProps {
  onBtnClick?(): void;
}

export interface IUserDropdownState {
  logo: string;
}

@inject("common")
@observer
export default class UserDropdown extends BaseReact<
  IUserDropdownProps,
  IUserDropdownState
> {
  state = {
    logo: ""
  };

  private logout = async (): Promise<any> => {
    localStorage.removeItem("MOON_ADMIN_BROKER_TOKEN");

    setTimeout(() => {
      (window as any).location.href =
        process.env.NODE_ENV === "production"
          ? "/login"
          : window.location.origin + "/#/login";
    }, 500);
  };

  renderMenu = () => {
    return (
      <Menu>
        <Menu.Item>
          <a onClick={this.logout}>登出</a>
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const { userInfo } = this.props.common;

    return (
      <div className="user-dropdown">
        <Dropdown overlay={this.renderMenu}>
          <div className="profile">
            {/* <img
              src={
                this.state.logo ||
                "https://cdn.pixabay.com/photo/2017/01/11/08/31/icon-1971130_1280.png"
              }
              alt="logo"
            /> */}
            <div className="profile-info">
              <h3>{userInfo.department}</h3>
              <p>{userInfo.name}</p>
            </div>
            <Icon type="down" />
          </div>
        </Dropdown>
      </div>
    );
  }
}
