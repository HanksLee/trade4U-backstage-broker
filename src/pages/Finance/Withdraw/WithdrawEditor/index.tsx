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
  }


  render() {
    const { scopeOptions, } = this.state;
    const { currentWithdraw, currentShowWithdraw, setCurrentWithdraw, } = this.props.finance;
    const { getFieldDecorator, } = this.props.form;

    return (
      <div className='editor talent-editor'>
        <Form className='editor-form'>
          <FormItem label='姓名' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('username', {
              initialValue: currentWithdraw.user_display && currentShowWithdraw.user_display.username,
              rules: [
              ],
            })(<Input placeholder='请输入姓名' disabled />)}
          </FormItem>
          <FormItem label='划款单号' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('remit_number', {
              initialValue: currentWithdraw.remit_number,
              rules: [
              ],
            })(<Input placeholder='请输入划款单号' onChange={evt => {
              setCurrentWithdraw({
                remit_number: evt.target.value,
              }, false);
            }}
            />)}
          </FormItem>
          <FormItem label='实付金额' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('actual_amount', {
              initialValue: currentWithdraw.actual_amount,
              rules: [
              ],
            })(<Input type='number' placeholder='请输入实付金额' onChange={evt => {
              setCurrentWithdraw({
                actual_amount: +evt.target.value,
              }, false);
            }}/>)}
          </FormItem>
        </Form>
      </div>
    );
  }
}