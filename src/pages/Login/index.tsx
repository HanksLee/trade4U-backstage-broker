import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { withRoutePermissionGuard } from "components/withRoutePermissionGuard";
import "./index.scss";
import {
  Button,
  Form,
  Icon,
  Input
} from 'antd';
import utils from 'utils';

export interface ILoginProps { }

export interface ILoginState {
  loginUrl: string;
  codeInfo: any;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24, },
    sm: { span: 6, },
  },
  wrapperCol: {
    xs: { span: 24, },
    sm: { span: 18, },
  },
};

/* eslint new-cap: "off" */
@withRoutePermissionGuard("/login")
// @ts-ignore
@Form.create()
export default class Login extends BaseReact<ILoginProps, ILoginState> {
  state = {
    loginUrl: "",
    codeInfo: null,
  };

  async componentDidMount() {
    const token = utils.getLStorage('MOON_ADMIN_BROKER_TOKEN');
    if (token) {
      this.props.history.push('/dashboard');
    }

    this.getCodeImg();
  }

  getCodeImg = async () => {
    const res: any = await this.$api.common.getCodeImg();

    if (res.status == 200) {
      this.setState({
        codeInfo: res.data,
      });
    }
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const codeInfo = this.state.codeInfo;

        values['key'] = codeInfo.key;

        const res = await this.$api.common.login(values);
        if (res.status == 201) {
          const token = res.data.token;
          utils.setLStorage('MOON_ADMIN_BROKER_TOKEN', token);

          this.props.history.push('/dashboard');
        } else {
          this.$msg.error(res.data.message);
        }
      }
    });
  };

  render() {
    const { getFieldDecorator, } = this.props.form;
    const { codeInfo, } = this.state;

    return (
      <div className="login">
        <div className="form-wrapper">
          <div className="form">
            <h2>Moon Admin 管理系统</h2>
            <section>
              <Form {...formItemLayout} onSubmit={this.handleSubmit} className="login-form">
                <Form.Item label='用户名'>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入您的用户名', }],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)', }} />}
                      placeholder="用户名"
                    />
                  )}
                </Form.Item>
                <Form.Item label='密码'>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入您的密码', }],
                  })(
                    <Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)', }} />}
                      type="password"
                      placeholder="密码"
                    />
                  )}
                </Form.Item>
                <Form.Item label='验证码'>
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '请输入验证码', }],
                  })(
                    <Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)', }} />}
                      placeholder="验证码"
                    />
                  )}

                </Form.Item>
                <Form.Item wrapperCol={{ span: 24, }} className='login-code-refresh'>
                  <span className='login-code-img' onClick={this.getCodeImg}>
                    <img src={codeInfo && codeInfo.image} alt=""/>
                  </span>
                  <span className="login-refresh" onClick={this.getCodeImg}>
                    刷新
                  </span>
                </Form.Item>
                <Form.Item  className='login-confirm-btn' wrapperCol={{ span: 24, }}>
                  <Button block type="primary" htmlType="submit" className="login-form-button">
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
