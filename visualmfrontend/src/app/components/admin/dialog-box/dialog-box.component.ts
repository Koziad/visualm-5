import { Component, OnInit, Inject, Optional  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;

}


@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css']
})


export class DialogBoxComponent {

  action:string;
  local_data:any;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UserData) {
    console.log(data);
    this.local_data = {...data};
    this.action = this.local_data.action;
  }

  doAction(){
    this.dialogRef.close({event:'Confirm'});

  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
