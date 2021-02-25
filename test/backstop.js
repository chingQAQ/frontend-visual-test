const fs = require('fs');
const { parse, join } = require('path');
const args = require('yargs').argv;
const glob = require("glob");
const backstop = require('backstopjs');
const projectPath = `dist/${args.p || ""}`;
const fileIgnore = [];
const projectConfig = require('./backstop.config')({
  project: 'testing-result',
  viewports: [
    {
      name: 'phone',
      width: 320,
      height: 480
    },
    {
      name: 'tablet',
      width: 720,
      height: 1000
    }
  ],
  scenarios: getProjectScenarios(projectPath)
})
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
      url: `http://localhost:8000/dist/${file}`,
      misMatchThreshold: 0.1,
      delay: 2000
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
    if (files.length > 10) {
      const last = files[files.length - 1];
      console.log('\x1b[32m', '\r\n================================================================')
      console.log('\x1b[32m', `[backstop] 紀錄上限超過10筆，刪除最早的紀錄${last}`);
      const removeFile = join(process.cwd(), testDir, last);
      fs.rmdirSync(removeFile, { recursive: true });
      console.log('\x1b[32m', `[backstop] ${last}已刪除`);
      console.log('\x1b[32m', '================================================================\r\n')
    };
  }
}
