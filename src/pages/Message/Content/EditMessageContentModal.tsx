import * as React from "react";
import utils from "utils";
import { BaseReact } from "components/BaseReact";
import { Form, Input, Modal, Cascader, Checkbox } from "antd";
import { inject, observer } from "mobx-react";
import Editor from "components/Editor";
// import { stringify } from "querystring";
// import Password from "antd/lib/input/Password";
import "./index.scss";

const FormItem = Form.Item;
const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

interface IEditMessageContentModalProps {
  brokerId: number;
  messageContent: any;
  onOk: () => void;
  onCancel: () => void;
}

interface IEditMessageContentModalState {
  confirmLoading: boolean;
  brokerId: number;
  typeList: any[];
  defaultType: any[];
  editorContent: string;
}

// @ts-ignore
@Form.create()
@inject("common")
@observer
export default class EditMessageContentModal extends BaseReact<
IEditMessageContentModalProps,
IEditMessageContentModalState
> {
  state = {
    confirmLoading: false,
    brokerId: null,
    typeList: [],
    defaultType: [],
    editorContent: "",
  };

  componentDidMount() {
    this.getTypeList();
  }

  getTypeList = async () => {
    const rolesTempArray = [];
    const res = await this.$api.message.getMessageTypeList();
    for await (let obj of res.data.results) {
      rolesTempArray.push({ value: String(obj.id), label: obj.title, });
    }
    this.setState({
      typeList: rolesTempArray,
      defaultType: [String(rolesTempArray[0].value)],
    });
  };

  getEditorContent = val => {
    this.setState({ editorContent: val, });
  };

  handleSubmit = async evt => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { messageContent, onOk, brokerId, } = this.props;
        const { editorContent, typeList, } = this.state;

        let message_type_title = typeList.find(function(item, index, array) {
          return item.value == values.message_type.join();
        });

        let payload: any = {
          broker: brokerId,
          title: values.title,
          message_type: values.message_type.join(),
          message_type_title: message_type_title.label,
        };

        if (!utils.isEmpty(editorContent)) {
          payload.content = editorContent;
        }

        if (!messageContent) {
          const is_display = values.is_display ? 1 : 0;
          payload.is_display = is_display;
        }

        this.setState({
          confirmLoading: true,
        });

        if (!messageContent) {
          this.$api.message.addMessageContent(payload).then(
            () => {
              this.$msg.success("??????????????????");
              onOk();
            },
            () => {
              this.setState({
                confirmLoading: false,
              });
            }
          );
        } else {
          this.$api.message
            .updateMessageContent(messageContent.id, payload)
            .then(
              () => {
                this.$msg.success("??????????????????");
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
    const { form, messageContent, onCancel, } = this.props;
    const { confirmLoading, defaultType, typeList, } = this.state;
    const getFieldDecorator = form.getFieldDecorator;

    return (
      <Modal
        visible={true}
        title={!messageContent ? "????????????" : "????????????"}
        onOk={this.handleSubmit}
        onCancel={onCancel}
        confirmLoading={confirmLoading}
        width="70%"
      >
        <Form className="editor-form">
          <FormItem label="????????????" {...getFormItemLayout(3, 8)} required>
            {getFieldDecorator("title", {
              initialValue: (messageContent && messageContent.title) || "",
              rules: [{ required: true, message: "????????????????????????", }],
            })(<Input placeholder="?????????????????????" />)}
          </FormItem>
          <FormItem label="????????????" {...getFormItemLayout(3, 8)} required>
            {getFieldDecorator("message_type", {
              initialValue:
                (messageContent && [String(messageContent.message_type)]) ||
                defaultType,
              rules: [{ required: true, message: "???????????????????????????", }],
            })(<Cascader options={typeList} />)}
          </FormItem>
          {!messageContent && (
            <FormItem label="????????????" {...getFormItemLayout(3, 13)}>
              {getFieldDecorator("is_display", {
                initialValue: false,
                valuePropName: "checked",
              })(<Checkbox />)}
            </FormItem>
          )}
          <FormItem label="????????????" {...getFormItemLayout(3, 19)}>
            {getFieldDecorator("content", {
              initialValue: (messageContent && messageContent.content) || "",
              // rules: [{ required: true, message: "???????????????????????????" }]
            })(
              <Editor
                getEditorContent={this.getEditorContent}
                setEditorContent={
                  (messageContent && messageContent.content) || ""
                }
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
