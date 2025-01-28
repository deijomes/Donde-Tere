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

  constructor( private router: Router, private http: PoductService) {

    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Verifica si no estás en la ruta de registro
        this.mostrarTabla = event.url !== '/productos/registrar' ;
        this.mostrarTabla = !(event.url.startsWith('/productos/registrar') || event.url.startsWith('/productos/actualizar/'));
      }
      if (this.mostrarTabla) {
        this.registros();
      }
    });

   
  }

  ngOnInit(): void {
    this.registros();

    const currentUrl = this.router.url;
    this.mostrarTabla = !(currentUrl.startsWith('/productos/registrar') || currentUrl.startsWith('/productos/actualizar/'));

    // cambia la condicion de la tabla por la escucha en la ruta 

  }


  registros(){
    this.http.obtenerRegistros().subscribe({
      next: (response) => {
        console.log('Productos obtenidos:', response);
        this.productos = response; 
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

  
}

  

  


