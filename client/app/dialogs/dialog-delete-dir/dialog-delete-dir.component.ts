import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastComponent } from 'client/app/shared/toast/toast.component';

@Component({
  selector: 'app-dialog-delete-dir',
  templateUrl: './dialog-delete-dir.component.html',
  styleUrls: ['./dialog-delete-dir.component.css']
})
export class DialogDeleteDirComponent implements OnInit {

  constructor(public dialogdeletedir: MatDialogRef<DialogDeleteDirComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toast: ToastComponent) { }

  ngOnInit(): void {
  }

  onCancelClick(){
        this.dialogdeletedir.close();
        console.log("se cancelo la eliminacion de la direccion");
        this.toast.setMessage('Operacion de eliminacion cancelada.', 'warning');
    }

}
