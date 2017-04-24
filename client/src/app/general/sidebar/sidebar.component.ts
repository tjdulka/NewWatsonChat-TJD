import { Component, ViewChild } from '@angular/core'
import { AppCommEvent } from '../../classes/appcomm.event.class'
import { AppCommService } from '../../app-comm.service'
import { ModalDirective } from 'ng2-bootstrap'

@Component({
  selector: 'wcga-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  public helperMessage = 'I\'m here to answer your questions about your bill. To get started, I first need to confirm your identity.'
  @ViewChild(ModalDirective) private detailsMobile: ModalDirective // Popup for mobile devices

  constructor(private _appComm: AppCommService) {
    _appComm.appComm$.subscribe((event: AppCommEvent) => {
      if (event.type === AppCommService.typeEnum.showDetailsPopup) {
        this.detailsMobile.show()
      }
      if (event.type === AppCommService.typeEnum.authParty &&
          event.subType === AppCommService.subTypeEnum.authParty.success) {
        this.helperMessage = 'Now that you have authenticated, ask me a question about your bill. For instance, "When is my bill due?"'
      }
    })
  }


}
