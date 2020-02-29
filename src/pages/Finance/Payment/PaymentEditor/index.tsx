import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import {
  Form,
  Input,
  Select
} from 'antd';
import './index.scss';
import {
  inject
} from 'mobx-react';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

export interface IPaymentEditorProps {

}

export interface IPaymentEditorState {

}

// @ts-ignore
@Form.create()
@inject('common', 'finance')
export default class PaymentEditor extends BaseReact<IPaymentEditorProps, IPaymentEditorState> {
  state = {
    scopeOptions: [],
  }

  async componentDidMount() {
    this.props.onRef(this);
    this.initData();
  }

  initData = async () => {
    const res = await this.$api.finance.getScopeOptions();

    this.setState({
      scopeOptions: res.data.data,
    });
  }

  render() {
    const { scopeOptions, } = this.state;
    const { currentPayment, currentShowPayment, setCurrentPayment, } = this.props.finance;
    const { getFieldDecorator, } = this.props.form;

    return (
      <div className='editor talent-editor'>
        <Form className='editor-form'>
          <FormItem
            label='通道类型'
            className='push-type-select'
            {...getFormItemLayout(6, 6)}
            required
          >
            {
              getFieldDecorator('pay_status', {
                initialValue: currentShowPayment && currentShowPayment.pay_status,
              })(
                <Select
                  // @ts-ignore
                  getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                  placeholder='请选择支付状态'
                  onChange={(value, elem: any) => {
                    setCurrentPayment({
                      pay_status: value,
                    }, false);
                  }}
                  onFocus={async () => {

                  }}
                >
                  {
                    scopeOptions.map(item => (
                      // @ts-ignore
                      <Option key={item.field}>
                        {item.translation}
                      </Option>
                    ))
                  }
                </Select>
              )
            }
          </FormItem>

          <FormItem label='通道名称' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('name', {
              initialValue: currentPayment.name,
              rules: [
              ],
            })(<Input placeholder='请输入姓名' disabled />)}
          </FormItem>
          <FormItem label='商户名称' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentPayment.account,
              rules: [
              ],
            })(<Input placeholder='请输入划款单号' disabled />)}
          </FormItem>
          <FormItem label='商户编码' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentPayment.account,
              rules: [
              ],
            })(<Input type='number' placeholder='请输入实付金额' />)}
          </FormItem>
          <FormItem label='结算账号' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentPayment.account,
              rules: [
              ],
            })(<Input type='number' placeholder='请输入实付金额' />)}
          </FormItem>
          <FormItem label='公钥' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentPayment.account,
              rules: [
              ],
            })(<Input type='number' placeholder='请输入公钥' />)}
          </FormItem>
          <FormItem label='私钥' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentPayment.account,
              rules: [
              ],
            })(<Input type='number' placeholder='请输入私钥' />)}
          </FormItem>
          {/* 支持货币 */}

          <FormItem label='商户 key' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentPayment.account,
              rules: [
              ],
            })(<Input type='number' placeholder='请输入商户 key' />)}
          </FormItem>
          {/* 银行、三方 */}
          <FormItem
            label='银行/三方'
            className='push-type-select'
            {...getFormItemLayout(6, 6)}
            required
          >
            {
              getFieldDecorator('pay_status', {
                initialValue: currentShowPayment && currentShowPayment.pay_status,
              })(
                <Select
                  // @ts-ignore
                  getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                  placeholder='请选择支付状态'
                  onChange={(value, elem: any) => {
                    setCurrentPayment({
                      pay_status: value,
                    }, false);
                  }}
                  onFocus={async () => {

                  }}
                >
                  {
                    scopeOptions.map(item => (
                      // @ts-ignore
                      <Option key={item.field}>
                        {item.translation}
                      </Option>
                    ))
                  }
                </Select>
              )
            }
          </FormItem>

          <FormItem label='支付域名' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentPayment.account,
              rules: [
              ],
            })(<Input type='number' placeholder='请输入实付金额' />)}
          </FormItem>
          {/* 直连方式 */}
          <FormItem
            label='直连方式'
            className='push-type-select'
            {...getFormItemLayout(6, 6)}
            required
          >
            {
              getFieldDecorator('pay_status', {
                initialValue: currentShowPayment && currentShowPayment.pay_status,
              })(
                <Select
                  // @ts-ignore
                  getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                  placeholder='请选择支付状态'
                  onChange={(value, elem: any) => {
                    setCurrentPayment({
                      pay_status: value,
                    }, false);
                  }}
                  onFocus={async () => {

                  }}
                >
                  {
                    scopeOptions.map(item => (
                      // @ts-ignore
                      <Option key={item.field}>
                        {item.translation}
                      </Option>
                    ))
                  }
                </Select>
              )
            }
          </FormItem>

          <FormItem label='最低入金' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentPayment.account,
              rules: [
              ],
            })(<Input type='number' placeholder='请输入实付金额' />)}
          </FormItem>
          <FormItem label='最高入金' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentPayment.account,
              rules: [
              ],
            })(<Input type='number' placeholder='请输入实付金额' />)}
          </FormItem>
          <FormItem label='入金手续费' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentPayment.account,
              rules: [
              ],
            })(<Input type='number' placeholder='请输入实付金额' />)}
          </FormItem>
          {/* 适用范围 */}
          {/* 实名认证 */}
          <FormItem
            label='实名认证'
            className='push-type-select'
            {...getFormItemLayout(6, 6)}
            required
          >
            {
              getFieldDecorator('pay_status', {
                initialValue: currentShowPayment && currentShowPayment.pay_status,
              })(
                <Select
                  // @ts-ignore
                  getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                  placeholder='请选择支付状态'
                  onChange={(value, elem: any) => {
                    setCurrentPayment({
                      pay_status: value,
                    }, false);
                  }}
                  onFocus={async () => {

                  }}
                >
                  {
                    scopeOptions.map(item => (
                      // @ts-ignore
                      <Option key={item.field}>
                        {item.translation}
                      </Option>
                    ))
                  }
                </Select>
              )
            }
          </FormItem>

          <FormItem label='登录地址' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentPayment.account,
              rules: [
              ],
            })(<Input placeholder='请输入登录地址' />)}
          </FormItem>
          <FormItem label='注册地址' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentPayment.account,
              rules: [
              ],
            })(<Input placeholder='请输入注册地址' />)}
          </FormItem>
          <FormItem label='备注' {...getFormItemLayout(6, 16)}>
            {getFieldDecorator('reason', {
              initialValue: currentShowPayment && currentShowPayment.reason,
              rules: [
              ],
            })(<TextArea
              placeholder='请输入备注'
              rows={6} onChange={evt => {
                setCurrentPayment({
                  reason: evt.target.value,
                }, false);
              }} />)}
          </FormItem>
        </Form>
      </div>
    );
  }
}