import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agregar-gasto',
  templateUrl: './agregar-gasto.html',
  styleUrls: ['./agregar-gasto.css'],
  imports: [CommonModule, FormsModule]
})
export class AgregarGastoComponent {
  presupuestoSeleccionadoId = signal<string>('');
  categoria = signal<string>('Comida');
  monto = signal<number | null>(null);
  errorMsg = signal<string>('');
  successMsg = signal<string>('');

  categoriasDisponibles = [
    'Comida',
    'Universidad',
    'Transporte',
    'Servicios',
    'Pasajes',
    'Entretenimiento',
    'Salud',
    'Vivienda',
    'Otro'
  ];

  constructor(
    public budgetService: BudgetService,
    public router: Router
  ) {
    // Si hay presupuestos creados, seleccionar por defecto el primero
    const list = this.budgetService.presupuestos();
    if (list.length > 0) {
      this.presupuestoSeleccionadoId.set(list[0].id);
    }
  }

  get presupuestoSeleccionado() {
    return this.budgetService.presupuestos().find(p => p.id === this.presupuestoSeleccionadoId());
  }

  guardarGasto() {
    const pId = this.presupuestoSeleccionadoId();
    const cat = this.categoria().trim();
    const montoVal = this.monto();

    if (!pId) {
      this.errorMsg.set('DEBE SELECCIONAR UN PRESUPUESTO DE LA LISTA');
      this.successMsg.set('');
      return;
    }

    if (!cat) {
      this.errorMsg.set('DEBE SELECCIONAR O INGRESAR UNA CATEGORÍA DE GASTO');
      this.successMsg.set('');
      return;
    }

    if (montoVal === null || montoVal <= 0) {
      this.errorMsg.set('EL MONTO DEL GASTO DEBE SER MAYOR A CERO');
      this.successMsg.set('');
      return;
    }

    // Ejecutar lógica de guardado y validación en el BudgetService
    const result = this.budgetService.addGasto(pId, cat, montoVal);

    if (!result.success) {
      this.errorMsg.set(result.message || 'NO SE PUDO REGISTRAR EL GASTO');
      this.successMsg.set('');
      return;
    }

    // Éxito
    this.errorMsg.set('');
    this.successMsg.set('¡Gasto registrado correctamente!');
    this.monto.set(null);

    setTimeout(() => this.successMsg.set(''), 3000);
  }

  volverOperaciones() {
    this.router.navigate(['/operaciones']);
  }
}
