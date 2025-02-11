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
import { debounceTime } from 'rxjs/operators';





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

  filteredMovimientos: any[] = [];
  searchTermSubscription: any
  mensajeNoEncontrado: string = ''



  searchTerm: string = '';
  validReasons: string[] = ['COMPRA', 'sale', 'DEVOLUCIÓN', 'DAÑO', 'INVENTARIO'];



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
    this.searchTermSubscription = this.serviceproduct.terminoBusqueda$.pipe(
      debounceTime(500) // Espera 500ms después de que el usuario deje de escribir
    ).subscribe(term => {
      console.log('Término de búsqueda recibido:', term);  // Verifica el valor que llega
      this.searchTerm = term;
      this.obtenerMovimientos()
    
    });


    

   
  }

  esFecha(term: string): boolean {
    const fecha = new Date(term);
    return !isNaN(fecha.getTime()); // Verifica si es una fecha válida
  }

  // Método para validar si el motivo es uno de los valores permitidos
  esMotivoValido(term: string): boolean {
    return this.validReasons.includes(term.toUpperCase());
  }

  // Método para obtener los movimientos con base en el término de búsqueda
  obtenerMovimientos(): void {
    let startDate = '';
    let endDate = '';
    let reason = ''; // Asignar el motivo si es necesario
    let productId = ''; // Si tienes productId lo puedes asignar aquí

    // Verificar si el término es una fecha
    if (this.esFecha(this.searchTerm)) {
      startDate = new Date(new Date(this.searchTerm).setDate(new Date(this.searchTerm).getDate() - 1)).toISOString();
      endDate = new Date(this.searchTerm).toISOString();
    } 
    // Verificar si el término es un motivo válido
    else if (this.esMotivoValido(this.searchTerm)) {
      reason = this.searchTerm; // Si el término es válido, asignarlo a `reason`
    } 
    else {
      console.error('Término no válido:', this.searchTerm);
      return; // Si el término no es válido, no hacer la solicitud
    }

    // Asegurarse de que solo un tipo de parámetro se esté usando
    if ((startDate && endDate) && reason) {
      console.error('Error: Solo puedes proporcionar una de las siguientes opciones: una fecha o un motivo.');
      return; // Si ambos parámetros están presentes, mostrar error
    }

    // Llamar al servicio para obtener los movimientos
    this.http.getmovimientos(
      10, // Límite de resultados
      0, // Offset
      startDate, // startDate
      endDate, // endDate
      reason, // reason (nombre o término)
      productId // productId (si lo tienes)
    ).subscribe(movimientos => {
      console.log('Movimientos obtenidos:', movimientos); // Verifica los movimientos obtenidos
      this.filteredMovimientos = movimientos; // Asignar los movimientos a la lista filtrada
    });
  }




}
