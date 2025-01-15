import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { registroModel } from '../models/registroModel';
 // Asegúrate de importar correctamente el modelo

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // Usamos BehaviorSubject para manejar los cambios y permitir la reactividad
  private productosSource = new BehaviorSubject<registroModel[]>([]);
  productos$ = this.productosSource.asObservable();
  productosSubject: any;

  constructor() {}

  // Método para agregar un producto
  agregarProducto(producto: registroModel): void {
    const productos = this.productosSource.getValue();
    productos.push(producto);
    this.productosSource.next(productos);  // Emitimos los productos actualizados
  }

  eliminarProducto(codigo: string): void {
    const productosFiltrados = this.productosSource.value.filter(producto => producto.codigo !== codigo);
    this.productosSource.next(productosFiltrados);  // Emitir la nueva lista sin el producto eliminado
  }

  editarProducto(codigo: string, productoEditado: registroModel): void {
    const productos = this.productosSubject.value.map((producto: { codigo: string; }) =>
      producto.codigo === codigo ? { ...producto, ...productoEditado } : producto
    );
    this.productosSubject.next(productos);  // Emitir la nueva lista con el producto editado
  }
}
