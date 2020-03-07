
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Form, Input, Modal } from 'antd';
import { inject, observer } from 'mobx-react';

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface IAddGroupModalProps {
  onOk: () => void;
  onCancel: () => void;
}

interface IAddGroupModalState {
  confirmLoading: boolean;
}

// @ts-ignore
@Form.create()
@inject('common', 'group')
@observer
export default class EditPermissionModal extends BaseReact<IAddGroupModalProps, IAddGroupModalState> {
  state = {
    confirmLoading: false,
  }

  handleSubmit = async (evt) => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { onOk, } = this.props;

        let payload: any = {
          name: values.name,
        };

        this.setState({
          confirmLoading: true,
        });

        this.$api.group.createGroup(payload)
          .then(() => {
            this.$msg.success('客户组创建成功');
            onOk();
          }, () => {
            this.setState({
              confirmLoading: false,
            });
          });
      }
    });
  }

  render() {
    const { form, onCancel, } = this.props;
    const { confirmLoading, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title='添加'
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className='editor-form'>
          <FormItem label='客户组名称' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: '请填写客户组名称', }
              ],
            })(
              <Input placeholder="请输入客户组名称" />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}