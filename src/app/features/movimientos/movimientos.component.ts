import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BuscadorService } from '../../services/buscador.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { registroModel } from '../../models/registroModel';
import { PoductService } from '../../services/poduct.service';
import { error } from 'jquery';

import { NgxPaginationModule } from 'ngx-pagination'
import { Subscription } from 'rxjs';





@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule, NgxPaginationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MovimientosComponent implements OnInit {

  selectedItem: string = 'Entradas';




  listMovimientos: any[] = []
  currentPage: number = 1;  // Página actual (comienza en 1)
  itemsPerPage: number = 10;  // Elementos por página (puedes cambiar este valor)
  totalItems: number = 0;  // Total de productos que vamos a paginar

  filteredProductos: any[] = [];
  searchTermSubscription : any
  mensajeNoEncontrado: string = ''



  searchTerm: string = '';



  entradaForm!: FormGroup
  salidadForm!: FormGroup



  constructor(private serviceproduct: BuscadorService, private http: PoductService, private bf: FormBuilder,
    
  ) { 

  }

  ngOnInit(): void {

    this.getmovimientos()

    this.selectItem(this.selectedItem);
    this.suscripciontermino()

  }

  ngOnDestroy(): void {
    if (this.searchTermSubscription) {
      this.searchTermSubscription.unsubscribe();
    }
  }
  

  selectItem(item: string): void {
    this.selectedItem = item;
  }










  getmovimientos() {
    this.http.getmovimientos().subscribe({
      next: (response) => {

        this.listMovimientos = response.data
        console.log('listamovimientos', this.listMovimientos)
      }
    })
  }

  limpiarMovimiento(id: any) {
    this.http.eliminarMovimiento(id).subscribe({
      next: (response: any) => {
        console.log("Producto eliminado con éxito:", response);
      },
      error: (error: any) => {
        console.error("Error al eliminar producto:", error);
      }
    });
  }

  suscripciontermino(): void {
    this.searchTermSubscription = this.serviceproduct.terminoBusqueda$.subscribe(term => {
      console.log('Término de búsqueda recibido:', term);  // Verifica el valor que llega
      this.searchTerm = term;
      this.filterProductos(); // Filtra los productos cada vez que cambia el término
    });
  }
  
  filterProductos(): void {
    if (this.searchTerm) {
      this.filteredProductos = this.listMovimientos.filter(product =>
        // Verifica que product.product.name exista y que sea una cadena
        product.product?.name && product.product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProductos = this.listMovimientos; // Si no hay término de búsqueda, muestra todos los productos
    }
  
    console.log('Productos filtrados:', this.filteredProductos);
  }
  
  





}