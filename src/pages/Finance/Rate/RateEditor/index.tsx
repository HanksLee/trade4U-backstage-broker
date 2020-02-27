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
const TextArea = Input.TextArea;

const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

export interface IRateEditorProps {

}

export interface IRateEditorState {

}

// @ts-ignore
@Form.create()
@inject('common', 'finance')
export default class RateEditor extends BaseReact<IRateEditorProps, IRateEditorState> {
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
    const { currentRate, currentShowRate, setCurrentRate, } = this.props.finance;
    const { getFieldDecorator, } = this.props.form;

    return (
      <div className='editor rate-editor'>
        <Form className='editor-form'>
          <Row style={{ textAlign: 'center', }} type='flex' justify="space-around" align="top">
            <Col span="5">类型</Col>
            <Col span="5">交易货币</Col>
            <Col span="5">支付货币</Col>
            <Col span="5">汇率</Col>
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
                  getFieldDecorator('pay_status', {
                    initialValue: currentShowRate && currentShowRate.pay_status,
                  })(
                    <Select
                      // style={{ width: 120 }}
                      // @ts-ignore
                      getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                      placeholder='请选择类型'
                      onChange={(value, elem: any) => {
                        setCurrentRate({
                          pay_status: value,
                        }, false);
                      }}
                      onFocus={async () => {

                      }}
                      disabled={currentShowRate.pay_status == 1}
                    >
                      {
                        [{ field: 'deposit', translation: '出金', }].map(item => (
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
              <Select
                // style={{ width: 120 }}
                // @ts-ignore
                getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                placeholder='请选择类型'
                onChange={(value, elem: any) => {
                  setCurrentRate({
                    pay_status: value,
                  }, false);
                }}
                onFocus={async () => {

                }}
                disabled={currentShowRate.pay_status == 1}
              >
                {
                  [{ field: 'deposit', translation: '出金', }].map(item => (
                    // @ts-ignore
                    <Option key={item.field}>
                      {item.translation}
                    </Option>
                  ))
                }
              </Select>
            </Col>
            <Col span="5">
              <Select
                // style={{ width: 120 }}
                // @ts-ignore
                getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                placeholder='请选择类型'
                onChange={(value, elem: any) => {
                  setCurrentRate({
                    pay_status: value,
                  }, false);
                }}
                onFocus={async () => {

                }}
                disabled={currentShowRate.pay_status == 1}
              >
                {
                  [{ field: 'deposit', translation: '出金', }].map(item => (
                    // @ts-ignore
                    <Option key={item.field}>
                      {item.translation}
                    </Option>
                  ))
                }
              </Select>
            </Col>
            <Col span="5">
              <FormItem>
                {getFieldDecorator('name', {
                  initialValue: currentRate.name,
                  rules: [
                  ],
                })(<Input type="number" placeholder='请输入姓名' />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}