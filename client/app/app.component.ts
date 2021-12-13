import { AfterViewChecked, ChangeDetectorRef, Component } from '@angular/core';
import { AuthServices } from './services/auth.service';
import { Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import { Keepalive} from '@ng-idle/keepalive';
import * as moment from 'moment';


import { SolicitudCompraService } from './services/solicitudcompra.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewChecked {

  idleState = 'No iniciado'; 
  timedOut = false; 
  lastPing ?: Date = null;

  constructor(public auth: AuthServices,
              private changeDetector: ChangeDetectorRef,
              private idle: Idle, private keepalive: Keepalive,
              public solComp:SolicitudCompraService) { 
                
              // establece un tiempo de espera inactivo de 5 minutos, para propósitos de prueba.
              idle.setIdle(5);
              // Establece un tiempo de espera de 5 horas. Después de 5 horas y 5 minutos segundos de inactividad, el usuario se considerará agotado
              idle.setTimeout(18000);
              // establece las interrupciones predeterminadas, en este caso, cosas como clics, desplazamientos, toques en el documento
              idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
              
              
              idle.onIdleEnd.subscribe(() => this.idleState = 'Ya no está inactivo.');
              idle.onTimeout.subscribe(() => {
                this.idleState = '¡ahora estas desconectado!';
                this.timedOut = true;
                this.auth.logout();
              });
              idle.onIdleStart.subscribe(() => this.idleState = 'Te hemos deslogeado');
              idle.onTimeoutWarning.subscribe((countdown) => this.idleState = '¿Estás ahí? Te desloguearemos en ...' + moment.utc(countdown*1000).format('HH:mm:ss') + ' segundos!');

              // establece el intervalo de ping a 5 horas
              keepalive.interval(18000);

              keepalive.onPing.subscribe(() => this.lastPing = new Date());
              this.reset ();

              }

  // This fixes: https://github.com/DavideViolante/Angular-Full-Stack/issues/105
  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }



  reset() {
    this.idle.watch();
    this.idleState = ' ';
    this.timedOut = false;
  }
}
