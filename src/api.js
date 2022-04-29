import request from "./utils/request.js";
import { key } from "../config.js";

/**
 * 查询行政区域
 * @param params
 * @returns {*}
 */
export function queryDistrict(params) {
  params.key = key;
  return request({
    url: "https://restapi.amap.com/v3/config/district",
    method: "GET",
    params,
  });
}
