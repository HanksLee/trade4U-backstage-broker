import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getRiskList = (start_time: number, end_time: number, username: string, phone: string, config: AxiosRequestConfig): Promise<any> =>
  API.get(`/broker/risk-control/sls?start_time=${start_time
  }&end_time=${end_time
  }${
    username ?
      `&username=${username}`
      : ""}${
    phone ?
      `&phone=${phone}`
      : ""}`, config);

export default {
  getRiskList,
};
