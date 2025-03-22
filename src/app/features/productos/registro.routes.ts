import { Routes } from '@angular/router';
import { RegistrarComponent } from './registrar/registrar.component';
import { ActualizarComponent } from './actualizar/actualizar.component';
import { ComprasComponent } from './compras/compras.component';



export const PRODUCTOS_ROUTES: Routes = [

    { path: 'registrar', component: RegistrarComponent},
    { path: 'actualizar/:id', component: ActualizarComponent},
  
  
    { path: '', pathMatch: 'full', redirectTo: 'productos'}
];
