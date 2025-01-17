import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { registroModel } from '../../../models/registroModel';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule,  RouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit{

  productos: registroModel[] = [];
  tabla:boolean = true;
  mostrarTabla : boolean = true

  constructor(private productoService: ProductoService , private router: Router) {

   
  }

  ngOnInit(): void {

    this.verificarRuta();

    // Nos suscribimos a cambios en las rutas para actualizar la bandera
    this.router.events.subscribe(() => {
      this.verificarRuta();
    });

    // Nos suscribimos al observable de productos para actualizar la vista automáticamente
    this.productoService.productos$.subscribe((productos) => {
      this.productos = productos;
      
    });
  }

  eliminar(codigo: string): void {
    this.productoService.eliminarProducto(codigo);  // Llamar al servicio para eliminar el producto
  }

  actualizar(codigo: string | number): void {
    const codigoString = codigo.toString(); // Convertir a cadena
    console.log('Código recibido como string:', codigoString);
    this.router.navigate([`productos/actualizar/${codigoString}`]);
  }
  registro() {
    this.router.navigateByUrl('productos/registrar');
   
  }
  verificarRuta(): void {
    
    const rutaActual = this.router.url;

    
    const registrarActivo = rutaActual.startsWith('/productos/registrar');

   
    const actualizarActivo = rutaActual.startsWith('/productos/actualizar/');

   
    this.mostrarTabla = !(registrarActivo || actualizarActivo);
  }

  

  

}
