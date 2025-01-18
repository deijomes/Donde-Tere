import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { RegistrarComponent } from './features/productos/registrar/registrar.component';
import { InventarioComponent } from './features/productos/inventario/inventario.component';
import { VentaComponent } from './features/venta/venta.component';
import { VentasTotalesComponent } from './features/ventas-totales/ventas-totales.component';
import { InventarioGeneralComponent } from './features/inventario-general/inventario-general.component';
import { MovimientosComponent } from './features/movimientos/movimientos.component';
import { ActualizarComponent } from './features/productos/actualizar/actualizar.component';
import { LoginComponent } from './auth/login/login.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, RegistrarComponent, InventarioComponent,
    VentaComponent, VentasTotalesComponent, InventarioGeneralComponent, MovimientosComponent,
    ActualizarComponent, LoginComponent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Añade esta línea
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router:Router, private activatedRoute: ActivatedRoute){

  }
  title = 'Inventario';
  currentYear: number = new Date().getFullYear();
  isLoginRoute(): boolean {
    // Verifica si la ruta activa es la de login
    return this.router.url === '/login' || this.activatedRoute.snapshot.firstChild?.routeConfig?.path === 'login';
  }
}
