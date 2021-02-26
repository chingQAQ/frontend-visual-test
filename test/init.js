const fs = require('fs');
const { join, sep } = require('path');
const glob = require('glob');
const readline = require('readline');
let viewsPath;
let port;
let domainName = 'http://localhost:';

const create = {
  config: async ({ path, port, domainName: domain}) => {
    const createFilePath = join(__dirname, '.config');
    const setting = { config: { path, port, domain: `${domain}${port}/` } };
    fs.writeFileSync(createFilePath, JSON.stringify(setting, null, 2), 'utf8');
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question1 = () => new Promise(resolve => {
  rl.question('請輸入頁面資料夾位置 ex: dist/views, dist/ \r\n', answer1 => {
    viewsPath = join(process.cwd(), answer1);
    const isViewsPathExist = fs.existsSync(viewsPath);
    if (!isViewsPathExist) {
      console.log('路徑不存在，請至.config手動設定');
      viewsPath = 'null';
    } else {
      viewsPath = viewsPath.split(sep).join('/');
    }
    resolve();
  })
})

const question2 = () => new Promise(resolve => {
  rl.question('\r\n請輸入port default:4000\r\n', answer2 => {
    const match = answer2.match(/\d{4,}/gm);
    port = match !== null && match.length === 1 ? answer2 : 4000;
    resolve();
  });
})

const run = async () => {
  await question1();
  await question2();
  rl.close();
}

rl.on('close', async () => {
  await create.config({ path: viewsPath, port, domainName});
})

run();
