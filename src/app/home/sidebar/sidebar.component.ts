import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  activeMenu: string = ''; // Solo se aplica a opciones principales
  selectedSubMenu: string = ''; // Solo se aplica a subopciones
  configSize: string = 'sm-hover'; // Define el tamaño inicial del menú

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handleRouteChange(event.urlAfterRedirects);
      }
    });
  }

  // Detecta cambios de ruta y actualiza el menú activo
  private handleRouteChange(url: string): void {
    if (url.includes('productos-registro')) {
      this.activeMenu = 'productos';
      this.selectedSubMenu = 'productos-registro';
    } else if (url.includes('productos-inventario')) {
      this.activeMenu = 'productos';
      this.selectedSubMenu = 'productos-inventario';
    } else {
      this.activeMenu = '';
      this.selectedSubMenu = '';
    }
  }

  setActiveMenu(menu: string): void {
    if (this.activeMenu !== menu) {
      this.activeMenu = menu;
    }
  }

  setSubMenu(menu: string, submenu: string): void {
    this.activeMenu = menu; // Esto asegura que el menú principal se active
    this.selectedSubMenu = submenu; // Actualiza la subopción seleccionada
    if (this.configSize === 'sm-hover') {
      this.collapseSubmenus();
    }
  }

  toggleActiveMenu(menu: string): void {
    if (this.activeMenu === menu && this.selectedSubMenu) {
      // Si el menú ya está activo y hay un submenú seleccionado, desactívalo
      this.activeMenu = '';
      this.selectedSubMenu = '';
    } else {
      // Activa el menú principal
      this.activeMenu = menu;
    }
  }

  toggleMenuSize(): void {
    const htmlElement = document.documentElement;
    const currentSize = htmlElement.getAttribute('data-menu-size');
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      if (htmlElement.classList.contains('sidebar-enable')) {
        htmlElement.classList.remove('sidebar-enable');
        htmlElement.setAttribute('data-menu-size', 'hidden');
        this.configSize = 'hidden';
      } else {
        if (currentSize === 'sm-hover-active') {
          htmlElement.setAttribute('data-menu-size', 'sm-hover');
          this.configSize = 'sm-hover';
        } else {
          htmlElement.setAttribute('data-menu-size', 'sm-hover-active');
          this.configSize = 'sm-hover-active';
        }
      }
    } else {
      if (currentSize === 'sm-hover-active') {
        htmlElement.setAttribute('data-menu-size', 'sm-hover');
        this.configSize = 'sm-hover';
      } else {
        htmlElement.setAttribute('data-menu-size', 'sm-hover-active');
        this.configSize = 'sm-hover-active';
      }
    }

    if (this.configSize === 'sm-hover') {
      this.collapseSubmenus();
    }
  }

  private collapseSubmenus(): void {
    const submenus = document.querySelectorAll('.collapse.show');
    submenus.forEach((submenu) => {
      submenu.classList.remove('show');
    });
  }
}
