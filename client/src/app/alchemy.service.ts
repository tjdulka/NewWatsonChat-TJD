/**
* @Date:   2017-02-07T09:23:48-06:00
* @Last modified time: 2017-03-03T00:43:31-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



//
// Implementation of alchemy integration
//

import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs/Observable'
import * as qs from 'querystring'
import 'rxjs/add/operator/map'

@Injectable()
export class AlchemyService {
  private _sentimentUrl = window.location.origin + '/api/alchemy/getSentiment'
  private _emotionUrl = window.location.origin + '/api/alchemy/getEmotion'
  constructor(private _http: Http) {
  }

  getSentiment(text: string): Observable<any> {
    return this._http.get(this._sentimentUrl + '?' + qs.stringify({text: text, access_token: sessionStorage.getItem('wsl-api-token')}))
      .map((res: Response) => res.json())
  }

  getEmotion(text: string): Observable<any> {
    return this._http.get(this._emotionUrl + '?' + qs.stringify({text: text, access_token: sessionStorage.getItem('wsl-api-token')}))
      .map((res: Response) => res.json())
  }
}
