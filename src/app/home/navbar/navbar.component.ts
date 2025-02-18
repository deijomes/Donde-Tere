import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output } from '@angular/core';
import { BuscadorService } from '../../services/buscador.service';
import { ProductoCompraService } from '../../services/producto-compra.service';
import { CommonModule } from '@angular/common';
import { TextoSpañolPipe } from '../../pipes/texto-spañol.pipe';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailsplitPipe } from '../../pipes/emailsplit.pipe';
import Swal from 'sweetalert2';
import { CredencialesService } from '../../services/credenciales.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TextoSpañolPipe, FormsModule, EmailsplitPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  configSize: string = 'sm-hover';
  notificacion: any[] = []
  searchTerm: string = '';
  searchTermProductos: string = '';
  usuariObtenido: string = ''


  constructor(private buscadorService: BuscadorService, private services: ProductoCompraService,
    private router: Router, private credenciales: CredencialesService) {


  }
  ngOnInit(): void {
    this.notificaciones()
    this.obtenerUsuario()
  }



  onSearch(): void {

    this.enviarTerminoBusqueda();

  }

  onClickSearch(): void {
    this.enviarTerminoBusqueda();

  }

  private enviarTerminoBusqueda(): void {
    if (this.searchTerm.trim()) { // Verifica que no esté vacío
      console.log('Término de búsqueda enviado:', this.searchTerm);
      // Enviar el término con el contexto adecuado
      // Define el contexto basado en la ruta actual
      let contexto = 'general';
      if (this.router.url.includes('productos')) {
        contexto = 'productos';
      } else if (this.router.url.includes('movimientos')) {
        contexto = 'movimientos';
      }

      this.buscadorService.setTerminoBusqueda(this.searchTerm, contexto);
    }

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

  notificaciones() {
    this.services.Notificaciones().subscribe({
      next: (Response) => {

        this.notificacion = Response
        console.log(this.notificacion)

      }
    })
  }

  get notificationCount(): number {
    return this.notificacion.length;
  }

  obtenerUsuario() {
    const usuario = localStorage.getItem('email');

    if (usuario) {
      this.usuariObtenido = usuario
    }
  }


  cerrarSesion() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás a punto de cerrar sesión.',
      icon: 'warning',
     
     
      showCancelButton: true,
      confirmButtonText: 'cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#FF6F00', // Color naranja para el botón de confirmar
      cancelButtonColor: '#FF9800', // Color naranja más claro para el botón de cancelar
      customClass: {
        popup: 'custom-swal-popup', // Clase personalizada para ajustar el estilo
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.credenciales.cerrarSesion();
        localStorage.removeItem('email');
        this.router.navigateByUrl('login');
      }
    });}
}
