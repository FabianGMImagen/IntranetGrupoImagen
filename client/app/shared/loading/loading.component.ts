import { Component, Input } from '@angular/core';
import { SolicitudCompraService }  from '../../services/solicitudcompra.service';
@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html'
})
export class LoadingComponent {
  //show: boolean;
  public solcompra : SolicitudCompraService;
  ngOnInit(){
    //console.log(this.solcompra.show == true);
  }
}
