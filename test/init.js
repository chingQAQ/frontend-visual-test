const fs = require('fs');
const { join, sep } = require('path');
const readline = require('readline');
const Prompt = require('prompt-checkbox');
let viewsPath;
let port;
let domainName = 'http://localhost:';
let viewReference = [
  {
    name: 'phone',
    width: 320,
    height: 300
  },
  {
    name: 'tablet',
    width: 720,
    height: 300
  },
  {
    name: 'desktop',
    width: 1024,
    height: 300
  }
]
let viewports;

const create = {
  config: async ({ path, port, domainName: domain}) => {
    const createFilePath = join(__dirname, '.config');
    const setting = { config: { path, port, domain: `${domain}${port}/` } };
    return fs.writeFileSync(createFilePath, JSON.stringify(setting, null, 2), 'utf8');
  },
  viewports: async (views) => {
    const createFilePath = join(__dirname, '.config');
    const config = JSON.parse(fs.readFileSync(createFilePath, 'utf8'));
    config.viewports = viewReference.filter(i => views.some(a => i.name.includes(a)));
    return fs.writeFileSync(createFilePath, JSON.stringify(config, null, 2), 'utf8');
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

const question3 = () => new Promise(resolve => {
  const prompt = new Prompt({
    name: 'viewports',
    message: '請選擇欲測試之裝置寬度(可複選)',
    choices: [
      'phone',
      'tablet',
      'desktop'
    ]
  });
  prompt.ask(answers => {
    if (answers.length === 0) {
      console.log('測試尺寸不能為null');
      process.exit();
    }
    viewports = answers;
    resolve();
  });
})

const run = async () => {
  await question1();
  await question2();
  await question3();
  rl.close();
}

rl.on('close', async () => {
  await create.config({ path: viewsPath, port, domainName});
  await create.viewports(viewports);
})

run();
