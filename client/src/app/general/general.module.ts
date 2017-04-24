import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ChatModule } from '../chat/chat.module'
import { ChatExtensionsModule } from '../chat-extensions/chat-extensions.module'


import { HeaderComponent } from './header/header.component'
import { ModalModule } from 'ng2-bootstrap'
import { HomeComponent } from './home/home.component'
import { SidebarComponent } from './sidebar/sidebar.component'

@NgModule({
  imports: [
    CommonModule,
    ChatModule,
    ModalModule,
    ChatExtensionsModule
  ],
  exports: [
    HomeComponent
  ],
  declarations: [
    HeaderComponent,
    SidebarComponent,
    HomeComponent
  ]
})
export class GeneralModule { }
