import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }


  getMonthlySales(): Observable<{ month: string; sales: number }[]> {
    const data = [
      { month: 'Enero', sales: 5000 },
      { month: 'Febrero', sales: 4500 },
      { month: 'Marzo', sales: 5200 },
      { month: 'Abril', sales: 4800 },
    ];
    return of(data);
  }

  // 2. Total de ventas del mes actual
  getCurrentMonthSales(): Observable<number> {
    const currentMonthSales = 4800; // Simulación del total actual
    return of(currentMonthSales);
  }

  // 3. Entradas registradas (productos añadidos)
  getInventoryEntries(): Observable<{ date: string; product: string; quantity: number }[]> {
    const entries = [
      { date: '2025-01-01', product: 'Producto A', quantity: 10 },
      { date: '2025-01-02', product: 'Producto B', quantity: 5 },
      { date: '2025-01-03', product: 'Producto C', quantity: 8 },
    ];
    return of(entries);
  }

  // 4. Productos más vendidos por día
  getTopSellingProducts(): Observable<{ date: string; product: string; sales: number }[]> {
    const topSelling = [
      { date: '2025-01-01', product: 'Producto A', sales: 50 },
      { date: '2025-01-02', product: 'Producto B', sales: 30 },
      { date: '2025-01-03', product: 'Producto A', sales: 40 },
    ];
    return of(topSelling);
  }

  // 5. Productos menos vendidos por día
  getLowSellingProducts(): Observable<{ date: string; product: string; sales: number }[]> {
    const lowSelling = [
      { date: '2025-01-01', product: 'Producto C', sales: 5 },
      { date: '2025-01-02', product: 'Producto A', sales: 10 },
      { date: '2025-01-03', product: 'Producto B', sales: 8 },
    ];
    return of(lowSelling);
  }
}

