import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio';
import { OperacionesComponent } from './pages/operaciones/operaciones';
import { CrearPresupuestoComponent } from './pages/crear-presupuesto/crear-presupuesto';
import { AgregarGastoComponent } from './pages/agregar-gasto/agregar-gasto';
import { DashboardComponent } from './pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent
  },
  {
    path: 'operaciones',
    component: OperacionesComponent
  },
  {
    path: 'operaciones/crear-presupuesto',
    component: CrearPresupuestoComponent
  },
  {
    path: 'operaciones/agregar-gasto',
    component: AgregarGastoComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];
