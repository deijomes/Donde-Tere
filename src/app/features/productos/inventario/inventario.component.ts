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

   
  }

  ngOnInit(): void {
    this.registros();

    // cambia la condicion de la tabla por la escucha en la ruta 

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Verifica si no estás en la ruta de registro
        this.mostrarTabla = event.url !== '/productos/registrar';
      }
      if (this.mostrarTabla) {
        this.registros();
      }
    });
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

  
}

  

  


