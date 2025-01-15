import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { registroModel } from '../../../models/registroModel';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit{

  productos: registroModel[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    // Nos suscribimos al observable de productos para actualizar la vista automáticamente
    this.productoService.productos$.subscribe((productos) => {
      this.productos = productos;
    });
  }

  eliminar(codigo: string): void {
    this.productoService.eliminarProducto(codigo);  // Llamar al servicio para eliminar el producto
  }

  

}
