import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output } from '@angular/core';
import { BuscadorService } from '../../services/buscador.service';
import { ProductoCompraService } from '../../services/producto-compra.service';
import { CommonModule } from '@angular/common';
import { TextoSpañolPipe } from '../../pipes/texto-spañol.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TextoSpañolPipe],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  configSize: string = 'sm-hover';
  notificacion: any []=[]

  constructor(private buscadorService:BuscadorService, private services:ProductoCompraService){


  }
  ngOnInit(): void {
   this.notificaciones()
  }
  



  onSearch(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.buscadorService.setTerminoBusqueda(inputValue); // Notifica al servicio
  }


  toggleMenuSize(): void {
    const htmlElement = document.documentElement; // Accede al elemento <html>
    const bodyElement = document.body; // Accede al elemento <body>
    const currentSize = htmlElement.getAttribute('data-menu-size'); // Obtiene el valor actual de data-menu-size
    
    // Detectamos si estamos en un dispositivo móvil (pantalla pequeña)
    const isMobile = window.innerWidth <= 768; // Puedes ajustar el valor si es necesario

    if (isMobile) {
      // Si es móvil, aplicamos las clases y estilos correspondientes
      htmlElement.classList.add('sidebar-enable');
      bodyElement.style.overflow = 'hidden'; // Deshabilitamos el scroll del body
    } else {
      // Si no es móvil, eliminamos las clases y estilos
      htmlElement.classList.remove('sidebar-enable');
      bodyElement.style.overflow = ''; // Restauramos el estilo overflow
    }

    // Lógica para alternar el valor de data-menu-size
    if (currentSize === 'sm-hover-active') {
      htmlElement.setAttribute('data-menu-size', 'sm-hover');
      this.configSize = 'sm-hover';
    } else {
      htmlElement.setAttribute('data-menu-size', 'sm-hover-active');
      this.configSize = 'sm-hover-active';
    }
  }

  notificaciones (){
    this.services.Notificaciones().subscribe({
      next: (Response)=>{

        this.notificacion = Response
        console.log(this.notificacion)

      }
    })
  }

  get notificationCount(): number {
    return this.notificacion.length;
  }
}
