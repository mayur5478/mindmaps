import {Component, OnInit, ViewContainerRef} from '@angular/core';
import { TopicService } from "../my-service.service";
import { Topics } from '../topics';
import {Overlay} from 'angular2-modal';
import {Modal} from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'app-list-of-topics',
  templateUrl: './list-of-topics.component.html',
  styleUrls: ['./list-of-topics.component.css']
})
export class ListOfTopicsComponent implements OnInit {
  topics:Topics[];
  errorMessage:string = '';
  isLoading:boolean = true;

  constructor(private topicService:TopicService, overlay:Overlay, vcRef:ViewContainerRef, public modal:Modal) {
  }

  ngOnInit() {
    this.topicService
      .getAllTopics()
      .then(topics => this.topics = topics)
      .catch(errorMsg => this.errorMessage = errorMsg);
  }

  newTopic() {
    console.log("here");
    this.modal.prompt()
      .size('lg')
      .isBlocking(true)
      .showClose(true)
      .keyboard(27)
      .title('Enter new topic name ')
      .open()
      .then(dialog => dialog.result)
      .then(result => {
        console.log(result);
        let Topics = <Topics>({
          name: result
        });

        this.topicService.addTopics(Topics).then(msg =>{
          this.ngOnInit();
        });
      });
  }
}
