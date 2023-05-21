/**
 * 数据库表名
 * @type {string}
 */
const tableName = "t_region";

/**
 * 字段和数据库表列名的对应关系
 */
const fieldsMap = {
  id: "id",
  parentId: "parentId",
  name: "name",
  code: "code",
  center: "center",
  level: "level",
}

/**
 * 创建语句sql
 * @type {string}
 */
export const createSql = `CREATE TABLE IF NOT EXISTS ${tableName}
(
    id                      INT AUTO_INCREMENT COMMENT '主键id',
    ${fieldsMap.parentId}   INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '父级id',
    ${fieldsMap.name}       VARCHAR(22)  NOT NULL DEFAULT '' COMMENT '区域名称',
    ${fieldsMap.code}       CHAR(6)      NOT NULL DEFAULT '' COMMENT '区域编码，街道没有独有的code，均继承父类（区县）的adcode',
    ${fieldsMap.center}     VARCHAR(24)  NOT NULL DEFAULT '' COMMENT '中心经纬度',
    ${fieldsMap.level}      VARCHAR(8)   NOT NULL DEFAULT '' COMMENT '层级',
    PRIMARY KEY (${fieldsMap.id}, ${fieldsMap.code})
) COMMENT = '行政区域表';`

/**
 * 生成插入语句sql
 * @param data
 * @returns {string}
 */
export function generateInsertSql(data) {
  let insertSql = `INSERT INTO ${tableName}(${fieldsMap.id}, ${fieldsMap.parentId}, ${fieldsMap.name}, ${fieldsMap.code}, ${fieldsMap.center}, ${fieldsMap.level})
                   VALUES `;
  insertSql += data.map(item => `(${item.id}, ${item.parentId}, '${item.name}', '${item.code}', '${item.center}', '${item.level}')`).join(",\n")
  insertSql += ";"
  return insertSql;
}

/**
 * 生成sql语句
 * @param data
 * @returns {string}
 */
export function generateSql(data) {
  return createSql + "\n\n" + generateInsertSql(data);
}
