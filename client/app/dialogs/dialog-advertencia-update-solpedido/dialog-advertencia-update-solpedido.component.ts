import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AccountComponent } from 'client/app/account_sol/account/account.component';

@Component({
  selector: 'app-dialog-advertencia-update-solpedido',
  templateUrl: './dialog-advertencia-update-solpedido.component.html',
  styleUrls: ['./dialog-advertencia-update-solpedido.component.css']
})
export class DialogAdvertenciaUpdateSolpedidoComponent implements OnInit {
  NameType:string;
  constructor(public dialogRef: MatDialogRef<AccountComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    console.log(this.data);
    this.NameType = (this.data === 0) ? 'Datos Generales' 
    : (this.data === 1) ? 'Datos Concepto'
    : (this.data === 2) ? 'Data SubConcepto': 'N/A';
  }


  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
