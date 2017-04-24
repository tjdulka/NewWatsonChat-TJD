/**
* @Date:   2017-02-07T09:23:48-06:00
* @Last modified time: 2017-03-24T14:35:37-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { AlertModule } from 'ng2-bootstrap'
import { GeneralModule } from './general/general.module'
import { AppComponent } from './app.component'

import { PathLocationStrategy, LocationStrategy } from '@angular/common'
import { AuthGuard } from './auth/auth.guard'
import { AuthModule } from './auth/auth.module'
import { AppRoutingModule } from './app-routing.module'

import { OrchestratedConversationService } from './orchestrated-conversation.service'
import { BillingService } from './billing.service'
import { AlchemyService } from './alchemy.service'
import { AppCommService } from './app-comm.service'
import { BillingDataService } from './billing.data.service'
// import 'chart.js/dist/Chart.bundle.min.js'

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    GeneralModule,
    AlertModule,
    AppRoutingModule,
    AuthModule
  ],
  providers: [
    OrchestratedConversationService,
    AlchemyService,
    {provide: LocationStrategy, useClass: PathLocationStrategy} ,
    AuthGuard,
    { provide: 'Window',  useValue: window },
    AppCommService,
    BillingService,
    BillingDataService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
