const fs = require('fs');
const { parse, join, resolve } = require('path');
const args = require('yargs').argv;
const glob = require("glob");
const backstop = require('backstopjs');
const fileIgnore = [];
const config = getConfig().config;
const viewports = getConfig().viewports;
const projectPath = `${config.path}${args.p || ''}`;
const pathName = config.path.split(parse(process.cwd()).name + '/')[1];
const projectConfig = require('./visual-testing-config')({
  project: 'testing-result',
  viewports,
  scenarios: getProjectScenarios(projectPath)
})
const resultSaveCount = 5;
let commandToRun;

if (args.test) commandToRun = 'test';
if (args.reference) commandToRun = 'reference';
if (args.approve) commandToRun = 'approve';
if (args.openReport) commandToRun = 'openReport';
if (commandToRun !== "") {
  (async () => {
    await removeFile();
    console.log('\x1b[32m',`[backstop] Visual Regression Testing: ${commandToRun} 運作中`)
    await backstop(commandToRun, { config: projectConfig });
    console.log('\x1b[32m',`[backstop] Visual Regression Testing 已完成`)
  })()
};

function getConfig() {
  const configFile = resolve(__dirname, '.config');
  const isExist = fs.existsSync(configFile);
  if (isExist) {
    const data = fs.readFileSync(configFile, 'utf8');
    return JSON.parse(data);
  }

  console.log(`${configFile}不存在或發生未知錯誤，請重新init`)
  process.exit();
}

function getProjectScenarios(projectPath) {
  const regex = /\.([cs]?(ht|x)m[l]|aspx)/gm;
  const type = projectPath.match(regex);
  let scenarios;
  let files = type ? [projectPath.split('/')[1]] : fs.readdirSync(projectPath);
  files = files.filter(path => {
    const result = {
      base: parse(path).base,
      ext: parse(path).ext
    }
    const isIgnore = fileIgnore.some(i => i === result.base);
    const effectiveFile = result.ext.match(regex) !== null;
    return effectiveFile && !isIgnore;
  });

  scenarios = files.map(file => {
    const scenarioLabel = file.split('.')[0];
    return {
      label: scenarioLabel,
      url: `${config.domain}${pathName}${file}`,
      misMatchThreshold: 0.1,
    }
  });

  return scenarios;
}

async function removeFile() {
  const testDir = glob.sync('**/bitmaps_test')[0];
  if (testDir) {
    let files = fs.readdirSync(testDir);
    files = files.sort((a, b) => {
      const aTime = a.split('-').join('');
      const bTime = b.split('-').join('');
      return bTime - aTime;
    });
    if (files.length > resultSaveCount) {
      const last = files[files.length - 1];
      console.log('\x1b[32m', '\r\n================================================================')
      console.log('\x1b[32m', `[backstop] 紀錄上限超過${ resultSaveCount }筆，刪除最早的紀錄${last}`);
      const removeFile = join(process.cwd(), testDir, last);
      fs.rmdirSync(removeFile, { recursive: true });
      console.log('\x1b[32m', `[backstop] ${last}已刪除`);
      console.log('\x1b[32m', '================================================================\r\n')
    };
  }
}
