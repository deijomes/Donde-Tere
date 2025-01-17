import { Routes } from '@angular/router';
import { RegistrarComponent } from './registrar/registrar.component';



export const PRODUCTOS_ROUTES: Routes = [

    { path: 'registrar', component: RegistrarComponent},
  
    { path: '', pathMatch: 'full', redirectTo: 'homeadmin'}
];
