import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { PoductService } from '../../../services/poduct.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ventaModel } from '../../../models/venta.Model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})


export class ComprasComponent implements OnInit {

  productos: any = [] = []
  filteredProductos: any[] = []
  productosSeleccionados: any = []

  comprasForm: FormGroup;
  idproduct: string = '';
  tablaProducto:boolean = false

  constructor(private serviceproduct: PoductService, private fb: FormBuilder) {

    this.comprasForm = this.fb.group({
      codigo: '',
      articulo: ['', Validators.required],
      cantidad: ['', Validators.required]
    });

  }
  ngOnInit(): void {
    this.producto()
  }

  producto() {
    this.serviceproduct.obtenerRegistros().subscribe({
      next: (response) => {
        this.productos = response; // Asegúrate de usar un punto y coma, no coma
        console.log(this.productos)
        this.filteredProductos = [...this.productos];
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      }
    });

    // Detectar cambios en el campo "codigo" para filtrar productos

  }

  /* filtrarProductos(searchText: string) {
     if (!searchText) {
       this.filteredProductos = [...this.productos];
       return;
     }
     this.filteredProductos = this.productos.filter(p =>
       p.codigo?.toLowerCase().includes(searchText.toLowerCase())
     );
   }  */

  productoSeleccionado(producto: any) {
    console.log('Producto recibido:', producto);

    const productoCodigo = producto.code;
    console.log('Código del producto recibido:', productoCodigo);

    // Buscar el producto usando el código
    const productoEncontrado = this.productos.find((p: any) => p.code === productoCodigo);

    if (productoEncontrado) {
      this.comprasForm.patchValue({
        codigo: productoEncontrado.code,
        articulo: productoEncontrado.name,
        cantidad: '',

      });
      console.log('Producto seleccionado:', productoEncontrado);
    } else {
      console.log('Producto no encontrado');
    }
  }
  agregarcantidad() {
    const codigo = this.comprasForm.value.codigo;
    const cantidad = this.comprasForm.value.cantidad;

    // Verificar que el producto y cantidad sean válidos
    if (!codigo || !cantidad || cantidad <= 0) {
      console.error('Código o cantidad no válidos');
      return;
    }

    const productoEncontrado = this.productos.find((p: any) => p.code === codigo);
    if (productoEncontrado) {
      // Buscar si el producto ya está en la lista de productos seleccionados
      const productoExistente = this.productosSeleccionados.find((p: any) => p.code === codigo);

      if (productoExistente) {
        // Si ya existe, sumamos la cantidad
        productoExistente.quantity += cantidad;
      } else {
        // Si no existe, lo agregamos a la lista
        const productoAAgregar: ventaModel = {
          id: productoEncontrado.id,
          name: productoEncontrado.name,
          code: productoEncontrado.code,
          description: productoEncontrado.description,
          price: productoEncontrado.price,
          quantity: cantidad
        };

        this.productosSeleccionados.push(productoAAgregar);
      }

      // Guardar en localStorage
      localStorage.setItem('productosSeleccionados', JSON.stringify(this.productosSeleccionados));

      console.log('Producto actualizado:', this.productosSeleccionados);
      this.tablaProducto = true;


      this.comprasForm.reset();  // Reiniciar el formulario después de agregar
    } else {
      console.log('Producto no encontrado');
    }
  }

  cargarProductosSeleccionados() {
    const productosGuardados = localStorage.getItem('productosSeleccionados');
    if (productosGuardados) {
      this.productosSeleccionados = JSON.parse(productosGuardados); // Convertir de JSON a objeto
      console.log('Productos cargados desde LocalStorage:', this.productosSeleccionados);
    }

  }
  modificarProducto(idproducto: any) {

    this.idproduct = idproducto

  }

  modificarCantidad(productId: string, nuevaCantidad: number) {
    const productosGuardados = localStorage.getItem('productosSeleccionados');
    if (productosGuardados) {
      let productos = JSON.parse(productosGuardados);

      // Buscar el producto por su ID y actualizar la cantidad
      const index = productos.findIndex((p: any) => p.id === productId);
      if (index !== -1) {
        productos[index].quantity = nuevaCantidad;

        // Guardar los productos actualizados en localStorage
        localStorage.setItem('productosSeleccionados', JSON.stringify(productos));

        // Actualizar la lista en el componente
        this.productosSeleccionados = productos;

        Swal.fire('¡Cantidad actualizada!', '', 'success');
      } else {
        Swal.fire('Error', 'Producto no encontrado en localStorage.', 'error');
      }
    }
  }

   eliminarProducto(index: number) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Este producto será eliminado de la lista.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
          confirmButton: 'swal-confirm-btn',
          cancelButton: 'swal-cancel-btn'
        }
      }).then((result) => {
        if (result.isConfirmed) {
  
          let productos = JSON.parse(localStorage.getItem('productosSeleccionados') || '[]');
  
          // 2️Eliminar el producto por su índice
          productos.splice(index, 1);
  
  
          localStorage.setItem('productosSeleccionados', JSON.stringify(productos));
  
  
          this.cargarProductosSeleccionados();
  
  
          Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
        }
      });
    }

    getTotal(): number {

      return this.productosSeleccionados.reduce((sum:any, producto: any) => {
        const totalProducto = producto.price * producto.quantity; // Total por producto
        return sum + totalProducto; // Sumar al total general
      }, 0);
    }
  
  


}

