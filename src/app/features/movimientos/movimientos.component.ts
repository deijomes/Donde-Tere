import { CommonModule } from '@angular/common';
import {  Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import { BuscadorService } from '../../services/buscador.service';
import { NgSelectModule } from '@ng-select/ng-select';

import { Observable } from 'rxjs';




@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [ ReactiveFormsModule ,CommonModule, NgSelectModule, ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'], // Cambié a "styleUrls" (plural) porque estaba incorrecto
})
export class MovimientosComponent implements OnInit {

 listaproducto: any[]=[]
 filteredProductos: any[] = [];
 searchTerm: string = '';
 isLoading: boolean = false; 





 
 
  constructor( private serviceproduct: BuscadorService){

    
  }

  


  ngOnInit(): void {
    // Obtiene la lista de productos desde el servicio
    this.isLoading = true;
    this.listaproducto = this.serviceproduct.getProductos();
    console.log('listado', this.listaproducto);

    // Inicializa la lista filtrada con todos los productos
    this.filteredProductos = this.listaproducto;
    this.isLoading = false;


   
  }

  // Filtra los productos según el término de búsqueda
  filterProductos(): void {
    this.filteredProductos = this.listaproducto.filter(codigo =>
      codigo.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Función que se ejecuta cuando se selecciona un producto
  onProductChange(event: any): void {
    console.log('Producto seleccionado:', event);
  }

 

  

  
}