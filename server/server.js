/**
* @Date:   2017-02-07T09:23:55-06:00
* @Last modified time: 2017-03-03T00:45:26-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



'use strict'

import 'babel-polyfill'
import express from 'express'
import path from 'path'
require('dotenv').config()

var loopback = require('loopback')
var boot = require('loopback-boot')
// The following requires are for parsing the body when doing a file upload
var bodyParser = require('body-parser')
var multer = require('multer')

// Define the storage for the files being upload.
var storage = multer.memoryStorage()

var app = module.exports = loopback()

// Add the middleware to parse multipart forms
app.use(multer({storage: storage}).any())

// Parse body of incoming requests
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.start = function () {
  // start the web server
  return app.listen(global.appEnv.port, function () {
    app.emit('started')
    var baseUrl = app.get('url').replace(/\/$/, '')
    console.log('Web server listening at: %s', baseUrl)
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath)
    }
  })
}
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
  if (err) throw err

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start()
  }
})

app.use('/', express.static('dist/client'))
app.middleware('final', (req, res, next) => {
  res.sendFile(path.resolve('dist/client/index.html'))
})
/*
app.use('/', (req, res, next) => {
  // res.sendFile(path.resolve('dist/client/rex/index.html'))
  //express.static('')
})
*/
