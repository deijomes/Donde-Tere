import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { CredencialesService } from './services/credenciales.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtén el servicio AuthService
  const authService = inject(CredencialesService);
  
  // Recupera el token desde sessionStorage
  const token = authService.obtenerToken();
  
  if (token) {
    // Si el token está presente, clona la solicitud y agrega el encabezado de autorización
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);  // Pasa la solicitud modificada
  }

  // Si no hay token, simplemente pasa la solicitud sin cambios
  return next(req);
};
