import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import {
  Form,
  Input,
  Select,
  Row,
  Col
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
    currencyOptions: [],
  }

  async componentDidMount() {
    this.props.onRef(this);
    this.initData();
  }

  initData = async () => {
    const res = await this.$api.common.getConstantByKey('system_currency_choices');

    this.setState({
      currencyOptions: res.data.data,
    });
  }

  render() {
    const { currencyOptions, } = this.state;
    const { currentPayment, currentShowPayment, setCurrentPayment, } = this.props.finance;
    const { getFieldDecorator, } = this.props.form;

    return (
      <div className='editor talent-editor'>
        <Form className='editor-form'>
          <Row type="flex" justify='space-around'>
            <Col span={12}>
              <FormItem label='通道名称' {...getFormItemLayout(6, 16)} required>
                {getFieldDecorator('name', {
                  initialValue: currentPayment.name,
                  rules: [
                  ],
                })(<Input placeholder='请输入通道名称' onChange={evt => {
                  setCurrentPayment({
                    name: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='通道编码' {...getFormItemLayout(6, 16)} required>
                {getFieldDecorator('code', {
                  initialValue: currentPayment.code,
                  rules: [
                  ],
                })(<Input placeholder='请输入通道编码' onChange={evt => {
                  setCurrentPayment({
                    code: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify='space-around'>
            <Col span={12}>
              <FormItem label='商户名称' {...getFormItemLayout(6, 16)} required>
                {getFieldDecorator('merchant', {
                  initialValue: currentPayment.merchant,
                  rules: [
                  ],
                })(<Input placeholder='请输入商户名称' onChange={evt => {
                  setCurrentPayment({
                    merchant: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='商户编码' {...getFormItemLayout(6, 16)} required>
                {getFieldDecorator('merchant_number', {
                  initialValue: currentPayment.merchant_number,
                  rules: [
                  ],
                })(<Input placeholder='请输入商户编码' onChange={evt => {
                  setCurrentPayment({
                    merchant_number: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>
          </Row>

          <Row type="flex" justify='space-around'>
            <Col span={12}>
              <FormItem label='公钥' {...getFormItemLayout(6, 16)}>
                {getFieldDecorator('pub_key', {
                  initialValue: currentPayment.pub_key,
                  rules: [
                  ],
                })(<Input placeholder='请输入公钥' onChange={evt => {
                  setCurrentPayment({
                    pub_key: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='私钥' {...getFormItemLayout(6, 16)}>
                {getFieldDecorator('pri_key', {
                  initialValue: currentPayment.pri_key,
                  rules: [
                  ],
                })(<Input placeholder='请输入私钥' onChange={evt => {
                  setCurrentPayment({
                    pri_key: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify='space-around'>
            <Col span={12}>
              <FormItem label='商户 key' {...getFormItemLayout(6, 16)}>
                {getFieldDecorator('merchant_key', {
                  initialValue: currentPayment.merchant_key,
                  rules: [
                  ],
                })(<Input type='number' placeholder='请输入商户 key' onChange={evt => {
                  setCurrentPayment({
                    merchant_key: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label='银行/三方'
                className='push-type-select'
                {...getFormItemLayout(6, 6)}
                required
              >
                {
                  getFieldDecorator('redirect', {
                    initialValue: currentShowPayment.redirect && currentShowPayment.redirect.toString(),
                  })(
                    <Select
                      style={{ width: 300, }}
                      // @ts-ignore
                      getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                      placeholder='请选择银行/三方'
                      onChange={(value, elem: any) => {
                        setCurrentPayment({
                          redirect: value,
                        }, false);
                      }}
                      onFocus={async () => {

                      }}
                    >
                      {
                        [{
                          id: 0,
                          name: '跳转第三方网站',
                        }].map(item => (
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
            </Col>
          </Row>
          <Row type="flex" justify='space-around'>
            <Col span={12}>
              <FormItem label='支付域名' {...getFormItemLayout(6, 16)}>
                {getFieldDecorator('domain', {
                  initialValue: currentPayment.domain,
                  rules: [
                  ],
                })(<Input placeholder='请输入支付域名' onChange={evt => {
                  setCurrentPayment({
                    domain: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label='支付货币'
                className='push-type-select'
                {...getFormItemLayout(6, 6)}
                required
              >
                {
                  getFieldDecorator('currency', {
                    initialValue: currentShowPayment && currentShowPayment.currency,
                  })(
                    <Select
                      style={{ width: 300, }}
                      // @ts-ignore
                      getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                      placeholder='请选择支持货币'
                      onChange={(value, elem: any) => {
                        setCurrentPayment({
                          currency: value,
                        }, false);
                      }}
                      onFocus={async () => {

                      }}
                    >
                      {
                        currencyOptions.map(item => (
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
            </Col>
          </Row>
          <Row type="flex" justify='space-around'>
            <Col span={12}>
              <FormItem label='最低入金' {...getFormItemLayout(6, 16)} required>
                {getFieldDecorator('min_deposit', {
                  initialValue: currentPayment.min_deposit,
                  rules: [
                  ],
                })(<Input type='number' placeholder='请输入最低入金' onChange={evt => {
                  setCurrentPayment({
                    min_deposit: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label='最高入金' {...getFormItemLayout(6, 16)} required>
                {getFieldDecorator('max_deposit', {
                  initialValue: currentPayment.max_deposit,
                  rules: [
                  ],
                })(<Input type='number' placeholder='请输入最高入金' onChange={evt => {
                  setCurrentPayment({
                    max_deposit: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" justify='space-around'>

            <Col span={12}>
              <FormItem label='入金手续费' {...getFormItemLayout(6, 16)} required>
                {getFieldDecorator('fee', {
                  initialValue: currentPayment.fee,
                  rules: [
                  ],
                })(<Input type='number' placeholder='请输入入金手续费' onChange={evt => {
                  setCurrentPayment({
                    fee: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>

            <Col span={12}>

              <FormItem
                label='适用范围'
                className='push-type-select'
                {...getFormItemLayout(6, 6)}
                required
              >
                {
                  getFieldDecorator('scope', {
                    initialValue: currentShowPayment && currentShowPayment.scope,
                  })(
                    <Select
                      mode="multiple"
                      style={{ width: 300, }}
                      // @ts-ignore
                      getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                      placeholder='请选择适用范围'
                      onChange={(value, elem: any) => {
                        setCurrentPayment({
                          scope: value,
                        }, false);
                      }}
                      onFocus={async () => {

                      }}
                    >
                      {
                        [{
                          id: 1,
                          name: 'PC',
                        }, {
                          id: 2,
                          name: 'APP',
                        }].map(item => (
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

            </Col>
          </Row>

          <Row type="flex">
            <FormItem label='备注' {...getFormItemLayout(6, 16)}>
              {getFieldDecorator('remarks', {
                initialValue: currentShowPayment && currentShowPayment.remarks,
                rules: [
                ],
              })(<TextArea
                style={{ width: 400, }}
                placeholder='请输入备注'
                rows={6} onChange={evt => {
                  setCurrentPayment({
                    remarks: evt.target.value,
                  }, false);
                }} />)}
            </FormItem>
          </Row>




        </Form>
      </div>
    );
  }
}