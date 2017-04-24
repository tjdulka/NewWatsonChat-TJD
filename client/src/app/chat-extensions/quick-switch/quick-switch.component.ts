/**
* @Date:   2017-02-24T10:26:16-06:00
* @Last modified time: 2017-03-03T00:43:09-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { Component, OnInit } from '@angular/core'
import { AppCommEvent } from '../../classes/appcomm.event.class'
import { AppCommService } from '../../app-comm.service'
let quickSwitchCustomers = require('../../../customer_data.json')

@Component({
  selector: 'wcga-quick-switch',
  templateUrl: './quick-switch.component.html',
  styleUrls: ['./quick-switch.component.css']
})
export class QuickSwitchComponent implements OnInit {
  public customers: Array<any> = quickSwitchCustomers.customers
  public currentSelection: number = 0
  private context: any
  constructor(private _appComm: AppCommService) {
    _appComm.appComm$.subscribe((event: AppCommEvent) => {
      if (event.type === AppCommService.typeEnum.conversationContextUpdate) {
        this.context = event.data
      }
    })
  }

  ngOnInit() {
  }
  switchProfile() {
    let c = this.customers[this.currentSelection]
    this._appComm.switchParty(c.lastName, c.dateOfBirth, c.zip5, c.last4SSN, this.context)
  }

}
