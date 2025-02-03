import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { PoductService } from '../../services/poduct.service';
import { ventaModel } from '../../models/venta.Model';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css',
  encapsulation: ViewEncapsulation.None 
})
export class VentaComponent  implements OnInit{

  saleForm: FormGroup;
  productos: any[] = [];
  filteredProductos: any[] = [];
  productosSeleccionados: any[] = [];
  ProductoSeleccionado: ventaModel[] = []
  
  constructor(private fb: FormBuilder, private serviceproduct: PoductService) {
    this.saleForm = this.fb.group({
      codigo: [''],
      articulo: [''],
      cantidad: ['']
    });
  }
  
  ngOnInit(): void {
    this.producto();
    
  }
  
  producto() {
    this.serviceproduct.obtenerRegistros().subscribe({
      next: (response) => {
        this.productos = response; // Asegúrate de usar un punto y coma, no coma
        this.filteredProductos = [...this.productos];
        console.log(this.filteredProductos, 'este el listado');
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      }
    });
  
    // Detectar cambios en el campo "codigo" para filtrar productos
    this.saleForm.get('name')?.valueChanges.subscribe(value => {
      this.filtrarProductos(value);
    });
  }
  
  filtrarProductos(searchText: string) {
    if (!searchText) {
      this.filteredProductos = [...this.productos];
      return;
    }
    this.filteredProductos = this.productos.filter(p =>
      p.codigo?.toLowerCase().includes(searchText.toLowerCase()) 
    );
  }

  productoSeleccionado(producto: any) {
    console.log('Producto recibido:', producto);
    
    const productoCodigo = producto.code;
    console.log('Código del producto recibido:', productoCodigo);
  
    // Buscar el producto usando el código
    const productoEncontrado = this.productos.find(p => p.code === productoCodigo);
    
    if (productoEncontrado) {
      this.saleForm.patchValue({
        articulo: productoEncontrado.name,
        cantidad: '',Validators
      });
      console.log('Producto seleccionado:', productoEncontrado);
    } else {
      console.log('Producto no encontrado');
    }
  }

  agregarcantidad() {
    const codigo = this.saleForm.value.codigo;
    const cantidad = this.saleForm.value.cantidad;
  
    // Verificar que el producto y cantidad sean válidos
    if (!codigo || !cantidad) {
      console.error('Código o cantidad no válidos');
      return;
    }
  
    const productoEncontrado = this.productos.find(p => p.code === codigo);
    if (productoEncontrado) {
      // Renombramos la variable para evitar el conflicto con el tipo
      const productoAAgregar: ventaModel = {
        id: productoEncontrado.id,
        name: productoEncontrado.name,
        code: productoEncontrado.code,
        description: productoEncontrado.description,
        price: productoEncontrado.price,
        quantity: cantidad
      };
  
      // Agregar el producto a la lista de productos seleccionados
      this.productosSeleccionados.push(productoAAgregar);
      console.log('Producto agregado:', productoAAgregar);
      this.saleForm.reset();  // Reiniciar el formulario después de agregar
    } else {
      console.log('Producto no encontrado');
    }
  }
  
  
  
 

 
}  

 


