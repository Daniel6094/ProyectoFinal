import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-presupuesto',
  templateUrl: './crear-presupuesto.html',
  styleUrls: ['./crear-presupuesto.css'],
  imports: [CommonModule, FormsModule]
})
export class CrearPresupuestoComponent {
  nombre = signal<string>('');
  mes = signal<string>('Enero');
  monto = signal<number | null>(null);
  errorMsg = signal<string>('');
  successMsg = signal<string>('');

  mesesDisponibles = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(
    public budgetService: BudgetService,
    private router: Router
  ) {}

  guardarPresupuesto() {
    const nombreVal = this.nombre().trim();
    const mesVal = this.mes().trim();
    const montoVal = this.monto();

    if (!nombreVal) {
      this.errorMsg.set('POR FAVOR INGRESE EL NOMBRE DEL PRESUPUESTO');
      this.successMsg.set('');
      return;
    }

    if (!mesVal) {
      this.errorMsg.set('POR FAVOR SELECCIONE EL MES DEL PRESUPUESTO');
      this.successMsg.set('');
      return;
    }

    if (montoVal === null || montoVal <= 0) {
      this.errorMsg.set('EL MONTO DEL PRESUPUESTO DEBE SER MAYOR A CERO');
      this.successMsg.set('');
      return;
    }

    // Guardar presupuesto en el servicio
    this.budgetService.addPresupuesto(nombreVal, mesVal, montoVal);

    // Reiniciar formulario
    this.nombre.set('');
    this.monto.set(null);
    this.errorMsg.set('');
    this.successMsg.set('¡Presupuesto creado con éxito!');

    setTimeout(() => this.successMsg.set(''), 3000);
  }

  volverOperaciones() {
    this.router.navigate(['/operaciones']);
  }
}
