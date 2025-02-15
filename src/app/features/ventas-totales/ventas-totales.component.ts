import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { data } from 'jquery';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ventas-totales',
  templateUrl: './ventas-totales.component.html',
  styleUrls: ['./ventas-totales.component.css'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgChartsModule, FormsModule, MatDatepickerModule, MatInputModule, MatFormFieldModule, DatePicker, CommonModule],
  encapsulation: ViewEncapsulation.None

})
export class VentasTotalesComponent implements OnInit {

  ventamesActual: number = 0;
  totalventas: number = 0;
  parrafo : any = 'Hoy'
  Fecha : Date |null =null
  TotalVentas : number = 0
  filter = false


  productosMasVendidos: any[] = [];
  productosMas: string[] = []

  productosMenosVendidos: any[] = []

  fechaInicial: Date | null = null;
  fechaFinal: Date | null = null;
  MasVendidos: any[] = []
  filterCalendar = false

  fechaInicialSold: Date | null = null;
  fechaFinalSold: Date | null = null;
  MenosVendidos: any
  filterCalend = false


  ventasTotals: any[] = [];  // Almacenará los datos de ventas
  barChartLabels: string[] = [];  // Etiquetas para el gráfico (meses)
  barChartData: ChartData<'bar'> = {  // Cambiamos el tipo a ChartData<'bar'>
    labels: [],
    datasets: [{
      data: [],
      label: 'Ventas Totales',
      backgroundColor: ' #FF6C2F',
      hoverBackgroundColor: 'rgba(255, 108, 47, 0.8)',
      barThickness: 50,
      borderRadius: 5,
    }]
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      },
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };
  barChartType: 'bar' = 'bar';  // Especificamos que el tipo de gráfico es 'bar'




  Dashboardprt: 'line' = 'line'

  constructor(private servicio: DashboardService) { }

  ngOnInit(): void {
    // Obtener ventas mensuales
    this.servicio.getMonthlySales().subscribe((data) => {
      this.ventasTotals = data;
      console.log(this.ventasTotals);

      // Extraer los meses y las ventas
      this.barChartLabels = this.ventasTotals.map((item) => item.month);  // Asignar meses a las etiquetas
      this.barChartData.labels = this.barChartLabels;  // Asignar las etiquetas al gráfico
      this.barChartData.datasets[0].data = this.ventasTotals.map((item) => item.sales);  // Asignar ventas a la data
    });


  

    this.getventasActuales();
    this.gettotalActual();
    this.topMasVendidos()
    this.topMenosVendidos();
    this. getVentas$()
   
   


  }


  getventasActuales() {
    this.servicio.getVentasActual().subscribe((data: any) => { this.ventamesActual = data; console.log(this.ventamesActual) })
  }

  gettotalActual() {

    this.servicio.gettotalActual().subscribe((data: any) => { this.totalventas = data })

  }
  topMasVendidos() {
    const limit = 10;

    // Convertir fechaInicial a formato ISO (UTC)
    const startDate = this.fechaInicial
      ? new Date(this.fechaInicial).toISOString()
      : undefined;

    // Convertir fechaFinal a formato ISO (UTC) con la hora máxima del día
    let endDate;
    if (this.fechaFinal) {
      const fechaFin = new Date(this.fechaFinal);
      fechaFin.setUTCHours(23, 59, 59, 999); // Establece la hora en UTC
      endDate = fechaFin.toISOString();
    }

    console.log("Fecha inicial en formato ISO:", startDate);
    console.log("Fecha final en formato ISO:", endDate);

    this.servicio.getProductSelling(limit, startDate, endDate).subscribe((data: any) => {
      console.log(data, " productos filtrados de top vendidos");
      this.MasVendidos = data;

      this.filterCalendar = false
    });
  }

  mostrarfiltro() {
    this.filterCalendar = true
    setTimeout(() => {

      const destino = document.getElementById('Destino1');
      if (destino) {

        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  topMenosVendidos() {
    const limit = 10;

    // Convertir fechaInicial a formato ISO (UTC)
    const startDate = this.fechaInicialSold
      ? new Date(this.fechaInicialSold).toISOString()
      : undefined;

    // Convertir fechaFinal a formato ISO (UTC) con la hora máxima del día
    let endDate;
    if (this.fechaFinalSold) {
      const fechaFin = new Date(this.fechaFinalSold);
      fechaFin.setUTCHours(23, 59, 59, 999); // Establece la hora en UTC
      endDate = fechaFin.toISOString();
    }

    console.log("Fecha inicial en formato ISO:", startDate);
    console.log("Fecha final en formato ISO:", endDate);

    this.servicio.getProductsold(limit, startDate, endDate).subscribe((data: any) => {
      console.log(data, " productos filtrados de top vendidos");
      this.MenosVendidos = data;


      this.filterCalend = false


    });
  }

  mostrarfilter() {
    this.filterCalend = true;
    setTimeout(() => {

      const destino = document.getElementById('tablaDestino');
      if (destino) {

        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  getVentas$() {
    let startDate: string;
    let endDate: string;
  
    if (this.Fecha) {
      // Si hay una fecha seleccionada, la usamos
      startDate = new Date(this.Fecha).toISOString();
  
      const fechaFin = new Date(this.Fecha);
      fechaFin.setUTCHours(23, 59, 59, 999);
      endDate = fechaFin.toISOString();
      const soloFecha = endDate.split("T")[0]; // "YYYY-MM-DD"
      this.parrafo = soloFecha;
      
    } else {
      // Si NO hay fecha seleccionada, usamos la fecha actual
      const today = new Date();
      startDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0)).toISOString();
      endDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59, 999)).toISOString();
    }
  
    console.log("Fecha inicio:", startDate);
    console.log("Fecha fin:", endDate);
  
    // Llamamos al servicio con las fechas correspondientes
    this.servicio.getTotalSales(startDate, endDate).subscribe((data: any) => {
      console.log(data, "total ventas");
      this.TotalVentas = data;
      
    });
  }

  mostrafilter(){
    this.filter  = true
  }
  






}
