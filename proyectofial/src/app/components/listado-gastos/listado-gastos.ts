import { Component } from '@angular/core';
import { BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-listado-gastos',
  templateUrl: './listado-gastos.html',
  styleUrls: ['./listado-gastos.css'],
  imports: []
})
export class ListadoGastosComponent {
  constructor(public budgetService: BudgetService) {}
}
