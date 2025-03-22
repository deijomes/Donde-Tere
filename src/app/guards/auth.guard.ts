import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Verificar si el token está en sessionStorage
  const token = sessionStorage.getItem('token'); 
  const role = sessionStorage.getItem('role'); // Obtén el rol del usuario

  if (token) {
    // Si existe un token, permitir el acceso
    return true;
  } else {
    // Si no hay token, redirigir al login
    router.navigate(['/login']);
    return false;
  }
};
