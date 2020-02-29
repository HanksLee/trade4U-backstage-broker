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
import {
  depositOptions
} from 'constant';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
let disableTextArea = false;

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
    const { currentDeposit, currentShowDeposit, setCurrentDeposit, } = this.props.finance;
    const { getFieldDecorator, } = this.props.form;

    return (
      <div className='editor talent-editor'>
        <Form className='editor-form'>
          <FormItem label='姓名' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('nickname', {
              initialValue: currentDeposit.user_display && currentDeposit.user_display.username,
              rules: [
              ],
            })(<Input placeholder='请输入姓名' disabled={currentDeposit.id} />)}
          </FormItem>
          {/* <FormItem label='账户' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('account', {
              initialValue: currentDeposit.user_display && currentDeposit.user_display.username,
              rules: [
              ],
            })(<Input placeholder='请输入账户' disabled={currentDeposit.id} />)}
          </FormItem> */}
          <FormItem label='支付单号' {...getFormItemLayout(6, 16)} required>
            {getFieldDecorator('order_number', {
              initialValue: currentDeposit.order_number,
              rules: [
              ],
            })(<Input placeholder='请输入支付单号' disabled={currentDeposit.id} />)}
          </FormItem>
          <FormItem
            label='支付状态'
            className='push-type-select'
            {...getFormItemLayout(6, 6)}
            required
          >
            {
              getFieldDecorator('status', {
                initialValue: currentShowDeposit.status != null && currentShowDeposit.status.toString(),
              })(
                <Select
                  // @ts-ignore
                  getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                  placeholder='请选择支付状态'
                  onChange={(value, elem: any) => {
                    if (disableTextArea == false && currentShowDeposit.status != 0) {
                      disableTextArea = true;
                    }

                    setCurrentDeposit({
                      status: value,
                    }, false);
                  }}
                  onFocus={async () => {

                  }}
                  disabled={this.props.initStatus == 1}
                >
                  {
                    depositOptions.map(item => (
                      // @ts-ignore
                      <Option key={item.id.toString()}>
                        {item.name}
                      </Option>
                    ))
                  }
                </Select>
              )
            }
          </FormItem>
          <FormItem label='变更原因' {...getFormItemLayout(6, 16)}>
            {getFieldDecorator('remarks', {
              initialValue: currentShowDeposit && currentShowDeposit.remarks,
              rules: [
              ],
            })(<TextArea
              disabled={this.props.initStatus == 1}
              placeholder='请输入变更原因'
              rows={6} onChange={evt => {
                setCurrentDeposit({
                  remarks: evt.target.value,
                }, false);
              }} />)}
          </FormItem>
        </Form>
      </div>
    );
  }
}