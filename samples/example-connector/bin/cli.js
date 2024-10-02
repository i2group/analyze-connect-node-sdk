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

require('dotenv').config();

const path = require('path');
const fs = require('fs');

// If the user has defined a relative config/server.json we'll use it, if not
// fall back to the defaults we ship with the example connector if not
// already set in the environment.
if (!fs.existsSync('config/server.json')) {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/server.json'), 'utf8'));

  function setEnvironmentValueIfNotSet(key, value) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }

  setEnvironmentValueIfNotSet('CONNECTOR_ID', config.connectorId);
  setEnvironmentValueIfNotSet('SERVER_PORT', config.serverPort);
}

require('../dist/index.js');
