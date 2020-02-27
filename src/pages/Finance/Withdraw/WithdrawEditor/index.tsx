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

export interface IWithdrawEditorProps {

}

export interface IWithdrawEditorState {

}

// @ts-ignore
@Form.create()
@inject('common', 'finance')
export default class WithdrawEditor extends BaseReact<IWithdrawEditorProps, IWithdrawEditorState> {
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
    const { currentWithdraw, currentShowWithdraw, setCurrentWithdraw, } = this.props.finance;
    const { getFieldDecorator, } = this.props.form;

    return (
      <div className='editor talent-editor'>
        <Form className='editor-form'>
          <FormItem label='姓名' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('name', {
              initialValue: currentWithdraw.name,
              rules: [
              ],
            })(<Input placeholder='请输入姓名' disabled />)}
          </FormItem>
          <FormItem label='划款单号' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentWithdraw.account,
              rules: [
              ],
            })(<Input placeholder='请输入划款单号' disabled />)}
          </FormItem>
          <FormItem
            label='通道类型'
            className='push-type-select'
            {...getFormItemLayout(6, 6)}
            required
          >
            {
              getFieldDecorator('pay_status', {
                initialValue: currentShowWithdraw && currentShowWithdraw.pay_status,
              })(
                <Select
                  // @ts-ignore
                  getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                  placeholder='请选择支付状态'
                  onChange={(value, elem: any) => {
                    setCurrentWithdraw({
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
          <FormItem label='实付金额' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentWithdraw.account,
              rules: [
              ],
            })(<Input type='number' placeholder='请输入实付金额' />)}
          </FormItem>
          <FormItem label='变更原因' {...getFormItemLayout(6, 16)}>
            {getFieldDecorator('reason', {
              initialValue: currentShowWithdraw && currentShowWithdraw.reason,
              rules: [
              ],
            })(<TextArea
              placeholder='请输入变更原因'
              rows={6} onChange={evt => {
                setCurrentWithdraw({
                  reason: evt.target.value,
                }, false);
              }} />)}
          </FormItem>
        </Form>
      </div>
    );
  }
}