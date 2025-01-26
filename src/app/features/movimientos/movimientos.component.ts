import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BuscadorService } from '../../services/buscador.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { registroModel } from '../../models/registroModel';





@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule,],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],

  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MovimientosComponent implements OnInit {

  selectedItem: string = 'Entradas';



  listaproducto: any[] = []

  filteredProductos: any[] = [];
  mensajeNoEncontrado: string =''
  
  

  searchTerm: string = '';
  isLoading: boolean = false;


  entradaForm!: FormGroup
  salidadForm!: FormGroup


  constructor(private serviceproduct: BuscadorService, private bf: FormBuilder) { }

  ngOnInit(): void {
    this.getform(); // Inicializa el formulario de entrada
    this.getforms(); // Inicializa el formulario de salida
  
    this.selectItem(this.selectedItem);
  
    // Obtiene la lista de productos desde el servicio
    this.isLoading = true;
    this.listaproducto = this.serviceproduct.getProductos();
    console.log('Listado de productos:', this.listaproducto);
  
    
    this.isLoading = false;
  
    // Maneja los cambios en el campo "codigo" del formulario de entrada
    this.entradaForm.get('codigo')?.valueChanges.subscribe((codigo) => {
      const producto = this.listaproducto.find((p) => p.codigo === codigo);
      if (producto) {
        this.entradaForm.patchValue({
          articulo: producto.articulo,
        });
      } else {
        this.entradaForm.patchValue({
          articulo: '',
        });
      }
    });
  
    // Maneja los cambios en el campo "codigo" del formulario de salida
    
   /* this.salidadForm.get('codigo')?.valueChanges.subscribe((codigo) => {
      const producto = this.listaproducto.find((p) => p.codigo === codigo);
      if (producto) {
        this.salidadForm.patchValue({
          articulo: producto.articulo,
        });
      } else {
        this.salidadForm.patchValue({
          articulo: '',
        });
      }
    });
    */
  } 
  
  selectItem(item: string): void {
    this.selectedItem = item;
  }
  
  getform(): void {
    this.entradaForm = this.bf.group({
      codigo: [null],
      articulo: [{ value: '', disabled: false }],
      movimiento: ['entrada'], // Valor predeterminado
      fecharegistro: ['',Validators.required],
      cantidad: ['', Validators.required],
      precioUnitario: ['', Validators.required],
      totalTransaccion: ['', Validators.required],
    });
  
    console.log('Formulario de entrada inicializado:', this.entradaForm.value);
  }
  
  getforms(): void {
    this.salidadForm = this.bf.group({
      codigo: ['',Validators.required],
      articulo: ['',Validators.required],
     
    });
  
    console.log('Formulario de salida inicializado:', this.salidadForm.value);
  }
  
  onSubmit(): void {
    console.log('Datos del formulario de entrada:', this.entradaForm.value);
  
    // Resetea el formulario de entrada con valores predeterminados
    this.entradaForm.reset({
      codigo: '',
      articulo: '',
      movimiento: 'entrada',
      fecharegistro:'',
      cantidad: '',
      precioUnitario: '',
      totalTransaccion: '',
    });
  
    console.log('Formulario de entrada reseteado:', this.entradaForm.value);
  }
  
  onSubmitt(): void {

    
      const codigo = this.salidadForm.get('codigo')?.value;
      const articulo = this.salidadForm.get('articulo')?.value;
    
      // Llamar al servicio y pasar los valores como parámetros
      this.serviceproduct.buscarArticulo(codigo, articulo).subscribe(
        (resultado: any) => {
          console.log('Resultado del servicio:', resultado);
          if (resultado) {
            this.filteredProductos = [resultado]
            this.mensajeNoEncontrado = '';
            
          } else {
            console.log('Artículo no encontrado');
            this.filteredProductos = [];  // Limpiamos los productos filtrados
            this.mensajeNoEncontrado = 'No se encontraron productos que coincidan con tu búsqueda.';  // Asignamos el mensaje
           
          }
        },
        (error: any) => {
          console.error('Error al buscar el artículo:', error);
        }
      );
  
    // Resetea el formulario de salida con valores predeterminados
    this.salidadForm.reset({
      codigo: '',
      articulo: '',
    });
  
  }

  onSelectProducto(producto: any): void {
    console.log('Producto seleccionado:', producto);
    if (this.filteredProductos.length > 0) {
      // Vaciar la lista después de seleccionar el producto
      this.filteredProductos = [];
    }


    if (producto) {
      this.entradaForm.patchValue({
        codigo: producto.codigo,
        articulo: producto.articulo,
        precioUnitario: producto.precio,
        cantidad: '', // valor por defecto
        totalTransaccion: producto.precio, // si es necesario
      });

      console.log('Formulario después de patchValue:', this.entradaForm.value);
    }
  

  }
  

  





}