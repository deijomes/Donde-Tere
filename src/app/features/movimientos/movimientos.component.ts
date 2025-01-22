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
  salidaForm!: FormGroup


  constructor(private serviceproduct: BuscadorService, private bf: FormBuilder) { }


  ngOnInit(): void {


    this.getform();


    this.selectItem(this.selectedItem);
    // Obtiene la lista de productos desde el servicio
    this.isLoading = true;
    this.listaproducto = this.serviceproduct.getProductos();
    console.log('listado', this.listaproducto);

    // Inicializa la lista filtrada con todos los productos
    this.filteredProductos = this.listaproducto;
    this.isLoading = false;


    this.entradaForm.get('codigo')?.valueChanges.subscribe((codigo) => {
      const producto = this.listaproducto.find((p) => p.codigo === codigo);
      if (producto) {
        this.entradaForm.get('articulo')?.setValue(producto.articulo);
      } else {
        this.entradaForm.get('articulo')?.setValue('');
      }
    });



  }

  selectItem(item: string) {
    this.selectedItem = item;
    console.log('Item seleccionado:', this.selectedItem); // Verifica el valor

    if (this.entradaForm) {
      if (this.selectedItem === 'Entradas') {
        this.setMovimientoValue('entrada');
      } else if (this.selectedItem === 'Salidas') {
        this.setMovimientoValue('salida');
      }
    }
  }

  // Función que actualiza el valor de 'movimiento' en el formulario
  setMovimientoValue(value: string) {
    console.log('Actualizando movimiento a: ', value); // Verificar el valor
    this.entradaForm.patchValue({
      movimiento: value
    });
  }




  getform() {

    this.entradaForm = this.bf.group({
      codigo: [null],
      articulo: [{ value: '', disabled: false }],
      movimiento: [null],
      cantidad: ['', Validators.required],
      precioUnitario: ['', Validators.required],
      totalTransaccion: ['', Validators.required]

    })

  }

  getformsalida() {

    this.entradaForm = this.bf.group({
      codigo: [null],
      articulo: [{ value: '', disabled: false }],
      movimiento: [null],
      cantidad: ['', Validators.required],
      precioUnitario: ['', Validators.required],
      totalTransaccion: ['', Validators.required]

    })

  }

  onSubmit(): void {
    console.log(this.entradaForm.value);
    this.entradaForm.reset();

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