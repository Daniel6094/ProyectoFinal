import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operaciones',
  templateUrl: './operaciones.html',
  styleUrls: ['./operaciones.css'],
  imports: []
})
export class OperacionesComponent {
  constructor(private router: Router) {}

  irCrearPresupuesto() {
    this.router.navigate(['/operaciones/crear-presupuesto']);
  }

  irAgregarGasto() {
    this.router.navigate(['/operaciones/agregar-gasto']);
  }
}
