import * as React from "react";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import utils from 'utils';
import { BaseReact } from "components/BaseReact";
import { Spin } from 'antd';
import './index.scss';


/* eslint new-cap: "off" */
@withRoutePermissionGuard("/auth")
export default class Auth extends BaseReact<any> {
  componentDidMount() {
    const search = this.$qs.parse(this.props.location.search);
    if (search.token) {
      utils.setLStorage('MOON_ADMIN_BROKER_TOKEN', search.token);
      this.props.history.push('/dashboard');
    }
  }

  render() {
    return (
      <div className="auth-layout">
        <Spin size="large" />
      </div>
    );
  }
}