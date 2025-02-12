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
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';





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
  alertShown: boolean = false
  alertMessage: string = ''
  mostrarAlerta: boolean = false



  searchTerm: string = '';
  limit = 60;
  offset = 0;
  productName?: string;
  endDate?: string;
  startDate?: string;
  isFiltered: boolean = false
  filterTimeout: any;



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
   

    this.serviceproduct.limpiarBusqueda('movimientos'); // Limpia la búsqueda al salir del componente
    this.searchTermSubscription.unsubscribe(); // Evita fugas de memoria
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
    this.searchTermSubscription = this.serviceproduct.terminosBusqueda$.pipe(
      filter(terminos => (terminos['movimientos'] || '').trim() !== ''), // Filtra términos vacíos antes de hacer cualquier acción

      map(terminos => terminos['movimientos']),


      switchMap(term => {
        console.log('Término de búsqueda recibido:', term);
        this.searchTerm = term; // Asigna el término de búsqueda

        // Llama al servicio para obtener los productos
        this.manejarEntrada(this.searchTerm)

        this.isFiltered = !!this.searchTerm.trim();

        if (!this.isFiltered) {
          this.filteredMovimientos = [...this.listMovimientos];
          this.alertShown = false;
          return [];
        }

        return this.http.getDatos(this.limit, this.offset, this.productName, this.endDate, this.startDate);
      })




    ).subscribe(response => {
      if (this.isFiltered && (!response?.data || response.data.length === 0)) {
        if (!this.alertShown) {
          console.log('No se encontraron datos con ese término de búsqueda');
          this.showAlert('No se encontraron resultados para los filtros aplicados.');
          this.alertShown = true;
        }
        this.filteredMovimientos = [...this.listMovimientos];
      } else {
        this.filteredMovimientos = response?.data || [];
        this.alertShown = false;
      }
      console.log(this.filteredMovimientos, 'datos filtrados');

      // **Limpia el término sin volver a emitir en la suscripción**
      this.searchTerm = '';
    });
  }

  showAlert(message: string) {
    this.alertMessage = message;
    this.mostrarAlerta = true;

    setTimeout(() => {
      this.cerrarAlerta();
    }, 3000); // La alerta desaparece desp

  }

  cerrarAlerta() {
    this.mostrarAlerta = false;
  }



  manejarEntrada(input: string) {
    const resultado = this.http.convertToDateString(input);

    if (resultado.isDate) {
      console.log('Es una fecha');
      this.startDate = resultado.startDate;
      this.endDate = resultado.endDate;
      this.productName = '';
    } else {
      console.log('Es un nombre:', resultado.name);
      this.productName = resultado.name;
      this.startDate = '';
      this.endDate = '';
    }
  }








}
