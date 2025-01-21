import { Injectable } from '@angular/core';
import { registroModel } from '../models/registroModel';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BuscadorService {

  constructor() { }

  private productos: registroModel[] = [  // Ahora está tipado correctamente
    { articulo: 'Arroz', codigo: 'AR001', cantidadInicial: 50, cantidadMinima: 10, entrada: 20, salida: 15, cantidadActual: 55, PvUnitario: 25, PcUnitario: 20 },
    { articulo: 'Frijoles', codigo: 'FR002', cantidadInicial: 40, cantidadMinima: 8, entrada: 10, salida: 5, cantidadActual: 45, PvUnitario: 30, PcUnitario: 25 },
    { articulo: 'Aceite', codigo: 'AC003', cantidadInicial: 30, cantidadMinima: 5, entrada: 15, salida: 10, cantidadActual: 35, PvUnitario: 50, PcUnitario: 45 },
    { articulo: 'Azúcar', codigo: 'AZ004', cantidadInicial: 60, cantidadMinima: 12, entrada: 25, salida: 20, cantidadActual: 65, PvUnitario: 35, PcUnitario: 30 },
    { articulo: 'Harina', codigo: 'HA005', cantidadInicial: 45, cantidadMinima: 10, entrada: 18, salida: 12, cantidadActual: 51, PvUnitario: 15, PcUnitario: 12 },
    { articulo: 'Sal', codigo: 'SA006', cantidadInicial: 35, cantidadMinima: 6, entrada: 10, salida: 8, cantidadActual: 37, PvUnitario: 5, PcUnitario: 3 },
    { articulo: 'Leche', codigo: 'LE007', cantidadInicial: 80, cantidadMinima: 15, entrada: 30, salida: 10, cantidadActual: 100, PvUnitario: 12, PcUnitario: 10 },
    { articulo: 'Manteca', codigo: 'MA008', cantidadInicial: 25, cantidadMinima: 5, entrada: 10, salida: 8, cantidadActual: 27, PvUnitario: 40, PcUnitario: 35 },
    { articulo: 'Galletas', codigo: 'GA009', cantidadInicial: 60, cantidadMinima: 12, entrada: 20, salida: 10, cantidadActual: 70, PvUnitario: 12, PcUnitario: 10 },
    { articulo: 'Cereal', codigo: 'CE010', cantidadInicial: 40, cantidadMinima: 8, entrada: 15, salida: 5, cantidadActual: 50, PvUnitario: 8, PcUnitario: 6 }
  ];

  private terminoBusquedaSubject = new BehaviorSubject<string>(''); // Estado compartido
  terminoBusqueda$ = this.terminoBusquedaSubject.asObservable(); // Observable para escuchar cambios

  
  getProductos() {
    return this.productos;
  }

  
  buscarProductos(termino: string): registroModel[] {
    if (!termino) {
      return this.productos; 
    }
    
    return this.productos.filter(p =>
      p.articulo.toLowerCase().includes(termino.toLowerCase()) ||
      p.codigo.toLowerCase().includes(termino.toLowerCase()) 
    );

    
  } 

  setTerminoBusqueda(termino: string): void {
    this.terminoBusquedaSubject.next(termino); // Actualiza el término de búsqueda
  }
}
  
