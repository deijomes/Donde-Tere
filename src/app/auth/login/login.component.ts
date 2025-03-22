import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UsuarioModel } from '../../models/registerUsuario';
import { CommonModule } from '@angular/common';
import { CredencialesService } from '../../services/credenciales.service';
import { LoadingService } from '../../services/loading.service';

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
  spinner = false
  botton = true

  constructor(private router: Router, private bf: FormBuilder, private servicio: CredencialesService,
    private loadingService: LoadingService
  ) {
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

      return; // Sale de la función si el formulario no es válido
    }

    const usuario = this.loguinForm.value;

    this.botton = false

    this.spinner = true

    if (usuario.rememberMe) {
      localStorage.setItem('email', usuario.email);

    } else {
      localStorage.removeItem('email');
    

    }

   

    // Verificamos si la respuesta contiene el email antes de guardarlo



    this.servicio.login(usuario).subscribe(
      (resp: any) => {
        if (resp?.email) {
          localStorage.setItem('email', resp.email);
          localStorage.setItem('role', resp.role);
          localStorage.setItem('name', resp.fullName);
        }
    
        if (resp?.token) {
          this.spinner = false;
    
          // Obtener el rol en mayúsculas para evitar errores de comparación
          const role = resp.role ? resp.role.toUpperCase() : '';
    
          console.log('Rol del usuario:', role); // Debugging
    
          // Redirigir según el rol
          if (role === 'USER') {
            this.router.navigateByUrl('/ventas');
          } else {
            this.router.navigateByUrl('/home');
          }
        }
      },
      (error: any) => {
        console.error('Error al iniciar sesión:', error);
    
        this.spinner = false;
        this.botton = true;
    
        Swal.fire({
          title: 'Error',
          text: 'No se pudo iniciar sesión. Verifica tus credenciales e intenta nuevamente',
          icon: 'info',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#FF6F00'
        });
      }
    );
    

  }




}
