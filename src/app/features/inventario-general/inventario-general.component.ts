import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-inventario-general',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './inventario-general.component.html',
  styleUrl: './inventario-general.component.css'
})
export class InventarioGeneralComponent {


  productos: { producto: String; codigo: String; cantidadInicial: Number; cantidadMinima: Number ; entrada: Number; salida: Number; cantidadActual: Number }[] = [
    {
      producto: 'Arroz',
      codigo: 'AR001',
      cantidadInicial: 50,
      cantidadMinima: 10,
      entrada: 20,
      salida: 15,
      cantidadActual: 55
    },
    {
      producto: 'Frijoles',
      codigo: 'FR002',
      cantidadInicial: 40,
      cantidadMinima: 8,
      entrada: 10,
      salida: 5,
      cantidadActual: 45
    },
    {
      producto: 'Aceite',
      codigo: 'AC003',
      cantidadInicial: 30,
      cantidadMinima: 5,
      entrada: 15,
      salida: 10,
      cantidadActual: 35
    },
    {
      producto: 'Azúcar',
      codigo: 'AZ004',
      cantidadInicial: 60,
      cantidadMinima: 12,
      entrada: 25,
      salida: 20,
      cantidadActual: 65
    },
    {
      producto: 'Harina',
      codigo: 'HA005',
      cantidadInicial: 45,
      cantidadMinima: 10,
      entrada: 18,
      salida: 12,
      cantidadActual: 51
    },
    {
      producto: 'Sal',
      codigo: 'SA006',
      cantidadInicial: 35,
      cantidadMinima: 6,
      entrada: 10,
      salida: 8,
      cantidadActual: 37
    }
  ];
  constructor(){
    
    
  }

}
