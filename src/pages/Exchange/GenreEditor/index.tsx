import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import {
  Form,
  Input,
  Radio
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
const radioStyle = { display: 'block', marginBottom: 12, };

export interface IGenreEditorProps {

}

export interface IGenreEditorState {

}

// @ts-ignore
@Form.create()
@inject('common', 'exchange')
export default class GenreEditor extends BaseReact<IGenreEditorProps, IGenreEditorState> {
  state = {
  }

  async componentDidMount() {
    // this.props.onRef(this);
    // console.log('this.props :>> ', this.props);
  }

  render() {
    const { currentGenre, setCurrentGenre, } = this.props.exchange;
    const { getFieldDecorator, } = this.props.form;

    return (
      <div className='editor talent-editor'>
        <Form className='editor-form'>
          <FormItem label='类型名称' {...getFormItemLayout(6, 14)}>
            {getFieldDecorator('name', {
              initialValue: currentGenre.name,
              rules: [
              ],
            })(<Input placeholder='请输入品种类型名称' onChange={evt => {
              setCurrentGenre({
                name: evt.target.value,
              }, false);
            }} />)}
          </FormItem>
          <FormItem label='是否可用' required {...getFormItemLayout(6, 14)} className='editor-upshelf'>
            {getFieldDecorator('in_use', {
              initialValue: currentGenre && currentGenre.in_use,
            })(
              <Radio.Group onChange={(evt) => {
                setCurrentGenre({
                  in_use: evt.target.value,
                }, false);
              }}>
                <Radio style={radioStyle} value={1}>是</Radio>
                <Radio style={radioStyle} value={0}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}





class LagacyGenreEditor extends BaseReact<IGenreEditorProps, IGenreEditorState> {
  state = {
  }

  async componentDidMount() {
    this.props.onRef(this);
  }

  render() {
    const { currentGenre, setCurrentGenre, } = this.props.exchange;
    const { getFieldDecorator, } = this.props.form;

    return (
      <div className='editor talent-editor'>
        <Form className='editor-form'>
          <FormItem label='类型名称' {...getFormItemLayout(6, 14)}>
            {getFieldDecorator('name', {
              initialValue: currentGenre.name,
              rules: [
              ],
            })(<Input placeholder='请输入品种类型名称' onChange={evt => {
              setCurrentGenre({
                name: evt.target.value,
              }, false);
            }} />)}
          </FormItem>
          <FormItem label='是否可用' required {...getFormItemLayout(6, 14)} className='editor-upshelf'>
            {getFieldDecorator('in_use', {
              initialValue: currentGenre && currentGenre.in_use,
            })(
              <Radio.Group onChange={(evt) => {
                setCurrentGenre({
                  in_use: evt.target.value,
                }, false);
              }}>
                <Radio style={radioStyle} value={1}>是</Radio>
                <Radio style={radioStyle} value={0}>否</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}
