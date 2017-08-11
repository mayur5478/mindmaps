import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ListOfTopicsComponent } from './list-of-topics/list-of-topics.component';
import { appRouterModule } from "./app.routes";
import { TopicDetailsComponent } from './topic-details/topic-details.component';
import { TopicService } from './my-service.service';
import { HttpModule } from '@angular/http';
import { ModalModule, OverlayRenderer, DOMOverlayRenderer, Overlay  } from 'angular2-modal';
import { Modal,BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { CustommodalComponent } from './custommodal/custommodal.component';
const MODAL_PROVIDERS = [
  Modal,
  Overlay,
  { provide: OverlayRenderer, useClass: DOMOverlayRenderer }
];


@NgModule({
  declarations: [
    AppComponent,
    ListOfTopicsComponent,
    TopicDetailsComponent,
    CustommodalComponent
  ],
  imports: [
    BrowserModule,
    appRouterModule,
    HttpModule,
    ModalModule.forRoot(),
    BootstrapModalModule

  ],
  providers: [TopicService,MODAL_PROVIDERS],
  bootstrap: [AppComponent],
  entryComponents:[CustommodalComponent]
})

export class AppModule { }
