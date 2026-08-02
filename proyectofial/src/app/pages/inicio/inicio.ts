import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
  imports: []
})
export class InicioComponent {
  constructor(private router: Router) {}

  ingresar() {
    this.router.navigate(['/dashboard']);
  }
}
