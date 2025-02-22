import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { BuscadorService } from '../../services/buscador.service';
import { registroModel } from '../../models/registroModel';
import { PdfService } from '../../services/pdf.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-inventario-general',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './inventario-general.component.html',
  styleUrl: './inventario-general.component.css'
})
export class InventarioGeneralComponent implements OnInit {


  productos:registroModel []= []; 
  productosFiltrados: registroModel[] = [];
  BusquedaActiva: boolean = false; 
  
  
  constructor( private servicio : BuscadorService, private pdf: PdfService, private loading:LoadingService){

    
    
  }
  ngOnInit(): void {

    this.loading.init();
    this.loading.show();
    this.loading.hide()
  
  }

    
   
    
  }




