import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  private Url = `${environment.API_URL}/api/dashboard/top-selling-products`
  private urlsold = `${environment.API_URL}/api/dashboard/less-sold`
  private Urltotal = `${environment.API_URL}/api/dashboard/total-sales`
  private urlPurchases = `${environment.API_URL}/api/dashboard/total-purchases`
  private urlreporte = `${environment.API_URL}/api/reports/excel`


  getProductSelling(limit: number, startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());


    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (endDate) {
      params = params.set('endDate', endDate);
    }

    const fullUrls = `${this.Url}?${params.toString()}`;
    console.log(" URL generada:", fullUrls);

    return this.http.get(fullUrls);
  }

  getProductsold(limit: number, startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());

    if (startDate) {
      params = params.set('startDate', startDate); // Ya viene en formato correcto
    }
    if (endDate) {
      params = params.set('endDate', endDate); // Ya viene en formato correcto
    }

    const fullUrl = `${this.urlsold}?${params.toString()}`;
    console.log(" URL generada:", fullUrl);

    return this.http.get(fullUrl);

  }


  getTotalSales(startDate?: string, endDate?: string): Observable<any> {
    const today = new Date();

    // Definir fecha de inicio y fin del día en UTC
    const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59, 999)).toISOString();

    let params = new HttpParams()
      .set('startDate', startDate || startOfDay) // Si no hay fecha, usa la de hoy
      .set('endDate', endDate || endOfDay); // Si no hay fecha, usa la de hoy

    console.log("URL generada:", `${this.Url}?${params.toString()}`);

    return this.http.get(this.Urltotal, { params });
  }




  getTotalSalesMes(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    const url = `${this.Urltotal}?${params.toString()}`;


    return this.http.get(url);
  }

  getTotalPurchasesMes(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    const url = `${this.urlPurchases}?${params.toString()}`;


    return this.http.get(url);
  }
  getReporte(startDate?: string, endDate?: string): Observable<Blob> {
    let params = new HttpParams();
  
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    
    if (endDate) {
      params = params.set('endDate', endDate);
    }
  
    const fullUrls = `${this.urlreporte}?${params.toString()}`;
    console.log("URL generada:", fullUrls);
  
    return this.http.get(fullUrls, { responseType: 'blob' }); 
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

