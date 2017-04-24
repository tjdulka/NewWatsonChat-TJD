/**
* @Date:   2017-02-07T09:23:48-06:00
* @Last modified time: 2017-03-03T00:44:43-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



'use strict'

module.exports = function (Auth) {
  // The following methods aren't used in general, so to simplify the API, it will be removed
  Auth.disableRemoteMethod('__create__accessTokens', false)
  Auth.disableRemoteMethod('__delete__accessTokens', false)
  Auth.disableRemoteMethod('__createById__accessTokens', false)
  Auth.disableRemoteMethod('__destroyById__accessTokens', false)
  Auth.disableRemoteMethod('__updateById__accessTokens', false)
}
