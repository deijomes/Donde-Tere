import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { registerModel } from '../../../models/registerModel';
import { PoductService } from '../../../services/poduct.service';
import { InventarioComponent } from '../inventario/inventario.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']  
})
export class RegistrarComponent implements OnInit {

  registro: registerModel;
  registroForm!: FormGroup;
  formEnviado = false;
  productos: registerModel[] = []
 
  


  constructor(private bf: FormBuilder, private http:PoductService, private router: Router, private inventario:InventarioComponent) {
    this.registro = new registerModel(
      
    );
  }

  ngOnInit(): void {
    this.getform();  // Llamar a getform en ngOnInit
  }


  nombreNovalido() {
    return this.registroForm.get('name')?.invalid && (this.formEnviado || this.registroForm.get('code')?.touched);;
  }

  codigoNovalido() {
    return this.registroForm.get('code')?.invalid &&(this.formEnviado || this.registroForm.get('code')?.touched);
  }

 


  getform(): void {
    this.registroForm = this.bf.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      code: ['', Validators.required],
      category: ['', Validators.required],
      price: [ null, Validators.required],
      quantity: [ null, Validators.required],
      ingredients: [[]]
    });
  }

  guardar(): void {
    this.formEnviado = true;
  
    if (!this.registroForm.valid) {
      
      return; // Sale de la función si el formulario no es válido
    }
  
    const formData = this.registroForm.value;
    this.http.registroProducto(formData).subscribe({
      next: (response) => {
        
  
        // Mostrar alerta y esperar a que el usuario la vea antes de redirigir
        Swal.fire({
          title: '¡Éxito!',
          text: 'El producto ha sido guardado.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigateByUrl('productos');
          this.inventario.recargarTabla();
          this.inventario.registros();
        });
  
        this.registroForm.reset(); // Reiniciar formulario solo si la petición fue exitosa
      },
      error: (error) => {
        console.error('Error al registrar producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo registrar el producto.',
          icon: 'error'
        });
      }
    });
  }
  

  
  cancelar(): void {
    
    this.router.navigateByUrl('productos')
    
   
  }

}
