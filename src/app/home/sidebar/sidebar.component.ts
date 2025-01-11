import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  activeMenu: string = ''; // Solo se aplica a opciones principales
  selectedSubMenu: string = ''; // Solo se aplica a subopciones
  configSize: string = 'sm-hover'; // Define el tamaño inicial del menú
  
  // Función para activar el menú principal
  setActiveMenu(menu: string): void {
    this.activeMenu = menu; // Actualiza el menú principal activo
  }

  // Función para activar las subopciones
  setSubMenu(menu: string, submenu: string): void {
    this.activeMenu = menu; // Esto asegura que el menú principal se active
    this.selectedSubMenu = submenu; // Actualiza la subopción seleccionada
   

    // Colapsar el submenú si el sidebar está en modo "recogido"
    if (this.configSize === 'sm-hover') {
      const sidebarInventory = document.getElementById('sidebarInventory');
      if (sidebarInventory && sidebarInventory.classList.contains('show')) {
        sidebarInventory.classList.remove('show'); // Colapsa el submenú
      }
    }

    if (this.configSize === 'sm-hover') {
      this.collapseSubmenus();
    }
  }

  toggleMenuSize(): void {
    const htmlElement = document.documentElement; // Accede al elemento <html>
    const currentSize = htmlElement.getAttribute('data-menu-size'); // Obtiene el valor actual de data-menu-size
    const bodyElement = document.body;

    // Verificar si estamos en un dispositivo móvil (pantalla pequeña)
    const isMobile = window.innerWidth <= 768; // Ajusta el valor según sea necesario

    if (isMobile) {

      // Verificamos si la clase 'sidebar-enable' está presente
      if (htmlElement.classList.contains('sidebar-enable')) {
        // Si la clase 'sidebar-enable' está activa, actualizamos el tamaño a 'hidden' y eliminamos la clase
        htmlElement.classList.remove('sidebar-enable');
        htmlElement.setAttribute('data-menu-size', 'hidden'); // Actualizamos el tamaño a 'hidden'
        this.configSize = 'hidden'; // Actualizamos la variable configSize
      } else {
        // Si la clase 'sidebar-enable' no está activa, alternamos entre 'sm-hover' y 'sm-hover-active'
        if (currentSize === 'sm-hover-active') {
          htmlElement.setAttribute('data-menu-size', 'sm-hover');
          this.configSize = 'sm-hover';  // Actualiza el valor de configSize
        } else {
          htmlElement.setAttribute('data-menu-size', 'sm-hover-active');
          this.configSize = 'sm-hover-active'; // Actualiza el valor de configSize
        }
      }


    } else {
      // Si no es móvil, alternamos entre 'sm-hover' y 'sm-hover-active'
      if (currentSize === 'sm-hover-active') {
        htmlElement.setAttribute('data-menu-size', 'sm-hover');
        this.configSize = 'sm-hover';  // Actualiza el valor de configSize
      } else {
        htmlElement.setAttribute('data-menu-size', 'sm-hover-active');
        this.configSize = 'sm-hover-active'; // Actualiza el valor de configSize
      }
    }

    if (this.configSize === 'sm-hover') {
      this.collapseSubmenus();
    }


  }

  private collapseSubmenus(): void {
    const submenus = document.querySelectorAll('.collapse.show'); // Selecciona todos los submenús abiertos
    submenus.forEach((submenu) => {
      submenu.classList.remove('show'); // Remueve la clase 'show' para colapsarlos
    });

    
  

  }
}
