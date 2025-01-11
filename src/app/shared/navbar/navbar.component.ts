import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  configSize: string = 'sm-hover';
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
}
