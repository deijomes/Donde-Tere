import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { PoductService } from '../../services/poduct.service';

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
      p.codigo?.toLowerCase().includes(searchText.toLowerCase()) // Asegúrate que "codigo" exista en cada producto
    );
  }
}  

 


