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
import { forkJoin } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

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
  parrafo : any = 'Hoy';
  hoy : any = 'Hoy'
  Fecha : Date |null =null
  Fecha2 :Date |null =null
  TotalVentas : number = 0
  TotalCompras : number = 0
  filter = false
  filtert = false

  fechaHoy : any = 'hoy';
   fechaHoy2 : any = 'hoy';
   mostrarfecha = false;
   mostarMensaje =true

   spinner = false
   icono = true

   spinner2 = false
   icono2 = true



   fechaHoy3 : any = 'hoy';
   fechaHoy4 : any = 'hoy';
   mostrarfecha2 = false;
   mostarMensaje2 =true



  
  ventasPorMes: { nombreMes: string, anio: number, totalVentas: any }[] = [];



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


  ventasTotals: any[] = []; 
  barChartLabels: string[] = [];  
  barChartData: ChartData<'bar'> = {  
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

  constructor(private servicio: DashboardService, private loading : LoadingService) { }

  ngOnInit(): void {
   


    this.loading.init();
   

    this.getventasActuales();
    this.gettotalActual();
    this.topMasVendidos()
    this.topMenosVendidos();
    this. getVentas$();
    this. getcompras$()
    this.getVentasPorMes()
   
    
   
   


  }


  getventasActuales() {
    this.servicio.getVentasActual().subscribe((data: any) => { this.ventamesActual = data })
  }

  gettotalActual() {

    this.servicio.gettotalActual().subscribe((data: any) => { this.totalventas = data })

  }


  topMasVendidos() {
    const limit = 10;

    // Convertir fechaInicial a formato ISO (UTC)
    const startDat = this.fechaInicial
      ? new Date(this.fechaInicial).setUTCHours(0, 0, 0, 0)
      : undefined;
      

      const startDate = startDat ? new Date(startDat).toISOString() : undefined;
      
      const fechaFormateada = startDate?.split("T")[0]; 
      this.fechaHoy = fechaFormateada
      

    // Convertir fechaFinal a formato ISO (UTC) con la hora máxima del día
    let endDate;
    if (this.fechaFinal) {
      const fechaFin = new Date(this.fechaFinal);
      fechaFin.setUTCHours(23, 59, 59, 999); // Establece la hora en UTC
      endDate = fechaFin.toISOString();
    }

    const fechaF= endDate?.split("T")[0]; 
    this.fechaHoy2 = fechaF
    

    

    this.servicio.getProductSelling(limit, startDate, endDate).subscribe((data: any) => {
      
      this.spinner2 = false
      this.icono2 = true
 
      this.MasVendidos = data;

      this.filterCalendar = false
    });
  }

  mostrarfech(){
    this.spinner2 = true
    this.icono2 = false
 
    this.mostarMensaje = false
    this.mostrarfecha = true
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
    const startDat = this.fechaInicialSold
      ? new Date(this.fechaInicialSold).setUTCHours(0, 0, 0, 0)
      : undefined;

      const startDate = startDat ? new Date(startDat).toISOString() : undefined;
      const fechamodificada = startDate?.split('T')[0];
      this.fechaHoy3 = fechamodificada

    // Convertir fechaFinal a formato ISO (UTC) con la hora máxima del día
    let endDate;
    if (this.fechaFinalSold) {
      const fechaFin = new Date(this.fechaFinalSold);
      fechaFin.setUTCHours(23, 59, 59, 999); // Establece la hora en UTC
      endDate = fechaFin.toISOString();
    }

   

    const fechamodific = endDate?.split('T')[0];
      this.fechaHoy4 = fechamodific

   

    this.servicio.getProductsold(limit, startDate, endDate).subscribe((data: any) => {
      this.spinner = false
      this.icono = true
      this.MenosVendidos = data;


      this.filterCalend = false


    });
  }

  mostrarfechas(){
    this.spinner = true
    this.icono = false
    this.mostarMensaje2 = false
    this.mostrarfecha2 = true
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
      const fechaInicio =  new Date(this.Fecha);
      fechaInicio.setUTCHours(0, 0, 0, 0)
      startDate = fechaInicio.toISOString()
      
  
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
  
    
  
    // Llamamos al servicio con las fechas correspondientes
    this.servicio.getTotalSales(startDate, endDate).subscribe((data: any) => {
     
      this.TotalVentas = data;
      
    });
  }

  getcompras$() {
    let startDate: string;
    let endDate: string;
    

    let fecha: Date;

    if (this.Fecha2 !== null && !isNaN(new Date(this.Fecha2).getTime())) {
        // Si hay una fecha válida seleccionada, la usamos
        fecha = new Date(this.Fecha2);
        this.hoy = this.Fecha2.toISOString().split("T")[0];; // Guardamos la fecha seleccionada
    } else {
        // Si NO hay fecha seleccionada (null o inválida), usamos la fecha actual
        fecha = new Date();
        
    }

    // Establecer inicio del día (00:00:00.000)
    const fechaInicio = new Date(fecha);
    fechaInicio.setUTCHours(0, 0, 0, 0);
    startDate = fechaInicio.toISOString();

    // Establecer fin del día (23:59:59.999)
    const fechaFin = new Date(fecha);
    fechaFin.setUTCHours(23, 59, 59, 999);
    endDate = fechaFin.toISOString();

    // Llamamos al servicio con las fechas correspondientes
    this.servicio.getTotalPurchasesMes(startDate, endDate).subscribe((data: any) => {
        
        this.TotalCompras = data;
    });
}


  mostrafilter(){
    this.filter  = true
  }
  mostrafiltro()
{
  this.filtert  = true
}

  getVentasPorMes() {

    this.loading.show()
    const hoy = new Date();
    const nombresMeses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    const meses: { nombreMes: string, anio: number, inicioMes: Date, finMes: Date }[] = [];

    // Generamos las fechas para el mes actual y los 3 meses anteriores
    for (let i = 0; i < 4; i++) {
      const inicioMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - i, 1, 0, 0, 0, 0)); // 🕔 Inicio 05:00 UTC
      const finMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - i + 1, 0, 23, 59, 59, 999)); // 🕓 Fin 04:59 UTC

      meses.push({
        nombreMes: nombresMeses[inicioMes.getUTCMonth()], // Obtener nombre del mes
        anio: inicioMes.getUTCFullYear(),
        inicioMes,
        finMes
      });
    }

    

    // Hacemos las 4 peticiones en paralelo y esperamos la respuesta
    forkJoin(
      meses.map(({ inicioMes, finMes }) =>
        this.servicio.getTotalSalesMes(inicioMes.toISOString(), finMes.toISOString())
      )
    ).subscribe((resultados) => {
      // Relacionamos los datos con el mes correspondiente
      this.ventasPorMes = meses.map((mes, index) => ({
        nombreMes: mes.nombreMes,
        anio: mes.anio,
        totalVentas: resultados[index] // Puede ser número o estructura según la API
      }));

      

      this.barChartLabels = this.ventasPorMes.map((item) => item.nombreMes);  // Asignar meses a las etiquetas
      this.barChartData.labels = this.barChartLabels;  // Asignar las etiquetas al gráfico
      this.barChartData.datasets[0].data = this.ventasPorMes.map((item) => item.totalVentas); 
      this.loading.hide() // Asignar ventas a la data
    });
  }
}
  


  







