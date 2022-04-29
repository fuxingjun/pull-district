/**
 * 生成主键id
 * @returns {function(): number}
 */
export const generateId = (function () {
  let i = 1;
  return function () {
    return i++;
  }
})()
