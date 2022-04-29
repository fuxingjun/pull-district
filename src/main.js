import { queryDistrict } from "./api.js";
import { generateId } from "./utils/utils.js";
import fs from "fs";
import path from "path";
import { generateSql } from "./utils/sql.js";
import { handleProcessArgs } from "./utils/process.js";

const args = handleProcessArgs();

/**
 * api参数字段
 * @type {{extensions: string, keywords: string, subdistrict: number, page: number}}
 */
const paramFields = {
  keywords: "中国",
  subdistrict: 3,
  extensions: "base",
  page: 1,
}

/**
 * 查询省级数据
 * @returns {Promise<unknown>}
 */
function queryProvinceData() {
  const params = {
    ...paramFields
  }
  return new Promise((resolve, reject) => {
    /**
     * 从中国开始查，只能查到区级
     */
    queryDistrict(params).then(({ data, status }) => {
      if (status === 200) {
        const provinceData = data.districts[0].districts;
        resolve(provinceData)
      } else {
        reject(`查询省级数据失败`)
      }
    })
  })
}

/**
 * 从省级数据查到街道数据
 * @param provinceData
 * @returns {Promise<unknown extends (object & {then(onfulfilled: infer F): any}) ? (F extends ((value: infer V, ...args: any) => any) ? Awaited<V> : never) : unknown>}
 */
function queryStreet(provinceData) {
  const promiseList = provinceData.map(province => {
    return new Promise((resolve, reject) => {
      const params = {
        ...paramFields,
        keywords: province.name,
      }
      queryDistrict(params).then(({ data, status }) => {
        if (status === 200) {
          resolve(data.districts);
        } else {
          reject(`请求失败！${JSON.stringify(params)}`);
        }
      })
    })
  })
  return Promise.all(promiseList).then(data => {
    return data.reduce((total, current) => {
      return total.concat(current);
    }, [])
  })
}

/**
 * 处理区域数据
 * @type {function(*, *=): *[]}
 */
const handleDistrict = (function () {
  const result = [];
  return function (data, parentId = 0) {
    data.forEach(item => {
      const district = {
        id: generateId(),
        parentId,
        name: item.name,
        adcode: item.adcode,
        center: item.center,
        level: item.level,
      }
      result.push(district);
      if (item.districts.length > 0) {
        handleDistrict(item.districts, district.id);
      }
    });
    return result;
  }
})();

/**
 * 写入json、sql数据到文件
 * @param data
 */
function writeResult(data) {
  const time = Date.now();
  fs.writeFile(path.resolve(`./dist/${time}.json`), JSON.stringify(data), err => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`json文件写入成功,共${data.length}个行政区域，文件名称：${time}.json`);
  });
  fs.writeFile(path.resolve(`./dist/${time}.sql`), generateSql(data), err => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`sql文件写入成功,文件名称：${time}.sql`);
  });
}

/**
 * 开始查询
 */
function start() {
  queryProvinceData().then(provinceData => {
    if (args.street === "true") {
      queryStreet(provinceData).then(data => {
        const result = handleDistrict(data);
        writeResult(result);
      })
    } else {
      const result = handleDistrict(provinceData);
      writeResult(result);
    }
  })
}

start();
