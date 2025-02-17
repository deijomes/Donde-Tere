import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../models/registerUsuario';
import { CommonModule } from '@angular/common';
import { CredencialesService } from '../../services/credenciales.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {


  credenciales: UsuarioModel
  loguinForm!: FormGroup

  constructor(private router: Router, private bf: FormBuilder, private servicio : CredencialesService) {
    this.credenciales = new UsuarioModel()

  }
  ngOnInit(): void {
    this.getforms()

  }

  registro() {

    this.router.navigateByUrl("register")

  }

  getforms(): void {
    this.loguinForm = this.bf.group({
      email: [localStorage.getItem('email') || '', Validators.required],
      password: ['', Validators.required],
      rememberMe: [localStorage.getItem('email') ? true : false] // Carga el valor de localStorage
    });
  }

  loguearse(): void {
    // Si el formulario es inválido, no sigue con el registro
    if (!this.loguinForm.valid) {
      console.log('Formulario inválido');
      return; // Sale de la función si el formulario no es válido
    }

    const usuario = this.loguinForm.value;
    console.log(usuario);

    if (usuario.rememberMe) {
      localStorage.setItem('email', usuario.email);
     
    } else {
      localStorage.removeItem('email');
      
    }

    this.servicio.login(usuario).subscribe(
      (resp: any) => {
        console.log('Respuesta del login:', resp);  // Verifica la respuesta
        if (resp && resp.token) {
          console.log('Token recibido:', resp.token); // Verifica el token recibido
          // Guarda el token si está presente
        
          Swal.fire({
            title: 'Inicio de sesión Exitoso',
            text: 'Has iniciado sesión correctamente',
            icon: 'success', 
            timer: 4000, 
            timerProgressBar: true, 
            willClose: () => {
              this.router.navigateByUrl('/home');
            }
          });
        } else {
          console.error('No se recibió el token en la respuesta');
        }
      },
      (error: any) => {
        console.error('Error al iniciar sesión:', error);
        Swal.fire('Error', 'No se pudo iniciar sesión. Verifica tus credenciales e intenta nuevamente', 'error');
      }
    );
  }


}
