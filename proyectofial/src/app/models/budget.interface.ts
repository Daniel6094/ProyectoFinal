export interface Gasto {
  id: string;
  presupuestoId: string;
  presupuestoNombre: string;
  categoria: string;
  monto: number;
  fecha: Date;
  // Aliases para compatibilidad con componentes previos
  nombre: string;
  cantidad: number;
}

export interface Presupuesto {
  id: string;
  nombre: string;
  mes: string;
  monto: number;
  saldoRestante: number;
  gastos: Gasto[];
}
