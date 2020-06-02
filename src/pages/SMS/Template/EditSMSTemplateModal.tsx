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
  labelCol: { span: label, offset },
  wrapperCol: { span: wrapper }
});

interface IEditSMSTemplateModalProps {
  smsTemplate: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditSMSTemplateModalState {
  confirmLoading: boolean;
  // editorContent: string;
}

// @ts-ignore
@Form.create()
@inject("common")
@observer
export default class EditSMSTemplateModal extends BaseReact<
  IEditSMSTemplateModalProps,
  IEditSMSTemplateModalState
> {
  state = {
    confirmLoading: false
    // editorContent: "",
  };

  componentDidMount() {}

  // getEditorContent = val => {
  //   this.setState({ editorContent: val, });
  // };

  handleSubmit = async evt => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { smsTemplate, onOk } = this.props;
        // const { editorContent, } = this.state;

        let payload: any = {
          type: values.type,
          status: values.status ? 1 : 0
        };

        // if (!utils.isEmpty(editorContent)) {
        //   payload.content = editorContent;
        // }

        if (!utils.isEmpty(values.content)) {
          payload.content = values.content;
        }

        this.setState({
          confirmLoading: true
        });

        if (!smsTemplate) {
          this.$api.sms.addSMSTemplate(payload).then(
            () => {
              this.$msg.success("通道模版创建成功");
              onOk();
            },
            () => {
              this.setState({
                confirmLoading: false
              });
            }
          );
        } else {
          this.$api.sms.updateSMSTemplate(smsTemplate.id, payload).then(
            () => {
              this.$msg.success("通道模版更新成功");
              onOk();
            },
            () => {
              this.setState({
                confirmLoading: false
              });
            }
          );
        }
      }
    });
  };

  render() {
    const { form, smsTemplate, onCancel } = this.props;
    const { confirmLoading } = this.state;
    const getFieldDecorator = form.getFieldDecorator;
    // const { TextArea } = Input;

    return (
      <Modal
        visible={true}
        title={!smsTemplate ? "新增通道模版" : "更新通道模版"}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        // width="70%"
      >
        <Form className="editor-form">
          <FormItem label="类型" {...getFormItemLayout(3, 12)} required>
            {getFieldDecorator("type", {
              initialValue: (smsTemplate && smsTemplate.type) || "",
              rules: [{ required: true, message: "类型不能為空" }]
            })(<Input placeholder="请输入类型" />)}
          </FormItem>
          {!smsTemplate && (
            <FormItem label="是否启用" {...getFormItemLayout(3, 12)}>
              {getFieldDecorator("status", {
                initialValue: false,
                valuePropName: "checked"
              })(<Checkbox />)}
            </FormItem>
          )}
          <FormItem label="短信内容" {...getFormItemLayout(3, 12)}>
            {getFieldDecorator("content", {
              initialValue: (smsTemplate && smsTemplate.content) || ""
              // rules: [{ required: true, message: "分類名稱不能為空" }]
            })(
              <Input placeholder="短信内容" />
              // <Editor
              //   getEditorContent={this.getEditorContent}
              //   setEditorContent={(smsTemplate && smsTemplate.content) || ""}
              // />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
