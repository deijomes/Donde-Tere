import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { BuscadorService } from '../../services/buscador.service';
import { registroModel } from '../../models/registroModel';
import { PdfService } from '../../services/pdf.service';
import { LoadingService } from '../../services/loading.service';
import { PoductService } from '../../services/poduct.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { filter, map, switchMap } from 'rxjs';

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
  searchTermSubscription: any;
  searchTerm : string ='';
  products: any
  mostrarAlerta: boolean = false;
  alertMessage: string = '';
  isFiltered: boolean = false
  alertShown: boolean = false
  limit: number = 20
  offset: number = 0

  
  
  constructor( private servicio : BuscadorService, private pdf: PdfService, private loading:LoadingService,
    private http: PoductService, private serviceproduct: BuscadorService, 
  ){

    
    
  }
  ngOnInit(): void {

    this.loading.init();
    this.registros();
    this.suscripciontermino()
    
  
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

  suscripciontermino(): void {
      this.searchTermSubscription = this.serviceproduct.terminosBusqueda$.pipe(
        // Filtra términos vacíos
        filter(terminos => (terminos['inventario'] || '').trim() !== ''),
    
        // Extrae solo el término de 'productos'
        map(terminos => terminos['inventario'].trim()),
        
    
        // Cancela la petición anterior si el término cambia
        switchMap(term => {
          console.log('Término de búsqueda recibido:', term);
          this.searchTerm = term;
          this.isFiltered = !!this.searchTerm;
    
          if (!this.isFiltered) {
            this.products = [...this.productos];
            this.alertShown = true;
            return [];
          }
    
          
          let code = "";
          let nombre = "";
    
          if (/^[A-Za-z0-9-]+$/.test(term) && /\d/.test(term) && /[A-Za-z]/.test(term)) {
            code = term;  
          } else {
            nombre = term; 
          }
    
          console.log("Código detectado:", code);
          console.log("Nombre detectado:", nombre);
    
          return this.http.getProducts(this.limit, this.offset, code, nombre);
        })
      ).subscribe(
        (response: any) => {
          this.alertShown = false;
          this.products = response.data || [];
          console.log('Productos recibidos:', this.products);
    
          // Muestra la alerta si no hay productos
          if (!this.products.length) {
            this.showAlert('No se encontraron resultados para los filtros aplicados.');
            this.alertShown = true;
          }
        },
        (error) => {
          console.error('Error al obtener productos:', error);
        }
      );
    }
  
    
  showAlert(message: string) {
    this.alertMessage = message;
    this.mostrarAlerta = true;

    setTimeout(() => {
      this.cerrarAlerta();
    }, 3000); // La alerta desaparece después de 3 segundos
  }

  cerrarAlerta() {
    this.mostrarAlerta = false;
  }

    
   
    
  }




