import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { registroModel } from '../../../models/registroModel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']  // Corrección: Cambié `styleUrl` por `styleUrls`
})
export class RegistrarComponent implements OnInit {

  registro: registroModel;
  registroForm!: FormGroup;

  constructor(private bf: FormBuilder) {
    this.registro = new registroModel();
  }

  ngOnInit(): void {
    this.getform();  // Llamar a getform en ngOnInit
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
    if (this.registroForm.valid) {
      console.log('Formulario válido:', this.registroForm.value);
      
    } else {
      console.log('Formulario inválido');
      
    }
  }

}
