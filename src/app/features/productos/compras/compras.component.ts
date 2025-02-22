import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { PoductService } from '../../../services/poduct.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ventaModel } from '../../../models/venta.Model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ProductoCompraService } from '../../../services/producto-compra.service';
import { IdPipe } from '../../../pipes/id.pipe';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import { PdfService } from '../../../services/pdf.service';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select'
import { LoadingService } from '../../../services/loading.service';
import { NgxPaginationModule } from 'ngx-pagination';





@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule, CommonModule, IdPipe, CapitalizePipe, FormsModule, SelectModule, NgxPaginationModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css',
  encapsulation: ViewEncapsulation.None
})


export class ComprasComponent implements OnInit {

  productos: any = [] = []
  filteredProductos: any[] = []
  productosSeleccionados: any = []
  proSeleccion: any = []
  facturaCompra: any = []
  registroCompras: any = []
  selctCompra: any = []
  selectedCountry: string | undefined;
  inventariados = true;
  noInventariados = false

  comprasForm: FormGroup;
  proveedorForm: FormGroup;
  idproduct: string = '';
  Idfactura: string = '';
  tablaProducto: boolean = false
  mostrarHistorial: boolean = false

  comprasNoInvenForms: FormGroup;
  tablaProNoInventariado = false;
  idproductNoInv: number = 0

  currentPage: number = 1;  // Página actual (comienza en 1)
  itemsPerPage: number = 10;  // Elementos por página (puedes cambiar este valor)
  totalItems: number = 0;  //

  constructor(private serviceproduct: PoductService, private serviceCompra: ProductoCompraService, private fb:
    FormBuilder, private router: Router, private pdf: PdfService, private loading: LoadingService) {

    this.comprasForm = this.fb.group({
      codigo: '',
      articulo: ['', Validators.required],
      cantidad: ['', Validators.required],
      precio: ['', Validators.required]

    });

    this.comprasNoInvenForms = this.fb.group({
      nombre: ['', Validators.required],
      cantidad: ['', Validators.required],
      precio: ['', Validators.required]
    })



    this.proveedorForm = this.fb.group({

      proveedor: ['', Validators.required],
      identificacion: ''
    })

  }
  ngOnInit(): void {
    this.loading.init();
    this.producto()
    this.registrosCompras()
    this.inventariado();
    this.cargarProductosSeleccionados();
    this.cargarProInv()
    
  }
  // SESION : 1 OBTENER PRODUCTO, PARA LUEGO SELCCIONARLO Y GUARDARLO EN LOCAL STORAGE...
  producto() {
    this.loading.show()
    this.serviceproduct.obtenerRegistros().subscribe({
      next: (response) => {
        this.productos = response.data; // Asegúrate de usar un punto y coma, no coma
        console.log(this.productos)
        this.filteredProductos = [...this.productos];
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
      }, complete: () => {
        this.loading.hide()

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
        precio: ''

      });
      console.log('Producto seleccionado:', productoEncontrado);
    } else {
      console.log('Producto no encontrado');
    }
  }

  agregarcantidad() {
    const codigo = this.comprasForm.value.codigo;
    const cantidad = this.comprasForm.value.cantidad;
    const precio = this.comprasForm.value.precio

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
          price: precio,
          quantity: cantidad
        };

