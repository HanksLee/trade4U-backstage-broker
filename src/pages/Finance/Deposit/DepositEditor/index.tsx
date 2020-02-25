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

export interface IDepositEditorProps {

}

export interface IDepositEditorState {

}

// @ts-ignore
@Form.create()
@inject('common', 'finance')
export default class DepositEditor extends BaseReact<IDepositEditorProps, IDepositEditorState> {
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
    const { currentDeposit, currentShowDeposit, setCurrentDeposit, } = this.props.finance;
    const { getFieldDecorator, } = this.props.form;

    return (
      <div className='editor talent-editor'>
        <Form className='editor-form'>
          <FormItem label='姓名' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('name', {
              initialValue: currentDeposit.name,
              rules: [
              ],
            })(<Input placeholder='请输入姓名' disabled />)}
          </FormItem>
          <FormItem label='账户' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentDeposit.account,
              rules: [
              ],
            })(<Input placeholder='请输入账户' disabled />)}
          </FormItem>
          <FormItem label='支付单号' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('pay_no', {
              initialValue: currentDeposit.pay_no,
              rules: [
              ],
            })(<Input placeholder='请输入支付单号' disabled />)}
          </FormItem>
          <FormItem
            label='支付状态'
            className='push-type-select'
            {...getFormItemLayout(6, 6)}
            required
          >
            {
              getFieldDecorator('pay_status', {
                initialValue: currentShowDeposit && currentShowDeposit.pay_status,
              })(
                <Select
                  // @ts-ignore
                  getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                  placeholder='请选择支付状态'
                  onChange={(value, elem: any) => {
                    setCurrentDeposit({
                      pay_status: value,
                    }, false);
                  }}
                  onFocus={async () => {

                  }}
                  disabled={currentShowDeposit.pay_status == 1}
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
          <FormItem
            label='充值状态'
            className='push-type-select'
            {...getFormItemLayout(6, 6)}
            required
          >
            {
              getFieldDecorator('recharge_status', {
                initialValue: currentShowDeposit && currentShowDeposit.recharge_status,
              })(
                <Select
                  // @ts-ignore
                  getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                  placeholder='请选择充值状态'
                  onChange={(value, elem: any) => {
                    setCurrentDeposit({
                      recharge_status: value,
                    }, false);
                  }}
                  onFocus={async () => {

                  }}
                  disabled={currentShowDeposit.pay_status == 1}
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
          <FormItem label='变更原因' {...getFormItemLayout(6, 8)}>
            {getFieldDecorator('reason', {
              initialValue: currentShowDeposit && currentShowDeposit.reason,
              rules: [
              ],
            })(<TextArea
              disabled={currentShowDeposit.pay_status == 1}
              placeholder='请输入变更原因'
              rows={6} onChange={evt => {
                setCurrentDeposit({
                  reason: evt.target.value,
                }, false);
              }} />)}
          </FormItem>
        </Form>
      </div>
    );
  }
}