import { Component, OnInit } from '@angular/core'
import { AppCommService } from '../../app-comm.service'
import { LoopbackLoginService} from '../../auth/loopback/lb-login.service'

@Component({
  selector: 'wcga-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _appComm: AppCommService, private _lbLogin: LoopbackLoginService) { }

  ngOnInit() {
  }

  showWatsonDetails() {
    this._appComm.showDetailsPopup()
  }

  logout() {
    this._lbLogin.logout().subscribe()
  }

}
