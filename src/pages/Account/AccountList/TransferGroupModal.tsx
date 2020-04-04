
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Form, Modal, Select } from 'antd';

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface ICustomModalProps {
  accounts: any[];
  onOk: () => void;
  onCancel: () => void;
}

interface ICustomModalState {
  confirmLoading: boolean;
  customOptions: any[];
}

// @ts-ignore
@Form.create()
export default class TransferCustomModal extends BaseReact<ICustomModalProps, ICustomModalState> {
  state: ICustomModalState = {
    confirmLoading: false,
    customOptions: [],
  }

  async componentDidMount() {
    const res = await this.$api.group.getGroupList({
      param: {
        current_page: 1,
        page_size: 100,
      },
    });
    this.setState({
      customOptions: res.data.results,
    });
  }


  handleSubmit = async (evt) => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { accounts, } = this.props;

        let payload: any = {
          obj: accounts,
        };

        this.setState({
          confirmLoading: true,
        });

        const res = await this.$api.account.batchTransferAccountToGroup(values.group_id, payload);
        if (res.status == 200) {
          this.$msg.success('划转客户组成功');
          setTimeout(()=> {
            this.props.onOk();
          }, 300);
        }

        this.setState({
          confirmLoading: false,
        });
      }
    });
  }

  render() {
    const { form, username, phone, balance, onCancel, } = this.props;
    const { confirmLoading, customOptions, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title="分配客户组"
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className='editor-form'>
          <FormItem label='客户组' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('group_id', {
              rules: [
                { required: true, message: '请选择客户组', }
              ],
            })(
              <Select
                placeholder="请选择客户组"
                style={{ width: '200px', }}
              >
                {
                  customOptions.map(cause => <Select.Option value={cause.id}>{cause.name}</Select.Option>)
                }
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}