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
import { LoadingService } from '../../services/loading.service';

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
  productosSeleccion: any[] = [];
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


  constructor(private fb: FormBuilder, private serviceproduct: PoductService, private pdf: PdfService, private loading : LoadingService) {
    this.saleForm = this.fb.group({
      codigo: '',
      articulo: ['', Validators.required],
      cantidad: ['', Validators.required]
    });

    this.clienteForm = this.fb.group({
      cliente: [''],
      identificacion: ''
    })





  }

  ngOnInit(): void {
    this.loading.init();
    this.producto();
    
    this.obtenerSalidas()
    this.cargarProductosSeleccionados()



  }

  producto() {
    this.loading.show()
    this.serviceproduct.obtenerRegistros().subscribe({
      next: (response) => {
        this.productos = response.data; // Asegúrate de usar un punto y coma, no coma
        this.filteredProductos = [...this.productos];
        
      },
      error: (err) => {
        console.error('Error al obtener productos:', err);
          this.loading.hide()
      }, complete: () => {
        this.loading.hide()}
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

  filtrarPorNombreOCodigo(term: string, item: any): boolean {
    if (!term) {
        return true; // Si el término está vacío, muestra todos
    }

    const termLower = term.toLowerCase();

    // Filtro por nombre o código
    return item.name.toLowerCase().includes(termLower) ||
           item.code.toLowerCase().includes(termLower);
}

  productoSeleccionado(producto: any) {
    

    const productoCodigo = producto.code;
    

    // Buscar el producto usando el código
    const productoEncontrado = this.productos.find(p => p.code === productoCodigo);

    if (productoEncontrado) {
      this.saleForm.patchValue({
        articulo: productoEncontrado.name,
        cantidad: '',

      });
      
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
      const productoExistente = this.productosSeleccion.find(p => p.code === codigo);

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

        this.productosSeleccion.push(productoAAgregar);
        setTimeout(() => {

          const destino = document.getElementById('tablaDes');
          if (destino) {
    
            destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }

      // Guardar en localStorage
      localStorage.setItem('productosSeleccion', JSON.stringify(this.productosSeleccion));

      

      this.prodcutotabla = true;
      this.saleForm.reset();  // Reiniciar el formulario después de agregar
    } else {
      console.log('Producto no encontrado');
    }
  }


  cargarProductosSeleccionados() {
    const productosGuardados = localStorage.getItem('productosSeleccion');
    if (productosGuardados) {
      this.productosSeleccion = JSON.parse(productosGuardados); // Convertir de JSON a objeto
      
      this.prodcutotabla = true;
    }

  }

  enviarVenta() {
    const saleItems = this.prepararDatosParaAPI();
    const cliente = this.clienteForm.value.cliente;
    const identificacion = this.clienteForm.value.identificacion;

    const idenfic = identificacion.toString();

    


    

    this.loading.show();

    this.serviceproduct.enviarVenta(cliente, idenfic, saleItems).subscribe({
      next: (response) => {
        
        this.Idfactura = response.id
       this.loading.hide();



        this.serviceproduct.facturaVenta(this.Idfactura).subscribe({
          next: (facturaResponse) => {
            this.facturaVent = facturaResponse;
            



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

          setTimeout(() => {
            this.generatePDFF();
          }, 1000);
        });


        this.eliminarProductosGuardados();
        this.productosSeleccion = [];

        this.obtenerSalidas()
        this.prodcutotabla = false
        this.clienteForm.reset()

      },
      error: (err) => {
        console.error('Error al enviar la venta:', err);
        const mensajeError = err.error?.message || 'Hubo un problema al registrar la venta.';
        this.loading.hide()


        Swal.fire({

          text: mensajeError,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-success-btn'
          }
        });

      },
      complete: () => {
        this.loading.hide()
       
      }
    });



  }


  // Preparar los productos para el formato correcto
  prepararDatosParaAPI(): any[] {
    return this.productosSeleccion.map(producto => {
      return {
        productId: producto.id,
        quantity: producto.quantity
      };

    });


  }

  eliminarProductosGuardados() {
    localStorage.removeItem('productosSeleccion');
    
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
      confirmButtonText: 'Actualizar',
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
    const productosGuardados = localStorage.getItem('productosSeleccion');
    if (productosGuardados) {
      let productos = JSON.parse(productosGuardados);

      // Buscar el producto por su ID y actualizar la cantidad
      const index = productos.findIndex((p: any) => p.id === productId);
      if (index !== -1) {
        productos[index].quantity = nuevaCantidad;

        // Guardar los productos actualizados en localStorage
        localStorage.setItem('productosSeleccion', JSON.stringify(productos));

        // Actualizar la lista en el componente
        this.productosSeleccion = productos;

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

        let productos = JSON.parse(localStorage.getItem('productosSeleccion') || '[]');

        // 2️Eliminar el producto por su índice
        productos.splice(index, 1);


        localStorage.setItem('productosSeleccion', JSON.stringify(productos));


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

    return this.productosSeleccion.reduce((sum, producto) => {
      const totalProducto = producto.price * producto.quantity; // Total por producto
      return sum + totalProducto; // Sumar al total general
    }, 0);
  }

  obtenerSalidas() {
    this.serviceproduct.obtenerSalidas().subscribe({
      next: (Response) => {
        this.salidas = Response.data
        

      }
    })
  }

  detalle(salida: any) {

    this.selctSalida = salida
    console.log(this.selctSalida,' estas osn las salidas obtenidas')
    




  }


  generatePDF() {
    setTimeout(() => {
      this.pdf.generateFacturaPDF(this.selctSalida);

    }, 500)

  }

  generatePDFF() {
    this.pdf.generateFacturaPDF(this.facturaVent);
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
  cancelarventa() {

    localStorage.removeItem('productosSeleccion');
    
    this.productosSeleccion = []
    this.prodcutotabla = false

  }

}




