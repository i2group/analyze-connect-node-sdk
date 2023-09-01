#!/usr/bin/env node
//@ts-check
/*!
 * i2, i2 Group, the i2 Group logo, and i2group.com are trademarks of N.Harris Computer Corporation.
 * © N.Harris Computer Corporation (2023)
 * SPDX-License-Identifier: MIT
 */

'use strict';

// This code is solely for the purpose of making this particular example connector
// an executable that can be published to npm and invoked via npx.

const path = require('path');

const { fork } = require('child_process');

require('dotenv').config();

const serverProcess = fork(path.join(__dirname, '..', 'dist', 'index.js'), {
  cwd: path.join(__dirname, '..'),
});

process.on('SIGINT', () => serverProcess.kill('SIGINT'));
process.on('SIGTERM', () => serverProcess.kill());
