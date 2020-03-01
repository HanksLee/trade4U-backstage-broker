import {
  moonAPI
} from "utils/request";

const uploadFile = async (config) => moonAPI.post('/upload-file', config);

const getCodeImg = async (config) => moonAPI.get('/captcha', config);

const login = async (config) => moonAPI.post('/broker/login', config);

const getConstantByKey = async (key: string) => moonAPI.get(`/constant/${key}`);



export default {
  uploadFile,
  getCodeImg,
  login,
  getConstantByKey,
};
