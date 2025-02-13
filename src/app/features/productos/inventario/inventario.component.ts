import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';



import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { registerModel } from '../../../models/registerModel';
import { PoductService } from '../../../services/poduct.service';
import { NgxPaginationModule } from 'ngx-pagination';
import Swal from 'sweetalert2';
import { bootstrapAppScopedEarlyEventContract } from '@angular/core/primitives/event-dispatch';
import { BuscadorService } from '../../../services/buscador.service';
import { filter, map, switchMap } from 'rxjs';

declare var bootstrap: any;
@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgxPaginationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {

  productos: registerModel[] = [];

  mostrarTabla: boolean = true
  registrosCargados: boolean = false;

  cantidad: number = 0;
  idProducto: string = ''

  searchTermSubscription: any
  searchTerm: string = ''
  limit: number = 20
  offset:number = 0
  products : any  
  mostrarAlerta : boolean = false;
  alertMessage :  string = '';
  isFiltered : boolean =  false
  alertShown : boolean =  false



  currentPage: number = 1;  // Página actual (comienza en 1)
  itemsPerPage: number = 5;  // Elementos por página (puedes cambiar este valor)
  totalItems: number = 0;  // Total de productos que vamos a paginar


  constructor(private router: Router, private http: PoductService, private serviceproduct: BuscadorService) {




  }

  ngOnInit(): void {




    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Si no estamos en las rutas de "registrar" o "actualizar/:id"
        if (event.url !== '/productos/registrar' && !event.url.startsWith('/productos/actualizar/')) {
          // Si la tabla aún no ha sido cargada, la cargamos
          if (!this.registrosCargados) {
            this.registros();
          }
          this.mostrarTabla = true;  // Mostrar la tabla
        } else {
          this.mostrarTabla = false;  // Ocultar la tabla si estamos en "registrar" o "actualizar"
        }
      }
    });

    // Inicialmente revisamos si la tabla debe ser mostrada
    const currentUrl = this.router.url;
    if (currentUrl !== '/productos/registrar' && !currentUrl.startsWith('/productos/actualizar/')) {
      this.registros();  // Cargar los registros si no estamos en "registrar" ni "actualizar"
      this.mostrarTabla = true;  // Mostrar la tabla
    } else {
      this.mostrarTabla = false;  // Ocultar la tabla si estamos en "registrar" o "actualizar"
    }

   this.suscripciontermino()
  }

  // Método para cargar los registros
  registros(): void {

    this.http.obtenerRegistros().subscribe({
      next: (response) => {
        this.productos = response.data;  // Asignamos los registros obtenidos
        this.registrosCargados = true;  // Marcamos que los registros ya fueron cargados
        this.totalItems = response.length;
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }




  registro() {
    this.router.navigateByUrl('productos/registrar');
    this.mostrarTabla = false

  }



  stock(id: string) {

    this.idProducto = id
  }

  guardarStock() {
    const cantidad = Number((document.getElementById('cantidad') as HTMLInputElement).value);

    if (cantidad <= 0 || isNaN(cantidad)) {
      Swal.fire('Error', 'Por favor ingrese una cantidad válida', 'error');
      return;
    }

    this.agregarstock(this.idProducto, cantidad);
  }


  agregarstock(id: string, nuevaCantidad: number) {

    Swal.fire({
      title: '¿Está seguro de que desea actualizar Stock?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ffa500',

    }).then((result) => {

      if (result.isConfirmed) {

        this.http.agregarstock(id, nuevaCantidad).subscribe({
          next: (response) => {
            Swal.fire('¡Stock agregado!', '', 'success');
            this.registros();
          },
          error: (err) => {
            Swal.fire('Error', 'Hubo un problema al actualizar la cantidad', 'error');
          }
        });
      } else {

        Swal.fire('Cancelado', 'La actualización no se ha realizado', 'info');
      }
    });
  }







  edicion(id: string) {

    console.log(id)

    this.router.navigateByUrl(`/productos/actualizar/${id}`)



  }

  eliminar(id: string): void {

    console.log(id)


    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: '#ffa500',
      cancelButtonColor: "##dc3545",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.eliminarProducto(id).subscribe({
          next: (response) => {
            console.log("Producto eliminado con éxito:", response);
            Swal.fire({
              title: '¡Éxito!',
              text: 'El producto ha sido eliminado.',
              icon: 'success',
              timer: 1000,
              showConfirmButton: false
            });

            this.registros();
          },
          error: (error) => {
            console.error("Error al eliminar producto:", error);
            Swal.fire("Error", "No se pudo eliminar el producto.", "error");
          }
        });
      }
    });
  }


  recargarTabla() {
    this.registros();
  }

  suscripciontermino(): void {
    this.searchTermSubscription = this.serviceproduct.terminosBusqueda$.pipe(
      // Filtra términos vacíos
      filter(terminos => (terminos['productos'] || '').trim() !== ''),
      
      // Extrae solo el término de 'productos'
      map(terminos => terminos['productos']),
  
      // Cancela la petición anterior si el término cambia
      switchMap(term => {
        console.log('Término de búsqueda recibido:', term);
        this.searchTerm = term; // Asigna el término de búsqueda
  
        this.isFiltered = !!this.searchTerm.trim();
  
        if (!this.isFiltered) {
          this.products = [...this.productos];
          this.alertShown = true;
          return [];
        }
  
        // Llama al servicio para obtener los productos
        return this.http.getProducts(this.limit, this.offset, this.searchTerm);
      })
    ).subscribe(
      (response: any) => { 
        this.alertShown = false;
        this.products = response.data || []; // Asumiendo que la respuesta tiene una propiedad "data"
        console.log('Productos recibidos:', this.products);
  
        // Solo muestra la alerta si no hay productos
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
  
  

  // Método para cancelar la suscripción al destruir el componente
  ngOnDestroy(): void {
    this.serviceproduct.limpiarBusqueda('productos'); // Limpia el término cuando el componente se destruye
    this.searchTermSubscription.unsubscribe(); // Evita fugas de memoria
  }
  
 
}






