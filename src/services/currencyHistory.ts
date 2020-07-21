import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getCurrencyHistoryList = (start_time:number ,end_time:number ,currency:string,  config: AxiosRequestConfig): Promise<any> =>
  API.get(`/broker/platform-currency/history?start_time=${start_time
                                            }&end_time=${end_time
                                            }&currency=${currency}`, config);

  export default {
    getCurrencyHistoryList
  }