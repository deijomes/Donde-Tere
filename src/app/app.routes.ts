import { Routes } from '@angular/router';
import { RegistrarComponent } from './features/productos/registrar/registrar.component';
import { InventarioComponent } from './features/productos/inventario/inventario.component';
import { VentaComponent } from './features/venta/venta.component';
import { VentasTotalesComponent } from './features/ventas-totales/ventas-totales.component';
import { InventarioGeneralComponent } from './features/inventario-general/inventario-general.component';
import { MovimientosComponent } from './features/movimientos/movimientos.component';
import { PRODUCT_ROUTES } from './features/productos/productos-routes';


export const routes: Routes = [  
                                 {path: 'inventarioo', component:InventarioGeneralComponent},
                                 {path: 'productos', children: PRODUCT_ROUTES},
                                 {path: 'movimientos', component: MovimientosComponent},
                                 {path: 'ventas',component:VentaComponent},
                                 {path: 'ventastotales', component:VentasTotalesComponent},
    
];
