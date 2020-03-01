import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import {
  Form,
  Input,
  Select,
  Col,
  Row
} from 'antd';
import './index.scss';
import {
  inject
} from 'mobx-react';

const FormItem = Form.Item;
const Option = Select.Option;

// const getFormItemLayout = (label, wrapper, offset?) => ({
//   labelCol: { span: label, offset, },
//   wrapperCol: { span: wrapper, },
// });

export interface IRateEditorProps {

}

export interface IRateEditorState {

}

// @ts-ignore
@Form.create()
@inject('common', 'finance')
export default class RateEditor extends BaseReact<IRateEditorProps, IRateEditorState> {
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
    const { currentRate, currentShowRate, setCurrentRate, } = this.props.finance;
    const { getFieldDecorator, } = this.props.form;

    return (
      <div className='editor rate-editor'>
        <Form className='editor-form'>
          <Row style={{ textAlign: 'center', }} type='flex' justify="space-around" align="top">
            <Col span="5">交易货币</Col>
            <Col span="5">支付货币</Col>
            <Col span="5">入金汇率</Col>
            <Col span="5">出金汇率</Col>
          </Row>
          <br />
          <Row type='flex' justify="space-around" align="top">
            <Col span="5">
              <FormItem
                className='push-type-select'
                // {...getFormItemLayout(6, 6)}
                required
              >
                {
                  getFieldDecorator('trade_currency', {
                    initialValue: currentShowRate && currentShowRate.trade_currency,
                  })(
                    <Select
                      // style={{ width: 120 }}
                      // @ts-ignore
                      getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                      placeholder='请选择交易货币'
                      onChange={(value, elem: any) => {
                        setCurrentRate({
                          trade_currency: value,
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
            <Col span="5">
              <FormItem
                className='push-type-select'
                // {...getFormItemLayout(6, 6)}
                required
              >
                {
                  getFieldDecorator('pay_currency', {
                    initialValue: currentShowRate && currentShowRate.pay_currency,
                  })(
                    <Select
                      // style={{ width: 120 }}
                      // @ts-ignore
                      getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                      placeholder='请选择支付货币'
                      onChange={(value, elem: any) => {
                        setCurrentRate({
                          pay_currency: value,
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
            <Col span="5">
              <FormItem>
                {getFieldDecorator('rate', {
                  initialValue: currentRate.rate,
                  rules: [
                  ],
                })(<Input type="number" placeholder='请输入入金汇率' onChange={evt => {
                  setCurrentRate({
                    rate: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>
            <Col span="5">
              <FormItem>
                {getFieldDecorator('out_rate', {
                  initialValue: currentRate.out_rate,
                  rules: [
                  ],
                })(<Input type="number" placeholder='请输入出金汇率' onChange={evt => {
                  setCurrentRate({
                    out_rate: evt.target.value,
                  }, false);
                }}/>)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}