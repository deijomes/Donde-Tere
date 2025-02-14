import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  private Url = 'http://localhost:3000/api/dashboard/top-selling-products'


  getProductSelling(limit: number, startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());

    // Agregar fechas solo si están definidas
    if (startDate) {
        params = params.set('startdate', startDate); // Ya viene en formato correcto
    }
    if (endDate) {
        params = params.set('endDate', endDate); // Ya viene en formato correcto
    }

    const fullUrl = `${this.Url}?${params.toString()}`;
    console.log(" URL generada:", fullUrl);

    return this.http.get(this.Url, { params });
}


















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
  getVentasActual(): Observable<number> {
    const currentMonthSales = 4800; // Simulación del total actual
    return of(currentMonthSales);
  }

  gettotalActual(): Observable<number> {
    const currentMonthSales = 12800000; // Simulación del total actual
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
  getproductosMAsVendidos(): Observable<{ date: string; product: string; sales: number }[]> {
    const topSelling = [
      { date: '2025-01-01', product: 'Producto A', sales: 50 },
      { date: '2025-01-02', product: 'Producto B', sales: 30 },
      { date: '2025-01-03', product: 'Producto A', sales: 40 },
      { date: '2025-01-01', product: 'Producto A', sales: 50 },
      { date: '2025-01-02', product: 'Producto B', sales: 30 },
      { date: '2025-01-03', product: 'Producto A', sales: 40 },
    ];
    return of(topSelling);
  }

  // 5. Productos menos vendidos por día
  getproductosMenossVendidos(): Observable<{ date: string; product: string; sales: number }[]> {
    const lowSelling = [
      { date: '2025-01-01', product: 'Producto C', sales: 5 },
      { date: '2025-01-02', product: 'Producto A', sales: 10 },
      { date: '2025-01-03', product: 'Producto B', sales: 8 },
      { date: '2025-01-01', product: 'Producto C', sales: 5 },
      { date: '2025-01-02', product: 'Producto A', sales: 10 },
      { date: '2025-01-09', product: 'Producto B', sales: 8 },
      { date: '2025-01-10', product: 'Producto C', sales: 5 },
      { date: '2025-01-30', product: 'Producto A', sales: 10 },
      { date: '2025-01-03', product: 'Producto B', sales: 8 },
    ];
    return of(lowSelling);
  }
}

