import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../models/registerUsuario';
import { CommonModule } from '@angular/common';
import { CredencialesService } from '../../services/credenciales.service';
import Swal from 'sweetalert2';

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
  constructor(private router: Router, private bf: FormBuilder, private credenciales: CredencialesService) {

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
    // Si el formulario es inválido, no sigue con el registro
    if (!this.registroForm.valid) {
      
      return; // Sale de la función si el formulario no es válido
    }
  
    const usuario = this.registroForm.value;
  
    // Si el formulario es válido, se procede con el registro
    this.credenciales.nuevoUsuario(usuario).subscribe(
      (resp: any) => {
       
  
        // Verificamos si la respuesta contiene el email antes de guardarlo
       
  
        Swal.fire({
          title: 'Éxito',
          text: 'Registro exitoso',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          willClose: () => {
            this.router.navigateByUrl('/admin'); // Redirige a la página de inicio
          }
        });

      },
      (error: any) => {
        console.error('Error al registrar:', error);
         Swal.fire({
                          title: 'error',
                          text: 'Usuario existente',
                          icon: 'info',
                          confirmButtonText: 'Entendido', // Cambia el texto del botón
                          confirmButtonColor: '#FF6F00' // Cambia el color del botón
                        });
      }
    );
  
    
  }


  regitroUsuariol() {
    

    setTimeout(() => {

      const destino = document.getElementById('resgistro');
      if (destino) {

        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
  

  login() {
    this.router.navigateByUrl("login")
  }

}
