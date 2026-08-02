import { Injectable, signal, computed } from '@angular/core';
import { Presupuesto, Gasto } from '../models/budget.interface';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  // Estado principal con lista de presupuestos
  public presupuestos = signal<Presupuesto[]>([
    {
      id: '1',
      nombre: 'Presupuesto Alimentación',
      mes: 'Enero',
      monto: 250000,
      saldoRestante: 180000,
      gastos: [
        {
          id: 'g1',
          presupuestoId: '1',
          presupuestoNombre: 'Presupuesto Alimentación',
          categoria: 'Comida',
          monto: 70000,
          fecha: new Date(),
          nombre: 'Comida',
          cantidad: 70000
        }
      ]
    },
    {
      id: '2',
      nombre: 'Gastos Universitarios',
      mes: 'Febrero',
      monto: 400000,
      saldoRestante: 0,
      gastos: [
        {
          id: 'g2',
          presupuestoId: '2',
          presupuestoNombre: 'Gastos Universitarios',
          categoria: 'Universidad',
          monto: 400000,
          fecha: new Date(),
          nombre: 'Universidad',
          cantidad: 400000
        }
      ]
    }
  ]);

  // Propiedades computadas para el Dashboard (Resúmenes)
  
  // 1. Cantidad de presupuestos creados
  public cantidadPresupuestos = computed(() => this.presupuestos().length);

  // 2. Cantidad de presupuestos agotados (saldoRestante <= 0)
  public cantidadAgotados = computed(() => 
    this.presupuestos().filter(p => p.saldoRestante <= 0).length
  );

  // 3. Mes con el presupuesto más alto
  public mesPresupuestoMasAlto = computed(() => {
    const list = this.presupuestos();
    if (list.length === 0) return 'Sin datos';

    const sumaPorMes: { [mes: string]: number } = {};
    for (const p of list) {
      sumaPorMes[p.mes] = (sumaPorMes[p.mes] || 0) + p.monto;
    }

    let maxMes = '';
    let maxMonto = -1;
    for (const [mes, monto] of Object.entries(sumaPorMes)) {
      if (monto > maxMonto) {
        maxMonto = monto;
        maxMes = mes;
      }
    }

    return maxMes || 'Sin datos';
  });

  // 4. Categoría de gasto con mayor consumo
  public categoriaMayorConsumo = computed(() => {
    const list = this.presupuestos();
    const consumoPorCategoria: { [cat: string]: number } = {};
    let hayGastos = false;

    for (const p of list) {
      for (const g of p.gastos) {
        hayGastos = true;
        const catKey = g.categoria || g.nombre || 'General';
        const montoKey = g.monto || g.cantidad || 0;
        consumoPorCategoria[catKey] = (consumoPorCategoria[catKey] || 0) + montoKey;
      }
    }

    if (!hayGastos) return 'Sin gastos registradas';

    let maxCat = '';
    let maxConsumo = -1;
    for (const [cat, total] of Object.entries(consumoPorCategoria)) {
      if (total > maxConsumo) {
        maxConsumo = total;
        maxCat = cat;
      }
    }

    return maxCat || 'Sin datos';
  });

  // Métodos de manipulación de datos

  /**
   * Crear un nuevo presupuesto
   */
  addPresupuesto(nombre: string, mes: string, monto: number): void {
    const nuevo: Presupuesto = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      mes: mes.trim(),
      monto,
      saldoRestante: monto,
      gastos: []
    };

    this.presupuestos.set([...this.presupuestos(), nuevo]);
  }

  /**
   * Agregar un gasto (Soporta 3 o 2 argumentos para compatibilidad)
   */
  addGasto(arg1: string, arg2: string | number, arg3?: number): { success: boolean; message?: string } {
    let presupuestoId: string;
    let categoria: string;
    let monto: number;

    const list = [...this.presupuestos()];

    if (typeof arg2 === 'number' && (arg3 === undefined || arg3 === null)) {
      // Firma de 2 argumentos: addGasto(categoriaONombre, cantidad)
      if (list.length === 0) {
        return { success: false, message: 'No hay presupuestos creados para asociar este gasto.' };
      }
      presupuestoId = list[0].id;
      categoria = arg1;
      monto = arg2;
    } else {
      // Firma de 3 argumentos: addGasto(presupuestoId, categoria, monto)
      presupuestoId = arg1;
      categoria = arg2 as string;
      monto = arg3 as number;
    }

    const index = list.findIndex(p => p.id === presupuestoId);

    if (index === -1) {
      return { success: false, message: 'El presupuesto seleccionado no existe.' };
    }

    const pres = list[index];

    // Validación de presupuesto agotado o monto excedido
    if (pres.saldoRestante <= 0) {
      return { success: false, message: 'El presupuesto seleccionado ya se encuentra agotado.' };
    }

    if (monto > pres.saldoRestante) {
      return { 
        success: false, 
        message: `El monto (₡${monto.toLocaleString()}) supera el saldo disponible (₡${pres.saldoRestante.toLocaleString()}) del presupuesto.` 
      };
    }

    // Crear el nuevo gasto
    const nuevoGasto: Gasto = {
      id: Date.now().toString(),
      presupuestoId: pres.id,
      presupuestoNombre: pres.nombre,
      categoria: categoria.trim(),
      monto,
      fecha: new Date(),
      nombre: categoria.trim(),
      cantidad: monto
    };

    // Actualizar presupuesto con el nuevo gasto y saldo restante
    const presupuestoActualizado: Presupuesto = {
      ...pres,
      saldoRestante: pres.saldoRestante - monto,
      gastos: [...pres.gastos, nuevoGasto]
    };

    list[index] = presupuestoActualizado;
    this.presupuestos.set(list);

    return { success: true };
  }

  // Métodos y signals computados de compatibilidad
  public presupuesto = computed(() => {
    const list = this.presupuestos();
    return list.reduce((acc, p) => acc + p.monto, 0);
  });

  public restante = computed(() => {
    const list = this.presupuestos();
    return list.reduce((acc, p) => acc + p.saldoRestante, 0);
  });

  public gastos = computed(() => {
    return this.presupuestos().flatMap(p => p.gastos);
  });

  setPresupuesto(monto: number) {
    if (this.presupuestos().length > 0) {
      const list = [...this.presupuestos()];
      list[0] = {
        ...list[0],
        monto,
        saldoRestante: monto,
        gastos: []
      };
      this.presupuestos.set(list);
    } else {
      this.addPresupuesto('Presupuesto Principal', 'Enero', monto);
    }
  }

  getRestanteColorClass(): string {
    const pres = this.presupuesto();
    const rest = this.restante();
    if (pres === 0) return 'alert alert-info';
    const third = pres / 3;
    
    if (rest < third) {
      return 'alert alert-danger';
    } else if (rest === third) {
      return 'alert alert-warning';
    } else {
      return 'alert alert-info';
    }
  }
}
