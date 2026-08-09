#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'

const supportedExtensions = new Set(['.css', '.less', '.sass', '.scss'])
const ignoredDirectories = new Set(['.git', 'dist', 'node_modules'])
const defaultTargets = ['apps/hermes/src', 'packages/ui/src', 'packages/shared/src']

const policies = [
  {
    id: 'no-important',
    pattern: /!important\b/g,
    message: 'Remove !important and fix the owning component, selector boundary, or variant.',
  },
  {
    id: 'no-transition-all',
    pattern: /transition(?:-property)?\s*:\s*all\b/gi,
    message: 'List the transitioned properties explicitly.',
  },
  {
    id: 'no-antd-internals',
    pattern: /(?:\.ant-|\.anticon\b|:global\(\s*\.ant)/g,
    message: 'Do not style Ant Design internals; rewrite the component against the target UI API.',
  },
  {
    id: 'no-deep-selector',
    pattern: /(?:\/deep\/|>>>|::v-deep\b|:deep\s*\()/g,
    message: 'Keep selectors local and expose an explicit component state or styling contract.',
  },
]

function withoutComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, comment => comment.replace(/[^\n]/g, ' '))
    .replace(/^\s*\/\/.*$/gm, comment => comment.replace(/[^\n]/g, ' '))
}

function locationAt(source, index) {
  const before = source.slice(0, index)
  const line = before.split('\n').length
  const lastNewline = before.lastIndexOf('\n')
  return { line, column: index - lastNewline }
}

async function collectFiles(target) {
  const targetStat = await stat(target)
  if (targetStat.isFile()) {
    return supportedExtensions.has(path.extname(target)) ? [target] : []
  }

  const entries = await readdir(target, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue
    const entryPath = path.join(target, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)))
    } else if (entry.isFile() && supportedExtensions.has(path.extname(entry.name))) {
      files.push(entryPath)
    }
  }

  return files
}

const targets = process.argv.slice(2)
const resolvedTargets = (targets.length > 0 ? targets : defaultTargets).map(target =>
  path.resolve(process.cwd(), target)
)

const files = (await Promise.all(resolvedTargets.map(collectFiles))).flat().sort()
const violations = []

for (const file of files) {
  const source = await readFile(file, 'utf8')
  const checkedSource = withoutComments(source)

  for (const policy of policies) {
    policy.pattern.lastIndex = 0
    for (const match of checkedSource.matchAll(policy.pattern)) {
      const location = locationAt(checkedSource, match.index ?? 0)
      violations.push({
        ...location,
        file: path.relative(process.cwd(), file),
        policy: policy.id,
        message: policy.message,
      })
    }
  }
}

if (violations.length > 0) {
  console.error(`CSS policy check failed with ${violations.length} violation(s):\n`)
  for (const violation of violations) {
    console.error(
      `${violation.file}:${violation.line}:${violation.column}  ${violation.policy}  ${violation.message}`
    )
  }
  process.exitCode = 1
} else {
  console.log(`CSS policy check passed for ${files.length} stylesheet(s).`)
}
