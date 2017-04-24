/**
* @Date:   2017-02-16T13:07:41-06:00
* @Last modified time: 2017-03-24T14:31:42-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



//
//  This serves to hold the billing data and serves to augment responses.
//  This is the only "centralized" data store. Maybe in the future, the app could
//  be more centralized like this, instead of relying on each component to figure out
//  what it needs to know and manage that.
//
//  The only other data that's really eligible to centralized are messages and sentiment/emotion/intent
//

import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { AuthElements } from './classes/auth.authElements.class'
import * as qs from 'querystring'
import * as moment from 'moment'
import 'rxjs/add/operator/map'

@Injectable()
export class BillingDataService {
  public authElements = new AuthElements()
  public partyData: any = null
  public billingData: any = null
  public availableAccountTypes: Array<string> = null
  constructor() {
  }

  augmentMessage (message: string) {
    if (!this.partyData || !this.billingData) {
      return message
    }
    console.log('attempting to augment')
    message = message.replace(/{{firstName}}/g, this.partyData.partyInfo.person.name.firstName)
    message = message.replace(/{{accountList}}/g, this.getAccountTypesString())
    message = message.replace(/{{email}}/g, this.partyData.partyInfo.person.name.firstName.toLocaleLowerCase() + '@us.ibm.com')
    message = message.replace(/{{address}}/g, this.partyData.partyInfo.contactDetail.primaryMailingAddress.line1 + ', ' + this.partyData.partyInfo.contactDetail.primaryMailingAddress.city + ', ' + this.partyData.partyInfo.contactDetail.primaryMailingAddress.state + ' ' + this.partyData.partyInfo.contactDetail.primaryMailingAddress.zip)
    message = message.replace(/{{lastPaymentDate.*?}}/g, (message.match(/{{lastPaymentDate.*?}}/)) ? this.getLastPaymentDate(this.getAccountTypeFromMarker(message.match(/{{lastPaymentDate.*?}}/)[0])) : '')
    message = message.replace(/{{lastPaymentAmount.*?}}/g, (message.match(/{{lastPaymentAmount.*?}}/)) ? this.getLastPaymentAmount(this.getAccountTypeFromMarker(message.match(/{{lastPaymentAmount.*?}}/)[0])) : '')
    message = message.replace(/{{nextPaymentDate.*?}}/g, (message.match(/{{nextPaymentDate.*?}}/)) ? this.getNextPaymentDate(this.getAccountTypeFromMarker(message.match(/{{nextPaymentDate.*?}}/)[0])) : '')
    message = message.replace(/{{nextPaymentAmount.*?}}/g, (message.match(/{{nextPaymentAmount.*?}}/)) ? this.getNextPaymentAmount(this.getAccountTypeFromMarker(message.match(/{{nextPaymentAmount.*?}}/)[0])) : '')
    message = message.replace(/{{totalBalance.*?}}/g, (message.match(/{{totalBalance.*?}}/)) ? this.getTotalBalance(this.getAccountTypeFromMarker(message.match(/{{totalBalance_.*?}}/)[0])) : '')
    message = message.replace(/{{policyRenewalDate.*?}}/g, (message.match(/{{policyRenewalDate.*?}}/)) ? this.getRenewalDate(this.getAccountTypeFromMarker(message.match(/{{policyRenewalDate_.*?}}/)[0])) : '')
    message = message.replace(/{{pastDuePaymentDate.*?}}/g, (message.match(/{{pastDuePaymentDate.*?}}/)) ? this.getPastDuePaymentDate() : '')
    message = message.replace(/{{refundIssuedDate.*?}}/g, (message.match(/{{refundIssuedDate.*?}}/)) ? this.getRefundDate(this.getAccountTypeFromMarker(message.match(/{{refundIssuedDate.*?}}/)[0])) : '')
    message = message.replace(/{{refundIssuedAmount.*?}}/g, (message.match(/{{refundIssuedAmount.*?}}/)) ? this.getRefundAmount(this.getAccountTypeFromMarker(message.match(/{{refundIssuedAmount.*?}}/)[0])) : '')
    message = message.replace(/{{pastDueNoticeDate.*?}}/g, (message.match(/{{pastDueNoticeDate.*?}}/)) ? this.getPastDueNoticeDate(this.getAccountTypeFromMarker(message.match(/{{pastDueNoticeDate.*?}}/)[0])) : '')

    return message
    /*
    var matches = message.match(/{{.*}}/g)
    if (matches.includes("{{firstName}}") {
    */
  }

  hasMultipleAccounts(): boolean {
    if (this.billingData.billingAccounts.length  > 1) {
      return true
    } else {
      return false
    }
  }

  getAccountTypesString(): string {
    let ret = ''
    if (this.billingData.billingAccounts.length > 2) {
      for (let i = 0; i < this.billingData.billingAccounts.length; i++) {
        if (i === this.billingData.billingAccounts.length - 2) {
          ret += this.billingData.billingAccounts[i].policyList[0].policyType + ', and '
        } else if (i === this.billingData.billingAccounts.length - 1) {
          ret += this.billingData.billingAccounts[i].policyList[0].policyType
        } else {
          ret += this.billingData.billingAccounts[i].policyList[0].policyType + ', '
        }
      }
    } else if (this.billingData.billingAccounts.length === 2) {
      return this.billingData.billingAccounts[0].policyList[0].policyType + ' and ' + this.billingData.billingAccounts[1].policyList[0].policyType
    } else if (this.billingData.billingAccounts.length === 1) {
      return this.billingData.billingAccounts[0].policyList[0].policyType
    }
    return ret
  }

  getAvailableAccountTypes() {
    let ret = []
    for (let i = 0; i < this.billingData.billingAccounts.length; i++) {
      ret.push(this.billingData.billingAccounts[i].policyList[0].policyType)
    }
    return ret
  }

  getAccountIndicators() {
    let ret: any = {}
    for (let billingAccount of this.billingData.billingAccounts) {
      let indicators: any = {}
      indicators.pastDue = billingAccount.pastDueIndicator
      indicators.paymentScheduled = billingAccount.paymentScheduledIndicator
      indicators.refundIssued = 'false'
      for (let billingHistory of billingAccount.billingHistory) {
        if (billingHistory.activityType === 'REVERSAL') {
          indicators.refundIssued = 'true'
          break
        }
      }
      ret[billingAccount.policyList[0].policyType] = indicators
    }
    return ret
  }

  getAccountTypeFromMarker(marker: string): string {
    let split = marker.split('_')
    if (split.length === 2) {
      return split[1].replace(/}}/g, '')
    } else {
      return ''
    }
  }

  // Get the Billing Account by Type
  getBillingAccount(type: string) {
    for (let billingAccount of this.billingData.billingAccounts) {
      if (billingAccount.policyList[0].policyType === type) {
        return billingAccount
      }
    }
    return null
  }

  // Get the last payment date on the specified account
  getLastPaymentDate(accountType: string): string {
    let billingAccount = this.getBillingAccount(accountType)
    if (billingAccount && billingAccount.billingHistory && billingAccount.billingHistory[0].activityType === 'PAYMENT' && billingAccount.billingHistory[0].activityDate) {
      return billingAccount.billingHistory[0].activityDate
    }
    return 'Unknown'
  }

  // Get the last payment amount on the specified account. Currently no data
  getLastPaymentAmount(accountType: string) {
    let billingAccount = this.getBillingAccount(accountType)
    if (billingAccount && billingAccount.billingHistory && billingAccount.billingHistory[0].activityType === 'PAYMENT' && billingAccount.billingHistory[0].activityAmount) {
      return '$' + billingAccount.billingHistory[0].activityAmount
    }
    return 'Unknown'
  }

  // Get the last payment date on the specified account
  getRefundDate(accountType: string): string {
    let billingAccount = this.getBillingAccount(accountType)
    if (billingAccount && billingAccount.billingHistory && billingAccount.billingHistory[0].activityType === 'REVERSAL' && billingAccount.billingHistory[0].activityDate) {
      return billingAccount.billingHistory[0].activityDate
    }
    return 'Unknown'
  }

  // Get the last payment amount on the specified account. Currently no data
  getRefundAmount(accountType: string) {
    let billingAccount = this.getBillingAccount(accountType)
    if (billingAccount && billingAccount.billingHistory && billingAccount.billingHistory[0].activityType === 'REVERSAL' && billingAccount.billingHistory[0].activityAmount) {
      return '$' + billingAccount.billingHistory[0].activityAmount
    }
    return 'Unknown'
  }

  // Get the last payment date on the specified account
  getNextPaymentDate(accountType: string) {
    let billingAccount = this.getBillingAccount(accountType)
    if (billingAccount && billingAccount.paymentDueDate) {
      return billingAccount.paymentDueDate
    }
    return 'Unknown'
  }

  // Get the last payment date on the specified account
  getNextPaymentAmount(accountType: string) {
    let billingAccount = this.getBillingAccount(accountType)
    if (billingAccount && billingAccount.minimumAmountDue) {
      return '$' + billingAccount.minimumAmountDue
    }
    return 'Unknown'
  }

  // Get the last payment amount on the specified account. Currently no data
  getPastDueNoticeDate(accountType: string) {
    let billingAccount = this.getBillingAccount(accountType)
    if (billingAccount && billingAccount.billingDocuments && billingAccount.billingDocuments[0].documentType === 'Past Due Notice' && billingAccount.billingDocuments[0].documentDate) {
      return billingAccount.billingDocuments[0].documentDate
    }
    return 'Unknown'
  }

  // Get the new payment due date for a late payment
  getPastDuePaymentDate() {
    //Information is missing from API currently
    return moment(new Date()).add(10, 'days').format('MM/DD/YYYY')
  }
  // Get the total balance on the specified account
  getTotalBalance(accountType: string) {
    let billingAccount = this.getBillingAccount(accountType)
    if (billingAccount && billingAccount.accountBalance) {
      return '$' + billingAccount.accountBalance
    }
    return 'Unknown'
  }

  // Get the renewal date on the specified account
  getRenewalDate(accountType: string) {
    //Information is missing from API currently
    return moment(new Date()).add(6, 'months').format('MM/DD/YYYY')
  }
}
