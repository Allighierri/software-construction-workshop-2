const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const os = require('node:os');

process.env.APP_PRECISION = '3';
process.env.LOG_LEVEL = 'debug';
const api = require('software-construction-workshop-2');

test('CJS exports and utility edge cases', () => {
  assert.equal(api.add([2, 3, 4]), 9);
  assert.equal(api.add([]), 0);
  assert.equal(api.add([-2, 0, 3.5]), 1.5);
  assert.equal(api.capitalize('hello'), 'Hello');
  assert.equal(api.capitalize(''), '');
  assert.equal(api.formatNumber(123.456), '123.456');
  assert.equal(api.formatNumber(123.456, { precision: 2 }), '123.46');
  assert.equal(api.formatNumber(123.456, { precision: 0 }), '123');
  assert.equal(api.config.LOG_LEVEL, 'debug');
});

test('ESM public package import', async () => {
  const esm = await import('software-construction-workshop-2');
  assert.equal(esm.add([1, 2]), 3);
  for (const name of ['add', 'capitalize', 'formatNumber', 'groupBy', 'Logger', 'config']) {
    assert.ok(name in esm, `Missing export: ${name}`);
  }
});

test('groupBy preserves groups, order, and prototype-like keys', () => {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Alice' },
    { id: 3, name: '__proto__' },
    { id: 4, name: 'constructor' },
  ];
  const grouped = api.groupBy(users, 'name');
  assert.deepEqual(grouped.Alice, users.slice(0, 2));
  assert.deepEqual(grouped.__proto__, [users[2]]);
  assert.deepEqual(grouped.constructor, [users[3]]);
  assert.equal(Object.keys(api.groupBy([], 'name')).length, 0);
});

test('Logger respects silent, info, and debug levels', () => {
  const original = console.log;
  const messages = [];
  console.log = (...args) => messages.push(args);
  try {
    for (const level of ['silent', 'info', 'debug']) {
      const logger = new api.Logger(level);
      logger.info(level);
      logger.debug(level);
    }
  } finally {
    console.log = original;
  }
  assert.deepEqual(messages, [
    ['[INFO]', 'info'],
    ['[INFO]', 'debug'],
    ['[DEBUG]', 'debug'],
  ]);
});

function configProcess(values) {
  const env = { ...process.env };
  delete env.APP_PRECISION;
  delete env.LOG_LEVEL;
  Object.assign(env, values);
  const entry = path.resolve(__dirname, '../dist/index.cjs');
  return spawnSync(
    process.execPath,
    ['-e', `console.log(JSON.stringify(require(${JSON.stringify(entry)}).config))`],
    {
      cwd: os.tmpdir(),
      env,
      encoding: 'utf8',
    },
  );
}

test('configuration defaults without a .env file', () => {
  const result = configProcess({});
  assert.equal(result.status, 0, result.stderr);
  const config = JSON.parse(result.stdout.trim().split('\n').at(-1));
  assert.deepEqual(config, { APP_PRECISION: 2, LOG_LEVEL: 'info' });
});

test('valid precision boundaries and log levels', () => {
  for (const APP_PRECISION of ['0', '10']) {
    for (const LOG_LEVEL of ['silent', 'info', 'debug']) {
      const result = configProcess({ APP_PRECISION, LOG_LEVEL });
      assert.equal(result.status, 0, result.stderr);
    }
  }
});

test('zod rejects invalid environment values', () => {
  for (const values of [
    { APP_PRECISION: '-1' },
    { APP_PRECISION: '11' },
    { APP_PRECISION: '1.5' },
    { APP_PRECISION: 'abc' },
    { LOG_LEVEL: 'verbose' },
  ]) {
    const result = configProcess(values);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /ZodError/);
  }
});
