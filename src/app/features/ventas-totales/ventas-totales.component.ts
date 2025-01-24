import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-ventas-totales',
  standalone: true,
  imports: [],
  templateUrl: './ventas-totales.component.html',
  styleUrl: './ventas-totales.component.css'
})
export class VentasTotalesComponent  implements OnInit {


  ventasTotals: any []=[]


  constructor(private serivicio: DashboardService){}


  ngOnInit(): void {
    // Obtener ventas mensuales
    this.serivicio.getMonthlySales().subscribe((data) => {
      this.ventasTotals = data;
      console.log(this.ventasTotals)
    });
  }

}
