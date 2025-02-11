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
import { debounceTime, switchMap } from 'rxjs/operators';





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
  alertShown : boolean = false



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
      switchMap(term => {
        console.log('Término de búsqueda recibido:', term);  // Verifica el valor que llega
        this.searchTerm = term;
        this.manejarEntrada(this.searchTerm);  // Maneja la entrada del término
  
        // Verifica si el término no está vacío antes de aplicar el filtro
        this.isFiltered = !!this.searchTerm.trim();  // Activar la bandera de filtro
  
        // Si el término está vacío, no hace falta obtener datos
        if (!this.isFiltered) {
          this.filteredMovimientos = [...this.listMovimientos];  // Mostrar los movimientos originales
          this.alertShown = false;  // Restablecer la bandera de alerta
          return [];
        }
  
        return this.http.getDatos(this.limit, this.offset, this.productName, this.endDate, this.startDate);
      })
    ).subscribe(response => {
      if (this.isFiltered && (!response?.data || response.data.length === 0)) {
        if (!this.alertShown) {  // Solo mostramos la alerta si aún no se ha mostrado
          console.log('No se encontraron datos con ese término de búsqueda');
          this.showAlert('No se encontraron resultados para los filtros aplicados.');
          this.alertShown = true;  // Establecer la bandera de alerta como mostrada
        }
  
        // Restaurar la lista original si no hay resultados
        this.filteredMovimientos = [...this.listMovimientos];  // Restauramos la lista original
      } else {
        // Si hay datos, mostramos los movimientos filtrados
        this.filteredMovimientos = response?.data || [];
        this.alertShown = false;  // Restablecer la bandera de alerta si hay resultados
      }
      console.log(this.filteredMovimientos, 'datos filtrados');
    });
  }
  
  showAlert(message: string) {
    alert(message);  // Usamos `alert()` aquí, pero puedes usar un componente de alerta si prefieres
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
