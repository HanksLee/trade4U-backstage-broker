import * as React from "react";
import utils from "utils";
import { BaseReact } from "components/BaseReact";
import { Form, Input, Modal, Cascader, Checkbox } from "antd";
import { inject, observer } from "mobx-react";
import Editor from "components/Editor";
import value from "*.json";
// import { stringify } from "querystring";
// import Password from "antd/lib/input/Password";

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface IEditSMSChannelModalProps {
  smsChannel: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditSMSChannelModalState {
  confirmLoading: boolean;
  // editorContent: string;
  extra_params: string;
}

// @ts-ignore
@Form.create()
@inject("common")
@observer
export default class EditSMSChannelModal extends BaseReact<
IEditSMSChannelModalProps,
IEditSMSChannelModalState
> {
  state = {
    confirmLoading: false,
    // editorContent: "",
    extra_params: "",
  };

  componentDidMount() {
    this.convertExtraParams();
  }

  convertExtraParams = () => {
    const { smsChannel, } = this.props;
    if (smsChannel) {
      const extra_params = JSON.parse(smsChannel["extra_params"]);
      let extra_params_str = "";
      for (let item in extra_params) {
        extra_params_str += `${extra_params[item]}:${item};`;
      }

      this.setState({ extra_params: extra_params_str, });
    }
  };

  // getEditorContent = val => {
  //   this.setState({ editorContent: val, });
  // };

  extraParamsCheck = (rule, value, callback) => {
    let startWord = 0;
    let endWord = 0;
    try {
      if (!utils.isEmpty(value) && !/[;]$/g.test(value)) {
        throw new Error("请依照abc:123;格式填写");
      } else if (!utils.isEmpty(value) && /[;]$/g.test(value)) {
        let valueArr = value.split(";");
        for (const item of valueArr) {
          if (!utils.isEmpty(item)) {
            endWord = startWord + item.length + 1;
            if (
              !/^([A-Za-z0-9_\-])+\:([A-Za-z0-9_\-])+\;$/g.test(
                value.slice(startWord, endWord)
              )
            ) {
              throw new Error("请依照abc:123;格式填写");
            } else {
              startWord = endWord;
            }
          }
        }
      }
      callback();
    } catch (err) {
      callback(err);
      return false;
    }
  };

  handleSubmit = async evt => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { smsChannel, onOk, } = this.props;
        // const { editorContent, } = this.state;

        const extra_params = {};

        if (!utils.isEmpty(values.extra_params)) {
          const tempArr = values.extra_params.split(";");
          for (let item of tempArr) {
            if (!utils.isEmpty(item)) {
              let item_key = item.split(":")[0];
              let item_value = item.split(":")[1];
              extra_params[item_key] = item_value;
            }
          }
        }

        let payload: any = {
          type: values.type,
          key: values.key,
          status: values.status ? 1 : 0,
          extra_params: JSON.stringify(extra_params),
        };

        // if (!utils.isEmpty(editorContent)) {
        //   payload.description = editorContent;
        // }

        if (!utils.isEmpty(values.description)) {
          payload.description = values.description;
        }

        this.setState({
          confirmLoading: true,
        });

        if (!smsChannel) {
          this.$api.sms.addSMSChannel(payload).then(
            () => {
              this.$msg.success("通道创建成功");
              onOk();
            },
            () => {
              this.setState({
                confirmLoading: false,
              });
            }
          );
        } else {
          this.$api.sms.updateSMSChannel(smsChannel.id, payload).then(
            () => {
              this.$msg.success("通道更新成功");
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
    const { form, smsChannel, onCancel, } = this.props;
    const { confirmLoading, extra_params, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;
    // const { TextArea } = Input;

    return (
      <Modal
        visible={true}
        title={!smsChannel ? "新增通道" : "更新通道"}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        // width="70%"
      >
        <Form className="editor-form">
          <FormItem label="类型" {...getFormItemLayout(3, 12)} required>
            {getFieldDecorator("type", {
              initialValue: (smsChannel && smsChannel.type) || "",
              rules: [{ required: true, message: "类型不能為空", }],
            })(<Input placeholder="请输入类型" />)}
          </FormItem>
          <FormItem label="API Key" {...getFormItemLayout(3, 12)} required>
            {getFieldDecorator("key", {
              initialValue: (smsChannel && smsChannel.key) || "",
              rules: [{ required: true, message: "API Key不能為空", }],
            })(<Input placeholder="请输入API Key" />)}
          </FormItem>
          {!smsChannel && (
            <FormItem label="是否启用" {...getFormItemLayout(3, 12)}>
              {getFieldDecorator("status", {
                initialValue: false,
                valuePropName: "checked",
              })(<Checkbox />)}
            </FormItem>
          )}
          <FormItem label="额外参数" {...getFormItemLayout(3, 12)}>
            {getFieldDecorator("extra_params", {
              initialValue: (smsChannel && extra_params) || "",
              rules: [
                {
                  validator: this.extraParamsCheck,
                }
              ],
              validateTrigger: "onBlur",
            })(<Input placeholder="请输入额外参数，如：abc:123;def:456;" />)}
          </FormItem>
          <FormItem label="描述" {...getFormItemLayout(3, 12)}>
            {getFieldDecorator("description", {
              initialValue: (smsChannel && smsChannel.description) || "",
              // rules: [{ required: true, message: "分類名稱不能為空" }]
            })(
              <Input placeholder="请输入描述" />
              // <Editor
              //   getEditorContent={this.getEditorContent}
              //   setEditorContent={(smsChannel && smsChannel.description) || ""}
              // />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
