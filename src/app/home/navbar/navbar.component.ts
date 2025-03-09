import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output } from '@angular/core';
import { BuscadorService } from '../../services/buscador.service';
import { ProductoCompraService } from '../../services/producto-compra.service';
import { CommonModule } from '@angular/common';
import { TextoSpañolPipe } from '../../pipes/texto-spañol.pipe';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { EmailsplitPipe } from '../../pipes/emailsplit.pipe';
import Swal from 'sweetalert2';
import { CredencialesService } from '../../services/credenciales.service';
import { interval, Subscription } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';

import { FluidModule } from 'primeng/fluid';
import { DashboardService } from '../../services/dashboard.service';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, TextoSpañolPipe, FormsModule, EmailsplitPipe, DatePickerModule, FluidModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  configSize: string = 'sm-hover';
  notificacion: any[] = []
  searchTerm: string = '';
  searchTermProductos: string = '';
  usuariObtenido: string = '';
  contenidoHabilitado = false

  fechaInicio: Date | null = null
  fechaFinal: Date | null = null
  archivoBlob: Blob | null = null;
  nombreArchivo: string = '';
  tablaReporte = false;
  mostrarBoton = false

  private notificacionSub!: Subscription;


  constructor(private buscadorService: BuscadorService, private services: ProductoCompraService,
    private router: Router, private credenciales: CredencialesService, private servicio: DashboardService,
    private route: ActivatedRoute, private socketService: NotificationService) {


  }
  ngOnInit(): void {




    this.notificaciones()
    setTimeout(() => this.notificaciones(), 120000)

    this.inicializarSocket();
    this.obtenerUsuario();
    this.obtenerRol();

    this.router.events.subscribe(() => {
      this.mostrarBoton = this.router.url.includes('/ventastotales');
    });

  }



  onSearch(): void {

    this.enviarTerminoBusqueda();

  }

  onClickSearch(): void {
    this.enviarTerminoBusqueda();

  }

  private enviarTerminoBusqueda(): void {
    if (this.searchTerm.trim()) { // Verifica que no esté vacío

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
      // bodyElement.style.overflow = 'hidden'; // Deshabilitamos el scroll del body
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

    const token = sessionStorage.getItem('token')

    if (token) {

      this.services.Notificaciones().subscribe({
        next: (Response) => {

          this.notificacion = Response.filter((noti: any) => noti.closed === false)


        }
      })
    }
  }


  inicializarSocket() {

    this.socketService.connect();


    this.notificacionSub = this.socketService.listen('newNotification').subscribe({
      next: (nuevaNotificacion) => {
        console.log(' Notificación recibida:', nuevaNotificacion);
        this.notificacion.push(nuevaNotificacion);
      },
      error: (err) => {
        console.error(' Error recibiendo notificación:', err);
      }
    });


  }

  ngOnDestroy(): void {
    // Limpia la suscripción al destruir el componente
    if (this.notificacionSub) {
      this.notificacionSub.unsubscribe();
    }

    // Desconecta el socket
    this.socketService.disconnect();
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

  obtenerRol() {
    const usuario = localStorage.getItem('role');

    if (usuario === 'ADMIN' || usuario === 'SUPERADMIN') {
      this.contenidoHabilitado = true;  // Solo habilita si es ADMIN
    } else {
      this.contenidoHabilitado = false;  // Cualquier otro rol o valor lo bloquea
    }
  }


  cerrarSesion() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás a punto de cerrar sesión.',
      icon: 'warning',


      showCancelButton: true,
      confirmButtonText: 'Cerrar sesión',
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
        localStorage.removeItem('role');
        localStorage.removeItem('name')
        this.router.navigateByUrl('login');
      }
    });
  }


  generarReporte() {


    // Convertir fechaInicial a formato ISO (UTC)
    let startDate;
    if (this.fechaInicio) {
      const fechaInici = new Date(this.fechaInicio);
      fechaInici.setUTCHours(0, 0, 0, 0); // Establece la hora en UTC
      startDate = fechaInici.toISOString();

    }






    // Convertir fechaFinal a formato ISO (UTC) con la hora máxima del día
    let endDate;
    if (this.fechaFinal) {
      const fechaFin = new Date(this.fechaFinal);
      fechaFin.setUTCHours(23, 59, 59, 999); // Establece la hora en UTC
      endDate = fechaFin.toISOString();

    }



    this.servicio.getReporte(startDate, endDate).subscribe((blob: Blob) => {


      // Guardar el archivo y el nombre en variables de clase
      this.archivoBlob = blob;
      this.nombreArchivo = `reporte_${new Date().toISOString()}.xlsx`;
      this.tablaReporte = true
    });
  }

  descargarArchivo() {
    if (!this.archivoBlob) {

      return;
    }



    const url = window.URL.createObjectURL(this.archivoBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    this.tablaReporte = false


  }
}
