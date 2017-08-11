import { Component } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class CustomModalContext extends BSModalContext {
  public num1: number;
  public num2: number;
}

/**
 * A Sample of how simple it is to create a new window, with its own injects.
 */
@Component({
  selector: 'modal-content',
  templateUrl: './custommodal.component.html',
  styleUrls: ['./custommodal.component.css']
})
export class CustommodalComponent implements CloseGuard, ModalComponent<CustomModalContext> {
  context: CustomModalContext;

  public answer: string;
  public question:string;


  constructor(public dialog: DialogRef<CustomModalContext>) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  onKeyUpAnswer(value) {
    this.answer = value;
  }

  onKeyUpQuestion(value){
    this.question = value;

  }

  beforeDismiss(): boolean {
    return true;
  }

  okClicked(){
    console.log(this.question);
    console.log(this.answer);
    this.dialog.close(this.question+"//////"+this.answer);

  }


  cancelClicked(){
    this.dialog.close();
  }

  beforeClose(): boolean {
    return false;
  }
}
