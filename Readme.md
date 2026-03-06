# Watcher.js

A lightweight, robust and intuitive data validator for JavaScript, inspired by the observer pattern.  
轻量级、高鲁棒性的 JavaScript 数据校验器，基于观察者模式设计。

## Features

- 🎯 Auto-wrap primitive types (string/number/boolean)
- 🛡 Strict parameter validation
- 🚀 Single/multiple batch validation
- 🚨 Throw detailed errors on validation failure
- ✨ Zero dependencies

## Quick Start

### Install

Just copy `Watcher.js` to your project (zero dependencies):

```javascript
import Watcher from './Watcher.js';
```

### Basic Usage

```javascript
// Create a Watcher instance
const numberWatcher = new Watcher({
  target: -10,
  fn: (value) => value > 0,
  ruleDesc: 'Value must be greater than 0'
});

// Basic validation
console.log(numberWatcher.judge()); // false

// Update value and validate again
numberWatcher.target.value = 15;
console.log(numberWatcher.judge()); // true

// Validation with error throw
try {
  numberWatcher.target.value = -5;
  numberWatcher.checkAndThrow();
} catch (error) {
  console.error(error.message); // Rule[Value must be greater than 0] not satisfied, current value: -5
}

// Batch validation
const phoneWatcher = new Watcher({
  target: '13800138000',
  fn: (v) => /^1[3-9]\d{9}$/.test(v),
  ruleDesc: 'Valid phone number'
});

const passwordWatcher = new Watcher({
  target: '123456',
  fn: (v) => v.length >= 6,
  ruleDesc: 'Password length ≥ 6'
});

console.log(Watcher.batchJudge(phoneWatcher, passwordWatcher)); // true
```

## API

### Constructor

```javascript
new Watcher(options)
```

- `options.target` (required): The value to watch/validate
- `options.fn` (required): Validation function (returns boolean)
- `options.ruleDesc` (optional): Description of validation rule

### Methods

- `judge()`: Execute validation, return `true`/`false`
- `checkAndThrow()`: Execute validation, throw error if failed
- `Watcher.batchJudge(...watchers)` (static): Batch validate multiple Watcher instances