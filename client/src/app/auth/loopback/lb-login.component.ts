/*
# Copyright 2016 IBM Corp. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License")  you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and
# limitations under the License.
*/
import { Component } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'

import { LoopbackLoginService } from './lb-login.service'

@Component({
  selector: 'wsl-lb-login',
  templateUrl: './lb-login.component.html',
  styleUrls: ['./lb-login.component.css']
})
export class LoopbackLoginComponent {

  public loginForm: FormGroup // our model driven form
  public submitted: boolean // keep track on whether form is submitted
  public events: any[] = []
  public isError: boolean
  public errorMsg: string
  public buttonText: String = 'Submit'

  private credentials: any

  constructor(private _fb: FormBuilder, private loginService: LoopbackLoginService) {
    this.loginForm = this._fb.group({
       username: ['', Validators.required],
       password: ['', Validators.required],
       ttl: [36000]
    })
  }

  submitLogin() {
    this.credentials = this.loginForm.value
    // Logout previous token in session storage and remove token from session storage
    let stored = this.loginService.get()
    if (stored && stored.token) {
      this.loginService.logout().subscribe(
        success => {
          if (success) {
            this.loginService.destroyToken()
          } else {
            console.log('No Token found in session storage')
          }
        }
      )
    }
    // Reset the error
    this.isError = false
    // Use an observable to call the server and get an async response back
    this.loginService.login(this.credentials).subscribe(
      res => {
        console.log('Successfully logged in.')
        this.loginForm.reset()
      },
      err => {
        console.log('Error logging in.')
        console.log(err)
        this.isError = true
        this.errorMsg = err.message
        this.buttonText = 'Error Logging In'
        setTimeout(() => {
          this.buttonText = 'Submit'
          this.isError = false
        }, 2500)
    })
  }

}
