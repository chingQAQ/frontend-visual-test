const { join } = require('path');
const fs = require('fs');
const testPackage = join(__dirname, 'package.json');
const rootPackage = join(__dirname, '..', 'package.json');
const gitignore = join(__dirname, '..', '.gitignore');
const isPackageBothExist = fs.existsSync(testPackage) && fs.existsSync(rootPackage);
const parseJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const testPackageContent = parseJson(testPackage);
const rootPackageContent = parseJson(rootPackage);
const ignoreFile = ['**/engine', '**/testing-result', '**/dist'];

function MergePackageDifferent({ testPackageContent, rootPackageContent }) {
  return object => {
    return { [object]: Object.assign({}, rootPackageContent[object], testPackageContent[object]) };
  }
}

function appendToFile(path, content) {
  let info = fs.readFileSync(path, 'utf8');
  content.forEach( i => {
    if (!info.split(/\r\n/).includes(i)) {
      fs.appendFileSync(path, `\r\n${i}`);
    }
  })
}

const run = async () => {
  if (isPackageBothExist) {
    const origin = { testPackageContent, rootPackageContent };
    const merge = new MergePackageDifferent(origin);
    const devDependencies = merge('devDependencies');
    const scripts = merge('scripts');
    Object.assign(origin.rootPackageContent, devDependencies, scripts);
    fs.writeFileSync(rootPackage, JSON.stringify(origin.rootPackageContent, 'null', 2), 'utf8');
    appendToFile(gitignore, ignoreFile);
    fs.unlinkSync(testPackage);
    return;
  }
  console.log('請確認專案或test的package.json，其中一樣不見惹TAT');
  process.exit();
}

run();

debugger;

