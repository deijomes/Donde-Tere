import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { registroModel } from '../../../models/registroModel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../../services/producto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']  // Corrección: Cambié `styleUrl` por `styleUrls`
})
export class RegistrarComponent implements OnInit {

  registro: registroModel;
  registroForm!: FormGroup;
  formEnviado = false;
  productos: registroModel[] = []
 


  constructor(private bf: FormBuilder, private productoService: ProductoService, private router: Router) {
    this.registro = new registroModel(
      
    );
  }

  ngOnInit(): void {
    this.getform();  // Llamar a getform en ngOnInit
  }


  nombreNovalido() {
    return this.registroForm.get('articulo')?.invalid && (this.formEnviado || this.registroForm.get('codigo')?.touched);;
  }

  codigoNovalido() {
    return this.registroForm.get('codigo')?.invalid &&(this.formEnviado || this.registroForm.get('codigo')?.touched);
  }

 


  getform(): void {
    this.registroForm = this.bf.group({
      articulo: ['', Validators.required],
      codigo: ['', [Validators.required]],
      cantidadInicial: ['', Validators.required],
      cantidadMinima: ['', Validators.required],
      PvUnitario: ['', Validators.required],
      PcUnitario: ['', Validators.required]
    });
  }

  guardar(): void {
    this.formEnviado = true;

    if (this.registroForm.valid) {
      const nuevoProducto: registroModel = { ...this.registroForm.value };
      this.productoService.agregarProducto(nuevoProducto);  // Usamos el servicio para agregar el producto
      this.router.navigateByUrl('productos');

      console.log('Producto agregado:', nuevoProducto);
      this.registroForm.reset();
    } else {
      console.log('Formulario inválido');
    }
  
  }

}
