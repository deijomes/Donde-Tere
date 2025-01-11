import { Routes } from '@angular/router';
import { RegistrarComponent } from './features/productos/registrar/registrar.component';
import { InventarioComponent } from './features/productos/inventario/inventario.component';
import { VentaComponent } from './features/venta/venta.component';
import { VentasTotalesComponent } from './features/ventas-totales/ventas-totales.component';
import { InventarioGeneralComponent } from './features/inventario-general/inventario-general.component';
import { MovimientosComponent } from './features/movimientos/movimientos.component';



export const routes: Routes = [  { path: '', redirectTo: 'inventarioo', pathMatch: 'full' },

                                 {path: 'inventarioo', component:InventarioGeneralComponent},
                                 { path: 'productos-registro', component: RegistrarComponent},
                                 { path: 'productos-inventario', component:InventarioComponent},
                                 {path: 'movimientos', component: MovimientosComponent},
                                 {path: 'ventas',component:VentaComponent},
                                 {path: 'ventastotales', component:VentasTotalesComponent},

                                 { path: '**', redirectTo: 'inventarioo' } // Maneja rutas no existentes
    
];
