import { Component } from '@angular/core';
import { AuthServices } from '../services/auth.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html'
})
export class AboutComponent {

  constructor(public auth: AuthServices) { }

}
