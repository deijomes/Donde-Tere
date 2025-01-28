import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';


import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { registerModel } from '../../../models/registerModel';
import { PoductService } from '../../../services/poduct.service';


@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule,  RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit{

  productos: registerModel[] = [];
  
  mostrarTabla : boolean = true
  registrosCargados: boolean = false; 

  constructor( private router: Router, private http: PoductService) {

  

   
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
  }

  // Método para cargar los registros
  registros(): void {
    this.http.obtenerRegistros().subscribe({
      next: (response) => {
        this.productos = response;  // Asignamos los registros obtenidos
        this.registrosCargados = true;  // Marcamos que los registros ya fueron cargados
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

  edicion(id: string){

    console.log(id)
    
    this.router.navigateByUrl(`/productos/actualizar/${id}`)
    
    

  }

  recargarTabla() {
    this.registros();  
  }
  
}

  

  


