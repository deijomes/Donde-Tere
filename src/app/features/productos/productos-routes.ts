import { Routes } from '@angular/router';

import { InventarioComponent } from './inventario/inventario.component';
import { RegistrarComponent } from './registrar/registrar.component';




export const PRODUCT_ROUTES: Routes = [
  { path: 'registro', component: RegistrarComponent},
  { path: 'inventario', component:InventarioComponent},
  
];
