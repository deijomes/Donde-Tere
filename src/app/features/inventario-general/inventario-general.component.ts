import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { BuscadorService } from '../../services/buscador.service';
import { registroModel } from '../../models/registroModel';
import { PdfService } from '../../services/pdf.service';
import { LoadingService } from '../../services/loading.service';
import { PoductService } from '../../services/poduct.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-inventario-general',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './inventario-general.component.html',
  styleUrl: './inventario-general.component.css'
})
export class InventarioGeneralComponent implements OnInit {


  productos:any []= []; 
  productosFiltrados: registroModel[] = [];
  BusquedaActiva: boolean = false; 

  currentPage: number = 1;  // Página actual (comienza en 1)
  itemsPerPage: number = 20;  // Elementos por página (puedes cambiar este valor)
  totalItems: number = 0;  // Total de productos que vamos a paginar
  modalInstance: any;

  
  
  constructor( private servicio : BuscadorService, private pdf: PdfService, private loading:LoadingService,
    private http: PoductService
  ){

    
    
  }
  ngOnInit(): void {

    this.loading.init();
    this.registros()
    
  
  }

  registros(): void {
    
  
    this.loading.show()
    this.http.obtenerRegistros().subscribe({
      next: (response) => {
        this.productos = response.data;  
       
        
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
        this.loading.hide()
      },
      complete: () => {
        this.loading.hide()
       
      }
    });
  }
  

    
   
    
  }




