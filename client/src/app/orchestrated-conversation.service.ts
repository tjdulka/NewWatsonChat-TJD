/**
* @Date:   2017-02-07T09:23:48-06:00
 * @Last modified time: 2017-04-11T07:59:54-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { Injectable, EventEmitter } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs/Observable'
// import { LoopbackLoginComponent } from './auth/loopback/lb-login.component'
import 'rxjs/add/operator/map'


@Injectable()
export class OrchestratedConversationService {
  public externalMessage$: EventEmitter<any>
  public watsonDetails$: EventEmitter<any>
  private _url = window.location.origin + '/api/watson-conversation/orchestratedMessage'
  constructor(private _http: Http) {
    this.externalMessage$ = new EventEmitter()
    this.watsonDetails$ = new EventEmitter()
  }

  sendMessage(message: string, context: any): Observable<any> {
    let body: any = {
      input: {
        text: message
      },
      context: context
    }
    return this._http.post(this._url + '?access_token=' + sessionStorage.getItem('wsl-api-token'), body)
      .map((res: Response) => {
        return res.json()
      })
  }
  /**
   * For sending messages from a source that is
   * NOT from the message input panel
   */
  sendExternalMessage(message: String, type = 'text') {
    this.externalMessage$.emit(
      {
        message: message,
        type: type
      })
  }

  showWatsonDetails() {
    this.watsonDetails$.emit(true)
  }
}