        this.productosSeleccionados.push(productoAAgregar);
        setTimeout(() => {

          const destino = document.getElementById('tablaDes');
          if (destino) {

            destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
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
      this.tablaProducto = true;
    }

  }
  modificarProducto(idproducto: any) {

    this.idproduct = idproducto

  }



  eliminarProducto(index: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este producto será eliminado de la lista.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#FF6F00',
      cancelButtonColor: '#FF9800',
    }).then((result) => {
      if (result.isConfirmed) {

        let productos = JSON.parse(localStorage.getItem('productosSeleccionados') || '[]');

        // 2️Eliminar el producto por su índice
        productos.splice(index, 1);


        localStorage.setItem('productosSeleccionados', JSON.stringify(productos));


        this.cargarProductosSeleccionados();


        Swal.fire({
          title: '¡Éxito!',
          text: 'El producto ha sido eliminado.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
    });
  }

  getTotal(): number {

    return this.productosSeleccionados.reduce((sum: any, producto: any) => {
      const totalProducto = producto.price * producto.quantity; // Total por producto
      return sum + totalProducto; // Sumar al total general
    }, 0);
  }

  //SESION TERMINADA : 1

  //SESION 2: LOGICA BOTON DE MODFICAR CANTIDAD Y ELIMINAR
  actualizarCantidad() {
    const cantidad = Number((document.getElementById('cantidad') as HTMLInputElement).value);

    if (cantidad <= 0 || isNaN(cantidad)) {

      Swal.fire({
        title: '¡Error!',
        text: 'Por favor ingrese una cantidad válida.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#FF6F00'
      });

      return;
    }

    // Alerta de confirmación
    Swal.fire({
      title: '¿Está seguro de que desea actualizar la cantidad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#FF6F00', // Color naranja para el botón de confirmar
      cancelButtonColor: '#FF9800', // Color naranja más claro para el botón de cancelar
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, se llama a la función para modificar la cantidad
        this.modificarCantidad(this.idproduct, cantidad);
      } else {
        // Si el usuario cancela, no se hace nada
        Swal.fire({
          title: 'Cancelado',
          text: 'La cantidad no fue modificada',
          icon: 'info',
          confirmButtonText: 'Entendido', // Cambia el texto del botón
          confirmButtonColor: '#FF6F00' // Cambia el color del botón
        });

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


        Swal.fire({
          title: '¡Cantidad actualizada!',

          icon: 'success',
          timer: 2000, // 
          timerProgressBar: true,
          showConfirmButton: false,

        });

      } else {
        Swal.fire('Error', 'Producto no encontrado en localStorage.', 'error');
      }
    }
  }

  //SESION 3: OTNEMOS DATOS DEL CLIENTE Y MANDAMOS EL REGISTRO DE COMPRA

  enviarCompra() {
    const purchaseItems = this.prepararDatosParaAPI();
    console.log(purchaseItems,'datos mandados')
    const proveedor = this.proveedorForm.value.proveedor;
    const identificacion = this.proveedorForm.value.identificacion;

    const idenfic = identificacion.toString();



    this.loading.show()
    const supplyItems: any[] = []

    this.serviceCompra.enviarCompra(proveedor, idenfic, purchaseItems, supplyItems).subscribe({
      next: (response) => {
        console.log('compra enviada con éxito:', response);

        this.Idfactura = response.id

        this.loading.hide();




        this.serviceCompra.facturaCompra(this.Idfactura).subscribe({
          next: (facturaResponse) => {
            this.facturaCompra = facturaResponse;




          }
        })




        Swal.fire({
          title: 'Compra Registrada',
          text: 'La compra se ha registrado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-success-btn'
          }
        }).then(() => {

          setTimeout(() => {
            this.generatePDFF();
          }, 1000);
        });



        this.eliminarProductosGuardados();
        this.productosSeleccionados = [];
        this.registrosCompras()


        this.tablaProducto = false
        this.proveedorForm.reset()




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

  prepararDatosParaAPI(): any[] {
    return this.productosSeleccionados.map((producto: any) => {
      return {
        productId: producto.id,
        quantity: producto.quantity,
        price: producto.price
      };



    });



  }

  eliminarProductosGuardados() {
    localStorage.removeItem('productosSeleccionados');
    console.log('Productos eliminados de localStorage.');
  }

  registrosCompras() {
    this.serviceCompra.registrosCompras().subscribe({
      next: (Response) => {
        this.registroCompras = Response
        console.log('compras registros', this.registroCompras)

      }
    })
  }

  historial() {
    this.mostrarHistorial = true

    setTimeout(() => {

      const destino = document.getElementById('tablaDestino');
      if (destino) {

        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
  ocultarHistorial() {
    this.mostrarHistorial = false
  }

  detalle(compra: any) {

    this.selctCompra = compra
    console.log(this.selctCompra)

  }

  generatePDF() {
    setTimeout(() => {
      this.pdf.generateFacturaPDF2(this.selctCompra);

    }, 500)

  }
  generatePDFF() {
    this.pdf.generateFacturaPDF2(this.facturaCompra);
  }

  registro() {
    this.router.navigateByUrl('productos/registrar');


  }
  cancelarventa() {

    localStorage.removeItem('productosSeleccionados');
    console.log('Productos eliminados de localStorage.');
    this.productosSeleccionados = []
    this.tablaProducto = false

  }

  inventariado() {
    this.inventariados = true
    this.noInventariados = false

  }
  noInventariado() {
    this.inventariados = false
    this.noInventariados = true

  }

  //segundo formulario- productos no inventariados


  agregarProducto() {
    const productoNoInven = this.comprasNoInvenForms.value;

    if (!productoNoInven || !productoNoInven.nombre || !productoNoInven.cantidad || !productoNoInven.precio) {

      return;
    }

    const cantidad = Number(productoNoInven.cantidad);
    const precio = Number(productoNoInven.precio);


    if (!this.proSeleccion) {
      this.proSeleccion = [];
    }

    // Buscar si el producto ya está en la lista
    const productoExistente = this.proSeleccion.find((p: any) => p.name === productoNoInven.nombre);

    if (productoExistente) {
      // Si ya existe, sumamos la cantidad
      productoExistente.quantity += cantidad;
    } else {
      // Si no existe, lo agregamos a la lista
      const productoAAgr: ventaModel = {
        id: Date.now(), // ID único
        name: productoNoInven.nombre,
        code: '',
        description: '',
        price: precio,
        quantity: cantidad
      };

      this.proSeleccion.push(productoAAgr);
    }


    localStorage.setItem('productoNoInventario', JSON.stringify(this.proSeleccion));

    
    this.tablaProNoInventariado = true;

    // Desplazar a la tabla
    setTimeout(() => {
      const destino = document.getElementById('tablaNoInventariados');
      if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Reiniciar el formulario después de agregar
    this.comprasNoInvenForms.reset();
  }

  Total(): number {

    return this.proSeleccion.reduce((sum: any, producto: any) => {
      const totalProducto = producto.price * producto.quantity; // Total por producto
      return sum + totalProducto; // Sumar al total general
    }, 0);
  }


  modificar(index: number) {

    this.idproductNoInv = index



  }



  eliminarProNoInve(index: number) {

    console.log('psoicion',index)
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este producto será eliminado de la lista.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#FF6F00',
      cancelButtonColor: '#FF9800',
    }).then((result) => {
      if (result.isConfirmed) {

        let productos = JSON.parse(localStorage.getItem('productoNoInventario') || '[]');

        // 2️Eliminar el producto por su índice
        productos.splice(index, 1);


        localStorage.setItem('productoNoInventario', JSON.stringify(productos));
        this.proSeleccion = productos;

        this.cargarProInv()




        Swal.fire({
          title: '¡Éxito!',
          text: 'El producto ha sido eliminado.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });

        
      }
    });
  }

  cargarProInv() {
    const productosGuardados = localStorage.getItem('productoNoInventario');
    if (productosGuardados) {
      this.proSeleccion = JSON.parse(productosGuardados); // Convertir de JSON a objeto
      console.log('Productos cargados desde LocalStorage:', this.productosSeleccionados);
      this.tablaProNoInventariado = true;
    }

  }



  actualizarProNoInventario() {
    const cantidad = Number((document.getElementById('cantidadModi') as HTMLInputElement).value);

    if (cantidad <= 0 || isNaN(cantidad)) {

      Swal.fire({
        title: '¡Error!',
        text: 'Por favor ingrese una cantidad válida.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#FF6F00'
      });

      return;
    }

    // Alerta de confirmación
    Swal.fire({
      title: '¿Está seguro de que desea actualizar la cantidad?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',

      confirmButtonColor: '#FF6F00', // Color naranja para el botón de confirmar
      cancelButtonColor: '#FF9800', // Color naranja más claro para el botón de cancelar
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, se llama a la función para modificar la cantidad
        this.modificarproductNo(this.idproductNoInv, cantidad);
      } else {
        // Si el usuario cancela, no se hace nada
        Swal.fire({
          title: 'Cancelado',
          text: 'La cantidad no fue modificada',
          icon: 'info',
          confirmButtonText: 'Entendido', // Cambia el texto del botón
          confirmButtonColor: '#FF6F00' // Cambia el color del botón
        });

      }
    });
  }


  modificarproductNo(index: number, nuevaCantidad: number) {
    const productosGuardados = localStorage.getItem('productoNoInventario');

    if (productosGuardados) {
      let productos = JSON.parse(productosGuardados);

      // Verifica si el índice es válido
      if (index >= 0 && index < productos.length) {
        productos[index].quantity = nuevaCantidad;

        // Guardar los productos actualizados en localStorage
        localStorage.setItem('productoNoInventario', JSON.stringify(productos));

        // Actualizar la lista en el componente
        this.proSeleccion = productos;

        Swal.fire({
          title: '¡Cantidad actualizada!',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

      } else {
        Swal.fire('Error', 'Índice fuera de rango.', 'error');
      }
    }
  }

  cancelarcompraProNoIn(){

    localStorage.removeItem('productoNoInventario');
   
    this.proSeleccion = []
    this.tablaProNoInventariado = false


  }

  enviarCompraProNoInv() {
    const supplyItems = this.prepararDatos();
    console.log(supplyItems,'datos amndos2')
    
    const proveedor = this.proveedorForm.value.proveedor;
    const identificacion = this.proveedorForm.value.identificacion;

    const idenfic = identificacion.toString();



    this.loading.show()
    const purchaseItems: any[] = []

    this.serviceCompra.enviarCompraProNoInv(proveedor, idenfic, purchaseItems, supplyItems).subscribe({
      next: (response) => {

        this.Idfactura = response.id

        this.loading.hide();

        this.serviceCompra.facturaCompra(this.Idfactura).subscribe({
          next: (facturaResponse) => {
            this.facturaCompra = facturaResponse;
          }
        })
        Swal.fire({
          title: 'Compra Registrada',
          text: 'La compra se ha registrado con éxito.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-success-btn'
          }
        }).then(() => {

          setTimeout(() => {
            this.generatePDFF();
          }, 1000);
        });
        this.eliminarProNoInv();
        this.proSeleccion = [];
        this.registrosCompras()
      
        this.tablaProNoInventariado = false
        this.proveedorForm.reset()

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

  prepararDatos(): any[] {
    return this.proSeleccion.map((producto: any) => {
      
      return {
        description: producto.name,
        quantity: producto.quantity,
        price: producto.price
      };

    });

  }

  
  eliminarProNoInv() {
    localStorage.removeItem('productoNoInventario');
   
  }











  // Preparar los productos para el formato correcto
}





