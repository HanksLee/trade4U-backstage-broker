import * as React from "react";
import WithRoute from "components/WithRoute";
import utils from 'utils';
import { BaseReact } from "components/BaseReact";
import { Spin } from 'antd';
import './index.scss';


/* eslint new-cap: "off" */
@WithRoute("/auth")
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