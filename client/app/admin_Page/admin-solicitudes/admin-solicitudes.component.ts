import { Component, OnInit } from '@angular/core';
import { SolicitudCompraService } from 'client/app/services/solicitudcompra.service';

@Component({
  selector: 'app-admin-solicitudes',
  templateUrl: './admin-solicitudes.component.html',
  styleUrls: ['./admin-solicitudes.component.css']
})
export class AdminSolicitudesComponent implements OnInit {

  constructor(public solicitudComp: SolicitudCompraService,) { }

  ngOnInit(): void {
  }

}
