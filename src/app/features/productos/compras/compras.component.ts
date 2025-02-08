import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { PoductService } from '../../../services/poduct.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ventaModel } from '../../../models/venta.Model';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ProductoCompraService } from '../../../services/producto-compra.service';
import { IdPipe } from '../../../pipes/id.pipe';
import { CapitalizePipe } from '../../../pipes/capitalize.pipe';
import { PdfService } from '../../../services/pdf.service';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule, CommonModule, IdPipe, CapitalizePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css',
  encapsulation: ViewEncapsulation.None
})


export class ComprasComponent implements OnInit {

  productos: any = [] = []
  filteredProductos: any[] = []
  productosSeleccionados: any = []
  facturaCompra: any = []
  registroCompras: any = []
  selctCompra: any=[]

  comprasForm: FormGroup;
  proveedorForm: FormGroup;
  idproduct: string = '';
  Idfactura: string = '';
  tablaProducto: boolean = false
  mostrarHistorial : boolean =  false

  constructor(private serviceproduct: PoductService, private serviceCompra: ProductoCompraService, private fb: FormBuilder,
     private pdf:PdfService) {

    this.comprasForm = this.fb.group({
      codigo: '',
      articulo: ['', Validators.required],
      cantidad: ['', Validators.required]
    });

    this.proveedorForm = this.fb.group({

      proveedor: ['', Validators.required],
      identificacion: ''
    })

  }
  ngOnInit(): void {
    this.producto()
    this.registrosCompras()
  }
  // SESION : 1 OBTENER PRODUCTO, PARA LUEGO SELCCIONARLO Y GUARDARLO EN LOCAL STORAGE...
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

  //SESION 3: OTNEMOS DATOS DEL CLIENTE Y MANDAMOS EL REGISTRO DE COMPRA

  enviarCompra() {
    const purchaseItems = this.prepararDatosParaAPI();
    const proveedor = this.proveedorForm.value.proveedor;
    const identificacion = this.proveedorForm.value.identificacion;

    const idenfic = identificacion.toString();




    console.log('compras Items:', purchaseItems);
    console.log('proveedor:', proveedor);
    console.log('identidicacion', identificacion)

    this.serviceCompra.enviarCompra(proveedor, idenfic, purchaseItems).subscribe({
      next: (response) => {
        console.log('compra enviada con éxito:', response);

        this.Idfactura = response.id
        console.log('Idfactura', this.Idfactura)



        this.serviceCompra.facturaCompra(this.Idfactura).subscribe({
          next: (facturaResponse) => {
            this.facturaCompra = facturaResponse;
            console.log('Factura compra obtenida:', this.facturaCompra);



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
        quantity: producto.quantity
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
        console.log('compras registros',this.registroCompras)

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
      this.pdf. generateFacturaPDF2(this.selctCompra);

    }, 500)

  }






}


// Preparar los productos para el formato correcto

  




