/**
 * 处理命令行参数
 * @param process
 */
export function handleProcessArgs() {
  const args = {};
  process.argv.slice(2).forEach(item => {
    const [key, value] = item.split("=");
    if (key.indexOf("--") === 0) {
      args[key.slice(2)] = value;
    }
  });
  return args
}
