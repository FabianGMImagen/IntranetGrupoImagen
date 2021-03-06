import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  @Input() message = { body: '', type: '' };

  setMessage(body, type, time = 4000) {
    this.message.body = body;
    this.message.type = type;
    setTimeout(() => { this.message.body = ''; }, time);
  }
}
