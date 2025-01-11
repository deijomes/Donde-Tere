import { Routes } from '@angular/router';
import { PRODUCT_ROUTES } from './features/productos/product-routes';
import { RegistroComponent } from './features/productos/registro/registro.component';

export const routes: Routes = [
     {path: 'productos', children: PRODUCT_ROUTES}
];
