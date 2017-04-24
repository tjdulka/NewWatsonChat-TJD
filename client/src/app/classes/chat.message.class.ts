/**
* @Date:   2017-02-07T09:23:48-06:00
* @Last modified time: 2017-03-03T00:43:29-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



//
// This represents a single chat message.
//
export class ChatMessage {
  // Explicitly defined for clarity
  public message: string // The body of the message
  public direction: string // The direction of the message: (to/from) Watson
  public type: string // The type of message (most of the time, text, but enrichments are ID'd here)
  public pending: boolean // Tag the message as pending. Used for the typing indicator. Only set to true for the indicator element
  public enrichment: any // The enrichment data (if any)
  constructor(message: string, direction: string, type = 'text', pending = false, enrichment: any = undefined) {
    this.message = message
    this.direction = direction
    this.type = type
    this.pending = pending
    this.enrichment = enrichment
  }
}
