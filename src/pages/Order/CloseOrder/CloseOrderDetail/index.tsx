import Validator from 'utils/validator';
import * as React from 'react';
import { BaseReact } from 'components/BaseReact';
import { Form, Input, Button, Upload, Icon, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import { RcFile } from 'antd/lib/upload';
import '../../index.scss';

const FormItem = Form.Item;

// @ts-ignore
@Form.create()
@inject('common', 'account')
@observer
export default class AccountEditor extends BaseReact<{}> {
  state = {
    mode: 'add',
    accountDetail: null,
    countryOptions: [],
  }

  componentDidMount() {
    const { location, } = this.props;
    const search = this.$qs.parse(location.search);
    this.setState({
      mode: search.id === '0' ? 'add' : 'edit',
    });

    if (search.id !== '0') {
      this.getAccountDetail(search.id);
    }

    this.getCountryOptions();
  }

  getAccountDetail = async (id: string) => {
    const res = await this.$api.account.getAccountDetail(id);
    this.setState({
      accountDetail: res.data,
    });
  }

  getCountryOptions = async () => {
    const res = await this.$api.common.getConstantByKey('country_choices');
    this.setState({
      countryOptions: res.data.data,
    });
  }

  renderEditor = () => {
    const { getFieldDecorator, } = this.props.form;
    const { accountDetail, mode, countryOptions, } = this.state;

    return (
      <Form className='editor-form account-editor-form' layout="inline">
        <FormItem label="姓" required>
          {getFieldDecorator('last_name', {
            initialValue: accountDetail && accountDetail.last_name,
          })(
            <Input placeholder="请输入姓氏" onChange={evt => {
              this.setCurrentAccount({
                last_name: evt.target.value,
              });
            }} style={{ display: 'inline-block', width: 200, }} />
          )}
        </FormItem>
        <FormItem label="名" required>
          {getFieldDecorator('first_name', {
            initialValue: accountDetail && accountDetail.first_name,
          })(
            <Input placeholder="请输入名字" onChange={evt => {
              this.setCurrentAccount({
                first_name: evt.target.value,
              });
            }} style={{ display: 'inline-block', width: 200, }} />
          )}
        </FormItem>
        <FormItem label="手机号" required>
          {getFieldDecorator('phone', {
            initialValue: accountDetail && accountDetail.phone,
          })(
            <Input placeholder="请输入手机号" onChange={evt => {
              this.setCurrentAccount({
                phone: evt.target.value,
              });
            }} style={{ display: 'inline-block', width: 200, }} />
          )}
        </FormItem>
        <FormItem label="生日">
          {getFieldDecorator('birth', {
            initialValue: accountDetail && accountDetail.birth,
          })(
            <Input placeholder="请输入生日" onChange={evt => {
              this.setCurrentAccount({
                birth: evt.target.value,
              });
            }} style={{ display: 'inline-block', width: 200, }} />
          )}
        </FormItem>
        <FormItem label="邮箱">
          {getFieldDecorator('email', {
            initialValue: accountDetail && accountDetail.email,
          })(
            <Input placeholder="请输入邮箱" onChange={evt => {
              this.setCurrentAccount({
                email: evt.target.value,
              });
            }} style={{ display: 'inline-block', width: 200, }} />
          )}
        </FormItem>
        <FormItem label="电话">
          {getFieldDecorator('mobile', {
            initialValue: accountDetail && accountDetail.mobile,
          })(
            <Input placeholder="请输入电话" onChange={evt => {
              this.setCurrentAccount({
                mobile: evt.target.value,
              });
            }} style={{ display: 'inline-block', width: 200, }} />
          )}
        </FormItem>
        <FormItem label="国籍">
          {getFieldDecorator('nationality', {
            initialValue: accountDetail && accountDetail.nationality,
          })(
            <Select placeholder="请输入国籍" style={{ width: '200px', }} onChange={value => {
              this.setCurrentAccount({
                nationality: value,
              });
            }}>
              {
                countryOptions.map(cause => <Select.Option value={cause.field}>{cause.translation}</Select.Option>)
              }
            </Select>
          )}
        </FormItem>
        <FormItem label="居住国">
          {getFieldDecorator('country_of_residence', {
            initialValue: accountDetail && accountDetail.country_of_residence,
          })(
            <Select placeholder="请输入居住国" style={{ width: '200px', }} onChange={value => {
              this.setCurrentAccount({
                country_of_residence: value,
              });
            }}>
              {
                countryOptions.map(cause => <Select.Option value={cause.field}>{cause.translation}</Select.Option>)
              }
            </Select>
          )}
        </FormItem>
        <FormItem label="城市">
          {getFieldDecorator('city', {
            initialValue: accountDetail && accountDetail.city,
          })(
            <Input placeholder="请输入城市" onChange={evt => {
              this.setCurrentAccount({
                city: evt.target.value,
              });
            }} style={{ display: 'inline-block', width: 200, }} />
          )}
        </FormItem>
        <FormItem label="街道">
          {getFieldDecorator('street', {
            initialValue: accountDetail && accountDetail.street,
          })(
            <Input placeholder="请输入街道" onChange={evt => {
              this.setCurrentAccount({
                street: evt.target.value,
              });
            }} style={{ display: 'inline-block', width: 200, }} />
          )}
        </FormItem>
        <FormItem label="邮编">
          {getFieldDecorator('postal', {
            initialValue: accountDetail && accountDetail.postal,
          })(
            <Input placeholder="请输入邮编" onChange={evt => {
              this.setCurrentAccount({
                postal: evt.target.value,
              });
            }} style={{ display: 'inline-block', width: 200, }} />
          )}
        </FormItem>
        {
          mode === 'add' && (
            <FormItem label="密码" required>
              {getFieldDecorator('password', {
                initialValue: accountDetail && accountDetail.password,
              })(
                <Input placeholder="请输入密码" type="password" onChange={evt => {
                  this.setCurrentAccount({
                    password: evt.target.value,
                  });
                }} style={{ display: 'inline-block', width: 200, }} />
              )}
            </FormItem>
          )
        }
        <div className="id-card-form">
          <FormItem>
            {getFieldDecorator('id_card_front', {
              valuePropName: 'fileList',
            })(
              <Upload
                accept="image/*"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={this.beforeIdCardFrontUpload}
              >
                {
                  accountDetail && accountDetail.id_card_front
                    ? (
                      <div
                        className="upload-image-preview"
                        style={{ backgroundImage: `url(${accountDetail.id_card_front})`, }}
                      />
                    )
                    : <div className="upload-image-preview"><Icon type="plus" /></div>
                }
              </Upload>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('id_card_back', {
              valuePropName: 'fileList',
            })(
              <Upload
                accept="image/*"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={this.beforeIdCardBackUpload}
              >
                {
                  accountDetail && accountDetail.id_card_back
                    ? (
                      <div
                        className="upload-image-preview"
                        style={{ backgroundImage: `url(${accountDetail.id_card_back})`, }}
                      />
                    )
                    : <div className="upload-image-preview"><Icon type="plus" /></div>
                }
              </Upload>
            )}
          </FormItem>
        </div>
        <div>
          <FormItem className='editor-form-btns'>
            <Button type='primary' onClick={this.handleSubmit}>
              {this.state.mode === 'edit' ? '确认修改' : '保存'}
            </Button>
            <Button onClick={this.goBack}>取消</Button>
          </FormItem>
        </div>
      </Form>
    );
  }

  setCurrentAccount = (field: any) => {
    this.setState({
      accountDetail: { ...this.state.accountDetail, ...field, },
    });
  }

  beforeIdCardFrontUpload = (file: RcFile) => {
    this.uploadFile(file, 'id_card_front');
    return false;
  }

  beforeIdCardBackUpload = (file: RcFile) => {
    this.uploadFile(file, 'id_card_back');
    return false;
  }

  uploadFile = async (file: RcFile, name: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await this.$api.common.uploadFile(formData);
    this.setCurrentAccount({
      [name]: res.data.file_path,
    });
  }

  goBack = () => {
    this.props.history.goBack();
  }

  handleSubmit = async (evt) => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { accountDetail, } = this.state;

        const { mode, } = this.state;
        let payload: any = {};

        Object.keys(values).forEach(item => {
          if (values[item] !== undefined) {
            payload[item] = accountDetail[item];
          }
        });

        const errMsg = this.getValidation(payload);
        if (errMsg) return this.$msg.warn(errMsg);

        if (mode == 'add') {
          this.$api.account.createAccount(payload)
            .then(res => {
              this.$msg.success('客户创建成功');
              this.goBack();
              this.props.getAccountList();
            });
        } else {
          this.$api.account.updateAccount(accountDetail.id, payload)
            .then(res => {
              this.$msg.success('客户更新成功');
              this.goBack();
              this.props.getAccountList();
            });
        }
      }
    });
  }

  getValidation = (payload: any) => {
    const validator = new Validator();

    validator.add(payload.first_name, [
      {
        strategy: 'isNonEmpty',
        errMsg: '请输入姓氏',
      }
    ]);

    validator.add(payload.last_name, [
      {
        strategy: 'isNonEmpty',
        errMsg: '请输入名字',
      }
    ]);

    if (this.state.mode === 'add') {
      validator.add(payload.password, [
        {
          strategy: 'isNonEmpty',
          errMsg: '请输入密码',
        }
      ]);
    }

    let errMsg: any = validator.start();

    return errMsg;
  }

  render() {
    return (
      <div className='editor food-card-editor'>
        <section className='editor-content panel-block'>
          {this.renderEditor()}
        </section>
      </div>
    );
  }
}