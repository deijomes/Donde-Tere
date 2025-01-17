import { Routes } from '@angular/router';

import { InventarioComponent } from './features/productos/inventario/inventario.component';
import { VentaComponent } from './features/venta/venta.component';
import { VentasTotalesComponent } from './features/ventas-totales/ventas-totales.component';
import { InventarioGeneralComponent } from './features/inventario-general/inventario-general.component';
import { MovimientosComponent } from './features/movimientos/movimientos.component';
import { PRODUCTOS_ROUTES } from './features/productos/registro.routes';

// export const routes: Routes = [
//   { path: '', redirectTo: 'inventarioo', pathMatch: 'full' },

//   { path: 'inventarioo', component: InventarioGeneralComponent },
//   {
//     path: 'productos',
//     component: InventarioComponent,
//     children: PRODUCTOS_ROUTES, // Subrutas para productos
//   },
//   {
//     path: 'movimientos',
//     component: MovimientosComponent,
//   },
//   {
//     path: 'ventas',
//     component: VentaComponent,
//   },
//   {
//     path: 'ventastotales',
//     component: VentasTotalesComponent,
//   },

//   { path: '**', redirectTo: 'inventarioo' }, // Ruta comodín al final
// ];


export const routes: Routes = [
    { path: 'inventarioo', component: InventarioGeneralComponent },
    {
        path: 'productos',
        component: InventarioComponent,
        children: PRODUCTOS_ROUTES
    },
    { path: 'movimientos', component: MovimientosComponent, },
    { path: 'ventas', component: VentaComponent, },
    { path: 'ventastotales', component: VentasTotalesComponent, },
    { path: '**', pathMatch: 'full', redirectTo: 'inventarioo' },
];