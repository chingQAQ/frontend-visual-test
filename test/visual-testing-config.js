const { join } = require('path');

function ResultPath (project) {
  return (folderName, isEngine = false) => {
    return join(process.cwd(), 'test', isEngine ? 'engine' : project, folderName);
  }
}

module.exports = option => {
  const resultPath = new ResultPath(option.project);
  return {
    id: `${option.project}_test` || 'Visual Regression Testing',
    viewports: option.viewports || [],
    onBeforeScript: option.onBeforeScript || "puppet/onBefore.js",
    onReadyScript: option.onReadyScript || "puppet/onReady.js",
    scenarios: option.scenarios || [],
    paths: {
      bitmaps_reference: resultPath('bitmaps_reference'),
      bitmaps_test: resultPath('bitmaps_test'),
      engine_scripts: resultPath('engine_scripts', true),
      html_report: resultPath('html_report'),
      json_report: resultPath('json_report'),
      ci_report: resultPath('ci_report')
    },
    engine: "puppeteer",
    engineOptions: {
      ignoreHTTPSErrors: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    },
    report: ['browser', 'CI'],
    debug: false,
    debugWindow: false,
    asyncCaptureLimit: 3,
    asyncCompareLimit: 3,
  }
}

