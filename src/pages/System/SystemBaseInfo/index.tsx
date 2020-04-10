import * as React from "react";
import { BaseReact } from "components/BaseReact";
import { Form, Input, Button, Upload, Icon } from "antd";
import CommonHeader from "components/CommonHeader";
import withRoute from "components/WithRoute";
import { PAGE_PERMISSION_MAP } from "constant";
import "./index.scss";
import { inject, observer } from "mobx-react";
import { RcFile } from "antd/lib/upload";
// import utils from "utils";

const FormItem = Form.Item;
// const Option = Select.Option;
// const confirm = Modal.confirm;
// const TextArea = Input.TextArea;
// const radioStyle = { display: "block", marginBottom: 12 };
// const RangePicker = DatePicker.RangePicker;

const getFormItemLayout = (
  label: number,
  wrapper: number,
  offset?: undefined
) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

export interface ISystemBaseInfoEditorProps {}

export interface ISystemBaseInfoEditorState {
  id: string;
  name: string;
  domain: string;
  background_corner: string;
  logo: string;
  company_logo: string;
}

// @ts-ignore

@withRoute("/dashboard/system/baseinfo", {
  exact: false,
  permissionCode: PAGE_PERMISSION_MAP["/dashboard/system/baseinfo"],
})
@Form.create()
@inject("common", "system")
@observer
export default class SystemBaseInfoEditor extends BaseReact<
ISystemBaseInfoEditorProps,
ISystemBaseInfoEditorState
> {
  state = {
    id: "",
    name: "",
    domain: "",
    background_corner: "",
    logo: "",
    company_logo: "",
  };

  async componentDidMount() {
    this.getList();
  }

  componentWillUnmount() {
    // this.props.product.setCurrentProduct({}, true, false);
  }

  getList = async () => {
    const res = await this.$api.system.getBrokerDealerList();
    if (res.status === 200) {
      this.setState({
        name: res.data.name,
        domain: res.data.domain,
        logo: res.data.logo,
        id: res.data.id,
      });
    }
  };

  renderEditor = () => {
    const { getFieldDecorator, } = this.props.form;
    const { name, domain, logo, } = this.state;
    return (
      <Form className="editor-form">
        <FormItem>
          <h2 className="editor-form-title form-title">基础信息</h2>
        </FormItem>
        <FormItem label="domain" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("domain", {
            initialValue: domain || "",
            rules: [
              {
                pattern: /[a-zA-Z]+/,
                message: "只能输入英文",
              }
            ],
          })(
            <Input
              placeholder="domain"
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem label="网站标题" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("name", {
            initialValue: name || "",
          })(
            <Input
              placeholder="请输入网站标题"
              style={{ display: "inline-block", width: 200, }}
            />
          )}
        </FormItem>
        <FormItem label="logo" {...getFormItemLayout(3, 12)}>
          {getFieldDecorator("logo", {
            valuePropName: "fileList",
          })(
            <Upload
              accept="image/*"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={this.beforeIdCardBackUpload}
            >
              {logo ? (
                <div
                  className="upload-image-preview"
                  style={{ backgroundImage: `url(${logo})`, }}
                />
              ) : (
                <div className="upload-image-preview">
                  <Icon type="plus" />
                </div>
              )}
            </Upload>
          )}
        </FormItem>
        <FormItem className="editor-form-btns">
          {
            <Button type="primary" onClick={this.handleSubmit}>
              保存
            </Button>
          }
        </FormItem>
      </Form>
    );
  };

  beforeIdCardBackUpload = (file: RcFile) => {
    this.uploadFile(file, "logo");
    return false;
  };

  uploadFile = async (file: RcFile, name: string) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await this.$api.common.uploadFile(formData);
    this.setState({
      logo: res.data.file_path,
    });
  };

  handleSubmit = async (evt: any) => {
    const { logo, } = this.state;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let payload: any = {
          domain: values.domain,
          name: values.name,
          logo,
        };
        const res = await this.$api.system.updateBrokerDealer(payload);

        if (res.status === 200) {
          this.$msg.success("基础信息更新成功");
          // document.title = res.data.
        }
        //     const { currentProduct } = this.props.product;
        //     const { mode } = this.state;
        //     let payload: any = {
        //       name: currentProduct.name,
        //       type: currentProduct.type,
        //       product: currentProduct.product,
        //       decimals_place: currentProduct.decimals_place,
        //       contract_size: currentProduct.contract_size,
        //       spread: currentProduct.spread,
        //       limit_stop_level: currentProduct.limit_stop_level,
        //       margin_currency: currentProduct.margin_currency,
        //       profit_currency: currentProduct.profit_currency,
        //       max_trading_volume: currentProduct.max_trading_volume,
        //       min_trading_volume: currentProduct.min_trading_volume,
        //       volume_step: currentProduct.volume_step,
        //       min_unit_of_price_change: currentProduct.min_unit_of_price_change,
        //       transaction_mode: currentProduct.transaction_mode,
        //       purchase_fee: currentProduct.purchase_fee,
        //       selling_fee: currentProduct.selling_fee,
        //       description: currentProduct.description,
        //       background: currentProduct.background,
        //       orders_mode: currentProduct.orders_mode,
        //       hands_fee_for_bought: currentProduct.hands_fee_for_bought,
        //       hands_fee_for_sale: currentProduct.hands_fee_for_sale,
        //       three_days_swap: currentProduct.three_days_swap,
        //       trading_times: currentProduct.trading_times,
        //       calculate_for_cash_deposit: currentProduct.calculate_for_cash_deposit,
        //       profit_calculate_for_bought:
        //         currentProduct.profit_calculate_for_bought,
        //       profit_calculate_for_sale: currentProduct.profit_calculate_for_sale,
        //       calculate_for_fee: currentProduct.calculate_for_fee,
        //       calculate_for_tax: currentProduct.calculate_for_tax
        //     };
        //     // console.log('payload', payload);
        //     // const errMsg = this.getValidation(payload);
        //     // payload.trading_times = JSON.stringify(payload.trading_times);
        //     // if (errMsg) return this.$msg.warn(errMsg);
        //     if (mode == "add") {
        //       const res = await this.$api.product.createProduct(payload);
        //       if (res.status == 201) {
        //         this.$msg.success("交易品种创建成功");
        //         setTimeout(() => {
        //           this.goBack();
        //           this.props.product.getProductList({
        //             current_page: this.props.product.filterProduct.current_page,
        //             page_size: this.props.product.filterProduct.page_size
        //           });
        //         }, 1500);
        //       }
        //     } else {
        //       const res = await this.$api.product.updateProduct(
        //         currentProduct.id,
        //         payload
        //       );
        //       if (res.status == 200) {
        //         this.$msg.success("交易品种更新成功");
        //         setTimeout(() => {
        //           this.goBack();
        //           this.props.product.getProductList({
        //             current_page: this.props.product.filterProduct.current_page,
        //             page_size: this.props.product.filterProduct.page_size
        //           });
        //         }, 1500);
        //       }
        //     }
      }
    });
  };

  render() {
    return (
      <>
        <CommonHeader {...this.props} links={[]} title="基础信息" />
        <div className="editor food-card-editor">
          <section className="editor-content panel-block">
            {this.renderEditor()}
          </section>
        </div>
      </>
    );
  }
}
