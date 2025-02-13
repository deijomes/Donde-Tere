import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ventas-totales',
  templateUrl: './ventas-totales.component.html',
  styleUrls: ['./ventas-totales.component.css'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgChartsModule,FormsModule,MatDatepickerModule,MatInputModule,MatFormFieldModule]
})
export class VentasTotalesComponent implements OnInit {

  ventamesActual: number = 0;
  totalventas: number = 0;

  productosMasVendidos: any[] = [];
  productosMas: string[] = []

  productosMenosVendidos :any []=[]

  fecha: Date | null = null;

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
    
  }


  getventasActuales() {
    this.servicio.getVentasActual().subscribe((data: any) => { this.ventamesActual = data; console.log(this.ventamesActual) })
  }

  gettotalActual() {

    this.servicio.gettotalActual().subscribe((data: any) => { this.totalventas = data })

  }
  
  
  

}
