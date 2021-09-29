import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'client/app/admin_Page/admin/admin.component';
import { ToastComponent } from 'client/app/shared/toast/toast.component';

@Component({
  selector: 'app-dialog-delete-user',
  templateUrl: './dialog-delete-user.component.html',
  styleUrls: ['./dialog-delete-user.component.css']
})
export class DialogDeleteUserComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogDeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public toast: ToastComponent) { }

  ngOnInit(): void {
  }

  onCancelClick(){
    this.dialogRef.close();
    console.log("le dimos que no");
    this.toast.setMessage('Operacion de cancelacion cancelada.', 'warning');
  }

}
