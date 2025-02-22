import { Injectable } from '@angular/core';
declare var bootstrap: any; // Para acceder a Bootstrap desde Angular

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private modalInstance: any;

  constructor() {}

  init() {
    const modalElement = document.getElementById('loadingModal');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
  }

  show() {
    this.modalInstance?.show();
  }

  hide() {
    
  
    const modalElement = document.getElementById('loadingModal');
    if (modalElement) {
      const modalBootstrap = bootstrap.Modal.getInstance(modalElement);
      if (modalBootstrap) {
        modalBootstrap.hide();
        
      }
  
      // 🔹 Espera un poco y fuerza el ocultamiento manualmente
      setTimeout(() => {
        modalElement.classList.remove('show'); // Quitar clase Bootstrap
        modalElement.style.display = 'none'; // Esconder el modal
  
        // 🔹 Eliminar backdrop (fondo oscuro)
        const backdrops = document.getElementsByClassName('modal-backdrop');
        if (backdrops.length > 0) {
          backdrops[0].remove();
         
        }
      }, 300);
    }
  }
  
}  
