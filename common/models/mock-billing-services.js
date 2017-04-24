/**
* @Date:   2017-02-07T11:55:36-06:00
 * @Last modified time: 2017-04-11T08:00:21-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/

'use strict'
import {genericRequestPromise} from '../util/api'
let partyData = require('../data/customer_data.json').customers
let billingData = {}

for (let i = 0; i <= 4; i++) {
  billingData['100100' + String(i)] = require('../data/customer' + String(i) + '.json')
}

module.exports = function (MockBillingServices) {
  MockBillingServices.disableRemoteMethod('invoke', true)
  // Define the getSentiment method
  MockBillingServices.getParty = async function (lastName, dateOfBirth, zip5, last4OfSocialSecurityNumber, cb) {
    let party = {}
    try {
      // Party (customer) Information
      // Artificially delay to simulate HTTP Request
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 300)
      })
      party = partyData.find((element) => {
        if (
          element.lastName.toLowerCase() === lastName.toLowerCase() &&
          element.dateOfBirth === dateOfBirth &&
          element.zip5 === zip5 &&
          element.last4SSN === last4OfSocialSecurityNumber
        ) {
          return true
        } else {
          return false
        }
      })

    } catch (e) {
      console.log(e)
      throw (e)
    }
    return party
  }

  MockBillingServices.getBillingAccounts = async function (cdhid, cb) {
    let billingAccounts = {}
    try {
      // Party (customer) Information
      // Artificially delay to simulate HTTP Request
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 300)
      })
      billingAccounts = billingData[cdhid]
    } catch (e) {
      console.log(e)
      throw (e)
    }
    return billingAccounts
  }

  // Register the Remote Method
  MockBillingServices.remoteMethod(
    'getParty', {
      description: 'Returns the party information',
      http: {
        path: '/getParty',
        verb: 'get'
      },
      accepts: [
        {
          arg: 'lastName',
          type: 'string',
          http: {source: 'query'},
          description: 'Last Name for Party',
          required: true
        },
        {
          arg: 'dateOfBirth',
          type: 'string',
          http: {source: 'query'},
          description: 'Date of Birth for Party (mm/dd/yyyy)',
          required: true
        },
        {
          arg: 'zip5',
          type: 'string',
          http: {source: 'query'},
          description: 'Zip Code for Party',
          required: true
        },
        {
          arg: 'last4OfSocialSecurityNumber',
          type: 'string',
          http: {source: 'query'},
          description: 'Last 4 digits of Party\'s SSN',
          required: true
        }
      ],
      returns: [
        {
          arg: 'partyInfo',
          type: 'object',
          description: 'The sentiment score of the supplied text'
        }
      ]
    }
  )

  // Register the Remote Method
  MockBillingServices.remoteMethod(
    'getBillingAccounts', {
      description: 'Returns the billing accounts by cdhid',
      http: {
        path: '/getBillingAccounts',
        verb: 'get'
      },
      accepts: [
        {
          arg: 'cdhid',
          type: 'string',
          http: {source: 'query'},
          description: 'cdhid',
          required: true
        }
      ],
      returns: [
        {
          arg: 'billingAccounts',
          type: 'object',
          description: 'The billing accounts by cdhid'
        }
      ]
    }
  )
}
