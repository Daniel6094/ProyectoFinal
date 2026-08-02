import { Component, signal } from '@angular/core';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-ingresar-gasto',
  templateUrl: './ingresar-gasto.html',
  styleUrls: ['./ingresar-gasto.css'],
  imports: []
})
export class IngresarGastoComponent {
  nombreGasto = signal<string>('');
  cantidadGasto = signal<number>(0);
  errorMsg = signal<string>('');

  constructor(private budgetService: BudgetService) {}

  agregarGasto() {
    const nombre = this.nombreGasto().trim();
    const cantidad = this.cantidadGasto();
    const restante = this.budgetService.restante();

    if (!nombre || cantidad <= 0) {
      this.errorMsg.set('NOMBRE GASTO O CANTIDAD INCORRECTA');
      return;
    }

    if (cantidad > restante) {
      this.errorMsg.set('CANTIDAD INGRESADA ES MAYOR AL RESTANTE');
      return;
    }

    // Si todo está bien, registramos el gasto y limpiamos el mensaje de error
    this.errorMsg.set('');
    this.budgetService.addGasto(nombre, cantidad);
    
    // Dejamos los campos del formulario como al inicio
    this.nombreGasto.set('');
    this.cantidadGasto.set(0);
  }
}
