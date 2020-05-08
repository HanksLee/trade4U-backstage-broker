import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getAccountReport = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/account-report", config);

const getAgencyReport = (config: AxiosRequestConfig): Promise<any> =>
  API.get("/broker/agent-report", config);

export default {
  getAccountReport,
  getAgencyReport,
};
