import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { BuscadorService } from '../../services/buscador.service';
import { NgSelectModule } from '@ng-select/ng-select';





@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule,],

  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MovimientosComponent implements OnInit {

  selectedItem: string = 'Entradas';



  listaproducto: any[] = []
  filteredProductos: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;


  entradaForm!: FormGroup
  salidadForm!: FormGroup


  constructor(private serviceproduct: BuscadorService, private bf: FormBuilder) { }

  ngOnInit(): void {
    this.getform(); // Inicializa el formulario de entrada
    this.getformsalida(); // Inicializa el formulario de salida
  
    this.selectItem(this.selectedItem);
  
    // Obtiene la lista de productos desde el servicio
    this.isLoading = true;
    this.listaproducto = this.serviceproduct.getProductos();
    console.log('Listado de productos:', this.listaproducto);
  
    // Inicializa la lista filtrada con todos los productos
    this.filteredProductos = this.listaproducto;
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
    this.salidadForm.get('codigo')?.valueChanges.subscribe((codigo) => {
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
  }
  
  selectItem(item: string): void {
    this.selectedItem = item;
  }
  
  getform(): void {
    this.entradaForm = this.bf.group({
      codigo: [null],
      articulo: [{ value: '', disabled: false }],
      movimiento: ['entrada'], // Valor predeterminado
      cantidad: ['', Validators.required],
      precioUnitario: ['', Validators.required],
      totalTransaccion: ['', Validators.required],
    });
  
    console.log('Formulario de entrada inicializado:', this.entradaForm.value);
  }
  
  getformsalida(): void {
    this.salidadForm = this.bf.group({
      codigo: [null],
      articulo: [{ value: '', disabled: false }],
      movimiento: ['salida'], // Valor predeterminado
      cantidad: ['', [Validators.required, ]],
      precioUnitario: ['', [Validators.required]],
      totalTransaccion: ['', [Validators.required]],
    });
  
    console.log('Formulario de salida inicializado:', this.salidadForm.value);
  }
  
  onSubmit(): void {
    console.log('Datos del formulario de entrada:', this.entradaForm.value);
  
    // Resetea el formulario de entrada con valores predeterminados
    this.entradaForm.reset({
      codigo: null,
      articulo: '',
      movimiento: 'entrada',
      cantidad: '',
      precioUnitario: '',
      totalTransaccion: '',
    });
  
    console.log('Formulario de entrada reseteado:', this.entradaForm.value);
  }
  
  onSubmitt(): void {
    console.log('Datos del formulario de salida:', this.salidadForm.value);
  
    // Resetea el formulario de salida con valores predeterminados
    this.salidadForm.reset({
      codigo: null,
      articulo: '',
      movimiento: 'salida',
      cantidad: '',
      precioUnitario: '',
      totalTransaccion: '',
    });
  
    console.log('Formulario de salida reseteado:', this.salidadForm.value);
  }
  

  // Filtra los productos según el término de búsqueda
  filterProductos(): void {
    this.filteredProductos = this.listaproducto.filter(codigo =>
      codigo.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Función que se ejecuta cuando se selecciona un producto
  onProductChange(event: any): void {
    console.log('Producto seleccionado:', event);
  }






}