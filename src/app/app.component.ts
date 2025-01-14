import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './home/sidebar/sidebar.component';
import { NavbarComponent } from './home/navbar/navbar.component';
import { RegistrarComponent } from './features/productos/registrar/registrar.component';
import { InventarioComponent } from './features/productos/inventario/inventario.component';
import { VentaComponent } from './features/venta/venta.component';
import { VentasTotalesComponent } from './features/ventas-totales/ventas-totales.component';
import { InventarioGeneralComponent } from './features/inventario-general/inventario-general.component';
import { MovimientosComponent } from './features/movimientos/movimientos.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent,NavbarComponent, RegistrarComponent, InventarioComponent, 
    VentaComponent,VentasTotalesComponent, InventarioGeneralComponent, MovimientosComponent],
   schemas: [CUSTOM_ELEMENTS_SCHEMA], // Añade esta línea
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Inventario';
  currentYear: number = new Date().getFullYear();
}
