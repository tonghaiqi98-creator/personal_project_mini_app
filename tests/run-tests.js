const fs = require('fs')
const path = require('path')
const assert = require('assert')
const helpers = require('./test-utils')

const logicTests = [
  'cart.test.js',
  'order.test.js',
  'stats.test.js',
  'mock-data.test.js',
  'routes.test.js'
]

const reportDir = path.join(__dirname, 'reports')
const reportPath = path.join(reportDir, 'local-test-report.md')
const results = []

function createSuite(fileName) {
  const cases = []

  return {
    test(name, fn) {
      cases.push({ name, fn })
    },
    cases
  }
}

async function runTestFile(fileName) {
  const filePath = path.join(__dirname, 'logic', fileName)
  const suite = createSuite(fileName)

  delete require.cache[require.resolve(filePath)]
  require(filePath)({
    test: suite.test,
    assert,
    helpers
  })

  const fileResult = {
    fileName,
    passed: 0,
    failed: 0,
    failures: []
  }

  for (const testCase of suite.cases) {
    try {
      await testCase.fn()
      fileResult.passed += 1
    } catch (error) {
      fileResult.failed += 1
      fileResult.failures.push({
        name: testCase.name,
        message: error && error.stack ? error.stack : String(error)
      })
    }
  }

  results.push(fileResult)
  return fileResult
}

function printFileResult(fileResult) {
  const status = fileResult.failed > 0 ? 'FAIL' : 'PASS'

  console.log(`[${status}] ${fileResult.fileName} (${fileResult.passed} passed, ${fileResult.failed} failed)`)
  fileResult.failures.forEach((failure) => {
    console.log(`  - ${failure.name}`)
    console.log(`    ${failure.message.split('\n')[0]}`)
  })
}

function buildReport() {
  const totalPassed = results.reduce((sum, item) => sum + item.passed, 0)
  const totalFailed = results.reduce((sum, item) => sum + item.failed, 0)
  const lines = [
    '# 本地自动化测试报告',
    '',
    `生成时间：${new Date().toLocaleString('zh-CN', { hour12: false })}`,
    '',
    `总通过数：${totalPassed}`,
    `总失败数：${totalFailed}`,
    '',
    '## 测试文件结果',
    ''
  ]

  results.forEach((item) => {
    const status = item.failed > 0 ? '失败' : '通过'
    lines.push(`- ${item.fileName}：${status}，通过 ${item.passed}，失败 ${item.failed}`)
  })

  const failures = results.flatMap((item) => (
    item.failures.map((failure) => ({
      fileName: item.fileName,
      ...failure
    }))
  ))

  if (failures.length > 0) {
    lines.push('', '## 失败详情', '')
    failures.forEach((failure) => {
      lines.push(`### ${failure.fileName} / ${failure.name}`, '')
      lines.push('```text')
      lines.push(failure.message)
      lines.push('```', '')
    })
  }

  return {
    totalPassed,
    totalFailed,
    content: `${lines.join('\n')}\n`
  }
}

async function main() {
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }

  for (const fileName of logicTests) {
    const fileResult = await runTestFile(fileName)
    printFileResult(fileResult)
  }

  const report = buildReport()
  fs.writeFileSync(reportPath, report.content)

  console.log('')
  console.log(`Total passed: ${report.totalPassed}`)
  console.log(`Total failed: ${report.totalFailed}`)
  console.log(`Report: ${path.relative(process.cwd(), reportPath)}`)

  if (report.totalFailed > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error)
  process.exitCode = 1
})
