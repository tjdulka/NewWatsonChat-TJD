/**
* @Date:   2017-02-07T09:23:48-06:00
 * @Last modified time: 2017-04-11T08:03:32-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { Injectable, EventEmitter } from '@angular/core'
import { AppCommEvent } from './classes/appcomm.event.class'
import { OrchestratedConversationService } from './orchestrated-conversation.service'
import { BillingDataService } from './billing.data.service'
import { BillingService } from './billing.service'
import { AlchemyService } from './alchemy.service'

@Injectable()
export class AppCommService {
  public static typeEnum = {
    conversationSent: 'CONVSENT',
    conversationReceived: 'CONVRECEIVED',
    conversationContextUpdate: 'CONVCONTEXTUPDATE',
    alchemy: 'ALCHEMY',
    expectsConfidential: 'EXPECTSCONFIDENTIAL',
    authParty: 'AUTHPARTY',
    billingData: 'BILLINGDATA',
    morphInput: 'MORPHINPUT',
    showDetailsPopup: 'SHOWDETAILS',
    conversationIntentsReceived: 'INTENTSRECEIVED'
  }
  public static subTypeEnum = {
    conversationSent: {
      standard: 'STANDARD',
      external: 'EXTERNAL'
    },
    alchemy: {
      sentiment: 'SENTIMENT',
      emotion: 'EMOTION',
      veryLowSentiment: 'VERYLOWSENTIMENT'
    },
    authParty: {
      attempt: 'ATTEMPT',
      success: 'SUCCESS',
      fail: 'FAIL'
    },
    morphInput: {
      date: 'DATE',
      datePII: 'DATEPII',
      zip: 'ZIP',
      last4ssn: 'LAST4SSN',
      lastName: 'LASTNAME' // Doesn't really require a morph, but since it's an auth parameter, it makes sense to call it out
    },
    billingData: {
      received: 'BILLINGDATARECEIVED'
    }
  }
  public appComm$ = new EventEmitter<AppCommEvent>()
  constructor(private _conversation: OrchestratedConversationService, private _alchemy: AlchemyService, private _billing: BillingService, private _billingData: BillingDataService) {
  }

  // Send a message and show the outgoing message in the chat window.
  public sendMessage(message: string, context: any, external = false, pii = false) {
    // Conversation sent event
    this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.conversationSent, external ? AppCommService.subTypeEnum.conversationSent.external : AppCommService.subTypeEnum.conversationSent.standard, message))
    if (!external && !pii) {
      this.getSentiment(message)
      this.getEmotion(message)
    }
    if (pii) {
      message = ''
    }
    this._conversation.sendMessage(message, context).subscribe(response => {
      // Augment the message
      response.message.output.text = this.augmentMessage(response.message.output.text)
      // Conversation received event
      this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.conversationReceived, '', response))
      // Conversation context updated event
      this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.conversationContextUpdate, '', response.message.context))
      // Conversation intents updated event
      this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.conversationIntentsReceived, '', response.message.intents))

      // Handle enrichment requests
      if (response.enrichmentName === 'EXPECTSCONFIDENTIAL') {
        // Expects Confidential Enrichment (Mask Next User Input)
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.expectsConfidential, '', {}))
      }
      // Attempt to authorize party
      if (response.enrichmentName === 'AUTHPARTY') {
        this.authParty(response.message.context)
        //this.authPartyContext(response.message.context)
      }
      if (response.enrichmentName === 'ZIP') {
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.morphInput, AppCommService.subTypeEnum.morphInput.zip, {}))
      }
      if (response.enrichmentName === 'LASTNAME') {
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.morphInput, AppCommService.subTypeEnum.morphInput.lastName, {}))
      }
      if (response.enrichmentName === 'DOB') {
        // Confidential and requires an input morph
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.expectsConfidential, '', {}))
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.morphInput, AppCommService.subTypeEnum.morphInput.datePII, {}))
      }
      if (response.enrichmentName === 'LAST4SSN') {
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.expectsConfidential, '', {}))
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.morphInput, AppCommService.subTypeEnum.morphInput.last4ssn, {}))
      }
      if (response.enrichmentName === 'DATE') {
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.morphInput, AppCommService.subTypeEnum.morphInput.date, {}))
      }
    })
  }

  public authParty(context: any) {
    // console.log("Authenticating Party")
    this._billing.getParty(this._billingData.authElements).subscribe(response => {
      context.lastName = null
      context.zipCode = null
      context.last4SSN = null
      context.dateOfBirth = null
      if (response.partyInfo) {
        this._billingData.partyData = response
        // console.log('auth passed')
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.authParty, AppCommService.subTypeEnum.authParty.success, response))
        context.authenticated = 'true'
        this.getBillingData(this._billingData.partyData.partyInfo.partyId, context)
      } else {
        // console.log('auth failed')
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.authParty, AppCommService.subTypeEnum.authParty.fail, {}))
        this.sendMessage('', context, true)
      }
    })
  }

  public getBillingData(cdhid: string, context: any) {
    // console.log("Getting Billing Data")
    this._billing.getBillingAccounts(cdhid).subscribe(response => {
      this._billingData.billingData = response
      this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.billingData, AppCommService.subTypeEnum.billingData.received, {}))
      // Check if there are multiple accounts. This will need be clarified with user if true
      context.accountTypes = this._billingData.getAvailableAccountTypes()
      context.accountIndicators = this._billingData.getAccountIndicators()
      if (this._billingData.hasMultipleAccounts()) {
        context.multipleAccounts = 'true'
      } else {
        context.multipleAccounts = 'false'
        context.currentAccount = context.accountTypes[0]
      }
      this.sendMessage('', context, true)
    })
  }

  public augmentMessage(message: Array<string>): Array<string> {
    let ret = []
    for (let line of message) {
      ret.push(this._billingData.augmentMessage(line))
    }
    return ret
  }

  public getSentiment(text: string) {
    this._alchemy.getSentiment(text).subscribe(response => {
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.alchemy, AppCommService.subTypeEnum.alchemy.sentiment, response))
        if (Number(response.sentimentScore) * 100 < -80) {
          this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.alchemy, AppCommService.subTypeEnum.alchemy.veryLowSentiment, {}))
        }
    })
  }

  public getEmotion(text: string) {
    this._alchemy.getEmotion(text).subscribe(response => {
        this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.alchemy, AppCommService.subTypeEnum.alchemy.emotion, response))
    })
  }

  public requestAgent(context: any) {
    context.agent = 'true'
    this.sendMessage('', context, true)
  }

  public setLastName(lastName: string, context: any) {
    this._billingData.authElements.lastName = lastName
    context.lastName = 'true'
    this.sendMessage(lastName, context, false, true)
  }
  public setDOB(dob: string, context: any) {
    this._billingData.authElements.dob = dob
    context.dateOfBirth = 'true'
    this.sendMessage(dob, context, false, true)
  }
  public setZip(zip: string, context: any) {
    this._billingData.authElements.zip = zip
    context.zipCode = 'true'
    this.sendMessage(zip, context, false, true)
  }
  public setLast4SSN(last4ssn: string, context: any) {
    this._billingData.authElements.last4ssn = last4ssn
    context.last4SSN = 'true'
    this.sendMessage(last4ssn, context, false, true)
  }

  public switchParty(lastName: string, dob: string, zip: string, last4ssn: string, context: any) {
    this._billingData.authElements.lastName = lastName
    this._billingData.authElements.dob = dob
    this._billingData.authElements.zip = zip
    this._billingData.authElements.last4ssn = last4ssn
    context.immediateChange = 'true'
    this.authParty(context)
  }

  public showDetailsPopup() {
    this.appComm$.emit(new AppCommEvent(AppCommService.typeEnum.showDetailsPopup, '', {}))
  }
}
