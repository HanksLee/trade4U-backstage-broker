
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Form, Input, Modal, Cascader, Checkbox } from 'antd';
import { inject, observer } from 'mobx-react';
import { MenuType } from 'pages/Menus';

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface IEditPermissionModalProps {
  permission: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditPermissionModalState {
  menuOptions: MenuType [];
  confirmLoading: boolean;
}

// @ts-ignore
@Form.create()
@inject('common')
@observer
export default class EditPermissionModal extends BaseReact<IEditPermissionModalProps, IEditPermissionModalState> {
  state = {
    menuOptions: [],
    confirmLoading: false,
  }

  async componentDidMount() {
    const res = await this.$api.menus.getMenuList();
    this.setState({
      menuOptions: res.data,
    });
  }

  handleSubmit = async (evt) => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { permission, onOk, } = this.props;

        let payload: any = {
          name: values.name,
          code: values.code,
          parent_menu: values.menuIds[0],
          child_menu: values.menuIds[1],
          is_default: values.is_default ? 1 : 0,
        };

        this.setState({
          confirmLoading: true,
        });

        if (!permission) {
          this.$api.permission.createPermission(payload)
            .then(() => {
              this.$msg.success('权限创建成功');
              onOk();
            }, () => {
              this.setState({
                confirmLoading: false,
              });
            });
        } else {
          this.$api.permission.updatePermission(permission.id, payload)
            .then(() => {
              this.$msg.success('权限更新成功');
              onOk();
            }, () => {
              this.setState({
                confirmLoading: false,
              });
            });
        }
      }
    });
  }

  render() {
    const { form, permission, onCancel, } = this.props;
    const { menuOptions, confirmLoading, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title={permission ? '编辑' : '添加'}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className='editor-form'>
          <FormItem label='所属菜单' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('menuIds', {
              initialValue: permission && [permission.parent_menu, permission.child_menu],
              rules: [
                { required: true, message: '请选择所属菜单', }
              ],
            })(
              <Cascader
                placeholder="请选择菜单"
                options={menuOptions}
                fieldNames={{ label: 'name', value: 'id', }}
              />)}
          </FormItem>
          <FormItem label='权限名称' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('name', {
              initialValue: permission && permission.name,
              rules: [
                { required: true, message: '请填写权限名称', }
              ],
            })(
              <Input placeholder="请输入权限名称" />
            )}
          </FormItem>
          <FormItem label='code' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('code', {
              initialValue: permission && permission.code,
              rules: [
                { required: true, message: '请填写权限码', }
              ],
            })(
              <Input placeholder="请输入code" />
            )}
          </FormItem>
          <FormItem label='是否默认' {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator('is_default', {
              initialValue: !!(permission && permission.is_default),
              valuePropName: 'checked',
            })(
              <Checkbox />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}