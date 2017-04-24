/**
* @Date:   2017-02-07T09:23:48-06:00
 * @Last modified time: 2017-04-11T14:18:51-05:00
* @License: Licensed under the Apache License, Version 2.0 (the "License");  you may not use this file except in compliance with the License.
You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
  limitations under the License.

* @Copyright: Copyright 2016 IBM Corp. All Rights Reserved.
*/



//
// This is routing infomration for the app
//
import { NgModule }             from '@angular/core'
import { RouterModule, Routes, RouterOutlet } from '@angular/router'

import { AuthGuard } from './auth/auth.guard'
import { LoopbackLoginComponent } from './auth/loopback/lb-login.component'

import { HomeComponent } from './general/home/home.component'

const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoopbackLoginComponent },
  { path: '**', redirectTo: '/home' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
