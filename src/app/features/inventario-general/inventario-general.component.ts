import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { BuscadorService } from '../../services/buscador.service';
import { registroModel } from '../../models/registroModel';

@Component({
  selector: 'app-inventario-general',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './inventario-general.component.html',
  styleUrl: './inventario-general.component.css'
})
export class InventarioGeneralComponent implements OnInit {


  productos:registroModel []= []; 
  productosFiltrados: registroModel[] = [];
  BusquedaActiva: boolean = false; 
  
  
  constructor( private servicio : BuscadorService){

    
    
  }
  ngOnInit(): void {
  
      this.productos = this.servicio.getProductos();
      this.productosFiltrados = this.productos;
    
      this.servicio.terminoBusqueda$.subscribe((termino) => {
        console.log('Término recibido:', termino); 
        if (termino) {
          this.BusquedaActiva = true;
          this.productosFiltrados = this.servicio.buscarProductos(termino);
          console.log('Productos filtrados:', this.productosFiltrados); 
        } else {
          this.BusquedaActiva = false;
          this.productosFiltrados = this.productos;
        }
      });
    }
   
    
  }




