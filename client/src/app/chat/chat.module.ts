/**
* @Date:   2017-02-07T09:23:48-06:00
* @Last modified time: 2017-03-03T00:42:58-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import { CommonModule } from '@angular/common'
import { ChatboxComponent } from './chatbox/chatbox.component'
import { ChatinputComponent } from './chatbox/chatinput/chatinput.component'
import { ChatbubbleComponent } from './chatbox/chatbubble/chatbubble.component'
import { ModalModule } from 'ng2-bootstrap'
import { LinkyModule } from 'angular-linky'

import { ChatExtensionsModule } from '../chat-extensions/chat-extensions.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    ChatExtensionsModule,
    LinkyModule
  ],
  exports : [
    ChatboxComponent
  ],
  declarations: [
    ChatboxComponent,
    ChatinputComponent,
    ChatbubbleComponent
  ]
})
export class ChatModule { }
