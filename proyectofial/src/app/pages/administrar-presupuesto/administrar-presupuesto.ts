import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { IngresarGastoComponent } from '../../components/ingresar-gasto/ingresar-gasto';
import { ListadoGastosComponent } from '../../components/listado-gastos/listado-gastos';

@Component({
  selector: 'app-administrar-presupuesto',
  templateUrl: './administrar-presupuesto.html',
  styleUrls: ['./administrar-presupuesto.css'],
  imports: [IngresarGastoComponent, ListadoGastosComponent]
})
export class AdministrarPresupuestoComponent implements OnInit {
  constructor(
    private budgetService: BudgetService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si no se ha ingresado un presupuesto, mandamos al usuario a crearlo
    if (this.budgetService.presupuesto() <= 0) {
      this.router.navigate(['/crear-presupuesto']);
    }
  }
}
