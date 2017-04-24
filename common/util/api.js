/**
* @Date:   2017-02-07T09:23:48-06:00
* @Last modified time: 2017-03-03T00:44:48-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import request from 'request'
function genericRequestPromise (options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error || Number(response.statusCode) > 400) {
        console.log(error || 'status code: ' + response.statusCode)
        reject(error)
      }
      resolve(JSON.parse(body))
    })
  })
}

function genericRequestRawPromise (options) {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        console.log(error)
        reject(error)
      }
      resolve(body)
    })
  })
}

export {genericRequestPromise, genericRequestRawPromise}
