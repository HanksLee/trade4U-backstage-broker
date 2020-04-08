import * as React from "react";
import utils from "utils";
import { BaseReact } from "components/BaseReact";
import { Form, Input, Modal, Cascader } from "antd";
import { inject, observer } from "mobx-react";
// import { stringify } from "querystring";
// import Password from "antd/lib/input/Password";

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface IEditUserModalProps {
  user: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditUserModalState {
  roleList: any[];
  defaultRole: any[];
  confirmLoading: boolean;
  writable: boolean;
  passwordLabel: string;
  checkPasswordLabel: string;
  pwdRequired: boolean;
}

// @ts-ignore
@Form.create()
@inject("common")
@observer
export default class EditUserModal extends BaseReact<
IEditUserModalProps,
IEditUserModalState
> {
  state = {
    confirmLoading: false,
    writable: true,
    roleList: [],
    defaultRole: [],
    passwordLabel: "",
    checkPasswordLabel: "",
    pwdRequired: true,
  };

  componentDidMount() {
    this.getRoleList();
    this.checkUserState();
  }

  checkUserState() {
    const { user, } = this.props;
    if (!user) {
      this.setState({
        writable: false,
        passwordLabel: "密码",
        checkPasswordLabel: "确认密码",
        pwdRequired: true,
      });
    } else {
      this.setState({
        writable: true,
        passwordLabel: "新密码",
        checkPasswordLabel: "确认新密码",
        pwdRequired: false,
      });
    }
  }

  getRoleList = async () => {
    const rolesTempArray = [];
    const res = await this.$api.role.getRoleList();
    for await (let obj of res.data.results) {
      rolesTempArray.push({ value: String(obj.id), label: obj.name, });
    }
    this.setState({
      roleList: rolesTempArray,
      defaultRole: [String(rolesTempArray[0].value)],
    });
  };

  handleSubmit = async evt => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { user, onOk, } = this.props;

        let payload: any = {
          role: Number(values.role),
        };

        if (!utils.isEmpty(values.password)) {
          payload.password = values.password;
        }

        this.setState({
          confirmLoading: true,
        });

        if (!user) {
          payload.username = values.name;
          payload.status = values.status;
          this.$api.manager.addManager(payload).then(
            () => {
              this.$msg.success("用户创建成功");
              onOk();
            },
            () => {
              this.setState({
                confirmLoading: false,
              });
            }
          );
        } else {
          this.$api.manager.updateManager(user.id, payload).then(
            () => {
              this.$msg.success("用户更新成功");
              onOk();
            },
            () => {
              this.setState({
                confirmLoading: false,
              });
            }
          );
        }
      }
    });
  };

  render() {
    const { form, user, onCancel, } = this.props;
    const {
      confirmLoading,
      writable,
      roleList,
      passwordLabel,
      checkPasswordLabel,
      pwdRequired,
      defaultRole,
    } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title={user ? "编辑用户" : "添加用户"}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
      >
        <Form className="editor-form">
          <FormItem label="用户名" {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator("name", {
              initialValue: user && user.username,
              rules: [
                { required: true, message: "用户名不能为空", },
                {
                  pattern: new RegExp("^\\w+$", "g"),
                  message: "用户名必须为字母或者数字",
                }
              ],
            })(<Input placeholder="请输入用户名" disabled={writable} />)}
          </FormItem>
          <FormItem
            label={passwordLabel}
            {...getFormItemLayout(5, 13)}
            required={pwdRequired}
          >
            {getFieldDecorator("password", {
              initialValue: "",
              rules: [
                { required: pwdRequired, message: "密码不能为空值", },
                {
                  pattern: new RegExp("^\\w+$", "g"),
                  message: "密码必须为字母或者数字",
                }
              ],
            })(<Input.Password placeholder="请输入密码" />)}
          </FormItem>
          <FormItem
            label={checkPasswordLabel}
            {...getFormItemLayout(5, 13)}
            required={pwdRequired}
          >
            {getFieldDecorator("checkPassword", {
              dependencies: ["password"],
              initialValue: "",
              rules: [
                { required: pwdRequired, message: "密码不能为空值", },
                {
                  validator: (rule, value, callback) => {
                    const form = this.props.form;
                    if (value && value !== form.getFieldValue("password")) {
                      callback("确认密码与密码不同");
                    } else {
                      callback();
                    }
                  },
                }
              ],
            })(<Input.Password placeholder="请再次输入密码" />)}
          </FormItem>
          <FormItem label="角色" {...getFormItemLayout(5, 13)} required>
            {getFieldDecorator("role", {
              initialValue: (user && [String(user.role)]) || defaultRole,
              rules: [{ required: true, message: "角色不能为空值", }],
            })(<Cascader options={roleList} />)}
          </FormItem>
          {!user && (
            <FormItem label="状态" {...getFormItemLayout(5, 13)} required>
              {getFieldDecorator("status", {
                initialValue: (user && [String(user.status)]) || ["1"],
                rules: [{ required: true, message: "状态不能为空值", }],
              })(
                <Cascader
                  options={[
                    {
                      value: "1",
                      label: "启用",
                    },
                    {
                      value: "0",
                      label: "禁用",
                    }
                  ]}
                />
              )}
            </FormItem>
          )}
        </Form>
      </Modal>
    );
  }
}
