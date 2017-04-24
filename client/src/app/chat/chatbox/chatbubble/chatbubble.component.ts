/**
* @Date:   2017-02-07T09:23:48-06:00
* @Last modified time: 2017-03-03T00:42:04-06:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { Component, OnInit, Input, trigger, state, style, transition, animate, EventEmitter, Output} from '@angular/core'
import { PropertySuggestionComponent } from '../../../chat-extensions/property-suggestion/property-suggestion.component'

@Component({
  selector: 'wcga-chatbubble',
  templateUrl: './chatbubble.component.html',
  styleUrls: ['./chatbubble.component.css'],
  animations: [
  trigger('flyInOut', [
    state('inRight', style({transform: 'none'})),
    state('inLeft', style({transform: 'none'})),
    transition('void => inRight', [
      style({transform: 'translateX(100%)'}),
      animate('150ms cubic-bezier(0, .7, 0.5, 1)')
    ]),
    transition('void => inLeft', [
      style({transform: 'translateX(-100%)'}),
      animate('150ms cubic-bezier(0, .7, 0.5, 1)')
    ]),
    transition('inLeft => void', [
      animate('150ms 500ms cubic-bezier(.7, 0, 1, .5)', style({transform: 'translateX(-100%)'}))
    ])
  ])
]
})
export class ChatbubbleComponent implements OnInit {
  @Input() message: string
  @Input() direction: string = 'to'
  @Input() type: string = 'text'
  @Input() enrichment: any
  @Input() adjacent: boolean // is adjacent to a previous message from same source?
  @Input() showMessage: boolean = true
  @Output() animateEnd = new EventEmitter()


  constructor() {
  }

  ngOnInit() {
    this.direction = this.direction.toLowerCase() + '-watson'

  }
  // Let the app know that it's animation is done
  animationDone($event) {
    let direction = ''
    if ($event.fromState === 'void') {
      direction = 'in'
    } else {
      direction = 'out'
    }
    this.animateEnd.emit(direction)
  }
}
