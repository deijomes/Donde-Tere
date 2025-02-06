import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination'

import { PoductService } from '../../services/poduct.service';
import { ventaModel } from '../../models/venta.Model';
import Swal from 'sweetalert2';
import { IdPipe } from '../../pipes/id.pipe';
import { CapitalizePipe } from "../../pipes/capitalize.pipe";
import { PdfService } from '../../services/pdf.service';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, IdPipe, NgxPaginationModule, CapitalizePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css',
  encapsulation: ViewEncapsulation.None
})
export class VentaComponent implements OnInit {

  saleForm: FormGroup;
  clienteForm: FormGroup;
  productos: any[] = [];
  filteredProductos: any[] = [];
  productosSeleccionados: any[] = [];
  prodcutotabla: boolean = false
  salidas: any[] = [];
  selctSalida: any = []
  Idfactura: string = '';
  facturaVent: any[] = []
  mostrarHistorial: boolean = false
  ProductoSeleccionado: ventaModel[] = []
  cantidad: number = 0
  idproduct: string = ''

  currentPage: number = 1;  // Página actual (comienza en 1)
  itemsPerPage: number = 10;  // Elementos por página (puedes cambiar este valor)
  totalItems: number = 0;  //


  constructor(private fb: FormBuilder, private serviceproduct: PoductService, private pdf: PdfService) {
    this.saleForm = this.fb.group({
      codigo: '',
      articulo: ['', Validators.required],
      cantidad: ['', Validators.required]
    });

    this.clienteForm = this.fb.group({
      cliente: ['', Validators.required]
    })





  }

  ngOnInit(): void {
    this.producto();
    this.cargarProductosSeleccionados()
    this.obtenerSalidas()



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
        cantidad: '',

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
    if (!codigo || !cantidad || cantidad <= 0) {
      console.error('Código o cantidad no válidos');
      return;
    }

    const productoEncontrado = this.productos.find(p => p.code === codigo);
    if (productoEncontrado) {
      // Buscar si el producto ya está en la lista de productos seleccionados
      const productoExistente = this.productosSeleccionados.find(p => p.code === codigo);

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

      this.prodcutotabla = true;
      this.saleForm.reset();  // Reiniciar el formulario después de agregar
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

  enviarVenta() {
    const saleItems = this.prepararDatosParaAPI();
    const cliente = this.clienteForm.value.cliente;


    console.log('Sale Items:', saleItems);
    console.log('Cliente:', cliente);

    this.serviceproduct.enviarVenta(cliente, saleItems).subscribe({
      next: (response) => {
        console.log('Venta enviada con éxito:', response);
        this.Idfactura = response.id
        console.log('Idfactura', this.Idfactura)



        this.serviceproduct.facturaVenta(this.Idfactura).subscribe({
          next: (facturaResponse) => {
            this.facturaVent = facturaResponse;
            console.log('Factura obtenida:', this.facturaVent);
           


          }
        })




        Swal.fire({
          title: 'Venta Registrada',
          text: 'La venta se ha registrado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-success-btn'
          }
        }).then(() => {
          
          this.generatePDFF();
        });


        this.eliminarProductosGuardados();
        this.productosSeleccionados = [];

        this.obtenerSalidas()
        this.prodcutotabla = false
        this.clienteForm.reset()

      },
      error: (err) => {
        console.error('Error al enviar la venta:', err);
        const mensajeError = err.error?.message || 'Hubo un problema al registrar la venta.';


        Swal.fire({

          text: mensajeError,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-success-btn'
          }
        });

      }
    });



  }


  // Preparar los productos para el formato correcto
  prepararDatosParaAPI(): any[] {
    return this.productosSeleccionados.map(producto => {
      return {
        productId: producto.id,
        quantity: producto.quantity
      };

    });


  }

  eliminarProductosGuardados() {
    localStorage.removeItem('productosSeleccionados');
    console.log('Productos eliminados de localStorage.');
  }


  modificarProducto(idproducto: any) {

    this.idproduct = idproducto

  }
  actualizarCantidad() {
    const cantidad = Number((document.getElementById('cantidad') as HTMLInputElement).value);

    if (cantidad <= 0 || isNaN(cantidad)) {
      Swal.fire('Error', 'Por favor ingrese una cantidad válida', 'error');
      return;
    }

    // Alerta de confirmación
    Swal.fire({
      title: '¿Está seguro de que desea actualizar la cantidad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'actualizar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, se llama a la función para modificar la cantidad
        this.modificarCantidad(this.idproduct, cantidad);
      } else {
        // Si el usuario cancela, no se hace nada
        Swal.fire('Cancelado', 'La cantidad no fue modificada', 'info');
      }
    });
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

    return this.productosSeleccionados.reduce((sum, producto) => {
      const totalProducto = producto.price * producto.quantity; // Total por producto
      return sum + totalProducto; // Sumar al total general
    }, 0);
  }

  obtenerSalidas() {
    this.serviceproduct.obtenerSalidas().subscribe({
      next: (Response) => {
        this.salidas = Response.data
        console.log(this.salidas)

      }
    })
  }

  detalle(salida: any) {

    this.selctSalida = salida
    console.log(this.selctSalida)




  }


  generatePDF() {
    this.pdf.generateFacturaPDF(this.selctSalida);
  }

  generatePDFF() {
    this.pdf.generateFacturaPDF(this.facturaVent);
  }




  historial() {
    this.mostrarHistorial = true
  }
  ocultarHistorial() {
    this.mostrarHistorial = false
  }
  cancelarventa() {

    localStorage.removeItem('productosSeleccionados');
    console.log('Productos eliminados de localStorage.');
    this.productosSeleccionados = []
    this.prodcutotabla = false

  }

}




