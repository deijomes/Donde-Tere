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
import { authGuard } from './guards/auth.guard';

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
    { path: 'inventarioo', component: InventarioGeneralComponent,  canActivate: [authGuard] } ,
    {
        path: 'productos',
        component: InventarioComponent,
        children: PRODUCTOS_ROUTES,  canActivate: [authGuard]
    },
    { path: 'movimientos', component: MovimientosComponent,  canActivate: [authGuard] },
    {path: 'compras', component :ComprasComponent,  canActivate: [authGuard]},
    { path: 'ventas', component: VentaComponent,  canActivate: [authGuard]},
    { path: 'ventastotales', component: VentasTotalesComponent,  canActivate: [authGuard]},
    { path: 'login', component: LoginComponent },
    {path :'register', component: RegistroUsuarioComponent},
    { path: '**', pathMatch: 'full', redirectTo: 'inventarioo' },
   
];