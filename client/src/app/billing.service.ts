/**
* @Date:   2017-02-13T17:59:03-06:00
* @Last modified time: 2017-03-24T17:04:47-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/

//
// This is the implementation of the integration with mock billing and auth APIs
//

import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { AuthElements } from './classes/auth.authElements.class'
import * as qs from 'querystring'
import 'rxjs/add/operator/map'

@Injectable()
export class BillingService {
  private _partyURL = window.location.origin + '/api/billing/getParty'
  private _billingAccountsURL = window.location.origin + '/api/billing/getBillingAccounts'
  constructor(private _http: Http) {
  }

  getPartyFromContext(context: any): Observable<any> {
    if (context.lastName && context.dateOfBirth && context.zipCode && context.last4SSN) {
      return this._http.get(this._partyURL + '?' + qs.stringify(
        {
          lastName: context.lastName,
          dateOfBirth: context.dateOfBirth,
          zip5: context.zipCode,
          last4OfSocialSecurityNumber: context.last4SSN,
          access_token: sessionStorage.getItem('wsl-api-token')
        }))
        .map((res: Response) => res.json())
    }
    return null
  }

  getParty(authElements: AuthElements): Observable<any> {
    return this._http.get(this._partyURL + '?' + qs.stringify(
      {
        lastName: authElements.lastName,
        dateOfBirth: authElements.dob,
        zip5: authElements.zip,
        last4OfSocialSecurityNumber: authElements.last4ssn,
        access_token: sessionStorage.getItem('wsl-api-token')
      }))
      .map((res: Response) => res.json())
  }

  getBillingAccounts(cdhid: string): Observable<any> {
    return this._http.get(this._billingAccountsURL + '?' + qs.stringify({cdhid: cdhid, access_token: sessionStorage.getItem('wsl-api-token')}))
      .map((res: Response) => res.json())
  }

}
