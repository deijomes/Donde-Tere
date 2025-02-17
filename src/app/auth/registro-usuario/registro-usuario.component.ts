import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../models/registerUsuario';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.css'
})
export class RegistroUsuarioComponent implements OnInit {



  registro: UsuarioModel
  registroForm!: FormGroup
  constructor(private router: Router, private bf: FormBuilder) {

    this.registro = new UsuarioModel()

  }
  ngOnInit(): void {
    this.getform()
  }

  getform(): void {
    this.registroForm = this.bf.group({


      fullName: ['', [
        Validators.required,
        Validators.pattern(/^[A-Z][a-zA-Z\s]*$/) // Primera letra mayúscula y solo letras/espacios
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/) // Requisitos de seguridad
      ]]


    });


  }

  get fullName() { return this.registroForm.get('fullName'); }
  get email() { return this.registroForm.get('email'); }
  get password() { return this.registroForm.get('password'); }

  guardar(): void {


    if (!this.registroForm.valid) {
      console.log('Formulario inválido');
      return; // Sale de la función si el formulario no es válido
    }

    console.log(this.registroForm.value)


  }


  login() {
    this.router.navigateByUrl("login")
  }

}
