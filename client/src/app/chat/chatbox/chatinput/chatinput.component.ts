/**
* @Date:   2017-02-07T09:23:48-06:00
 * @Last modified time: 2017-04-11T08:30:19-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { Component, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef, Renderer } from '@angular/core'
import * as moment from 'moment'
import { AppCommService } from '../../../app-comm.service'
import { AppCommEvent } from '../../../classes/appcomm.event.class'


@Component({
  selector: 'wcga-chatinput',
  templateUrl: './chatinput.component.html',
  styleUrls: ['./chatinput.component.css']
})
export class ChatinputComponent implements AfterViewInit {
  public text: string = ''
  @Output() sendMessage = new EventEmitter<string>()
  @Output() needAgent = new EventEmitter<boolean>()
  @ViewChild('chatInput') private inputElement: ElementRef
  @ViewChild('sendButton') private sendButton: ElementRef
  private inputType = 'text'
  private validateType = ''
  private placeholderText = 'Enter your message'
  private valid = false
  private shakeTransfer = false
  constructor(private _appComm: AppCommService, private renderer: Renderer) {
    // Subscription to AppComm Events
    _appComm.appComm$.subscribe((event: AppCommEvent) => {
      if (event.type === AppCommService.typeEnum.alchemy && event.subType === AppCommService.subTypeEnum.alchemy.veryLowSentiment) {
        this.shakeTransfer = true
        setTimeout(() => {
          this.shakeTransfer = false
        }, 3000)
      }
     if (event.type === AppCommService.typeEnum.morphInput) {
       if (event.subType === AppCommService.subTypeEnum.morphInput.date || event.subType === AppCommService.subTypeEnum.morphInput.datePII) {
         this.inputType = 'date'
         this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'blur')
         setTimeout(() => {
           this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus')
         }, 1)
       }
       if (event.subType === AppCommService.subTypeEnum.morphInput.zip) {
         this.inputType = 'text'
         this.validateType = 'zip'
         this.placeholderText = '00000'
       }
       if (event.subType === AppCommService.subTypeEnum.morphInput.last4ssn) {
         this.inputType = 'text'
         this.validateType = 'last4ssn'
         this.placeholderText = '0000'
       }
     }
    })
  }
  // Validate the input based on the marked validateType
  validateInput() {
    if (this.validateType === 'zip') {
      setTimeout(() => {
        this.text = this.text.replace(/[^0-9]/g, '')
      })
      if (this.text.length > 5) {
        setTimeout(() => {
          this.text = this.text.slice(0, 5)
        }, 5)
      }
      if (this.text.length < 5) {
        this.valid = false
      } else {
        this.valid = true
      }
    } else if (this.validateType === 'last4ssn') {
      setTimeout(() => {
        this.text = this.text.replace(/[^0-9]/g, '')
      })
      if (this.text.length > 4) {
        setTimeout(() => {
          this.text = this.text.slice(0, 4)
        }, 5)
      }
      if (this.text.length < 4) {
        this.valid = false
      } else {
        this.valid = true
      }
    } else {
      if (this.text.length > 0) {
        this.valid = true
      } else {
        this.valid = false
      }

    }

    // Check if the send button should show
    if (!this.valid) {
      this.renderer.invokeElementMethod(this.sendButton.nativeElement, 'setAttribute', ['disabled', true])
    } else {
      this.renderer.invokeElementMethod(this.sendButton.nativeElement, 'removeAttribute', ['disabled'])
    }
  }
  // Press enter to submit
  emitKeyPress(e) {
    if (this.valid) {
      if (e.code === 'Enter' || e.code === 'enter') {
        this.emitSendMessage()
      }
    }
  }
  // Let the app know we are sending a message. Formats dates appropriately
  emitSendMessage() {
    if (this.text) {
      if (this.inputType === 'date') {
        this.text = moment(this.text).format('MM-DD-YYYY')
      }
      this.sendMessage.emit(this.text)
    }
    this.text = ''
    this.inputType = 'text'
    this.validateType = ''
    this.placeholderText = 'Enter your message'
    this.valid = false
    this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus')
    this.validateInput()
  }
  // emits the need agent event. Will be processed further by parent
  emitNeedAgent() {
    this.needAgent.emit(true)
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus')
    this.validateInput()
  }
}
