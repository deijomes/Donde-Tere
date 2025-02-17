import { Routes } from '@angular/router';

import { InventarioComponent } from './features/productos/inventario/inventario.component';
import { VentaComponent } from './features/venta/venta.component';
import { VentasTotalesComponent } from './features/ventas-totales/ventas-totales.component';
import { InventarioGeneralComponent } from './features/inventario-general/inventario-general.component';
import { MovimientosComponent } from './features/movimientos/movimientos.component';
import { PRODUCTOS_ROUTES } from './features/productos/registro.routes';
import { LoginComponent } from './auth/login/login.component';
import { ComprasComponent } from './features/productos/compras/compras.component';
import { RegistroUsuarioComponent } from './auth/registro-usuario/registro-usuario.component';

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
    {path: 'compras', component :ComprasComponent},
    { path: 'ventas', component: VentaComponent, },
    { path: 'ventastotales', component: VentasTotalesComponent, },
    { path: 'login', component: LoginComponent },
    {path :'register', component: RegistroUsuarioComponent},
    { path: '**', pathMatch: 'full', redirectTo: 'inventarioo' },
   
];