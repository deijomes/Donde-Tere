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

  constructor(private router: Router, private bf: FormBuilder, private servicio : CredencialesService,
    private loadingService : LoadingService
  ) {
    this.credenciales = new UsuarioModel()

  }

 
  ngOnInit(): void {
    this.getforms()
    this.loadingService.init();

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
   
    if (usuario.rememberMe) {
      localStorage.setItem('email', usuario.email);
     
    } else {
      localStorage.removeItem('email');
      
    }

     // Verificamos si la respuesta contiene el email antes de guardarlo
    
    this.loadingService.show(); 

    this.servicio.login(usuario).subscribe(
      (resp: any) => {

        if (resp?.email) {
          localStorage.setItem('email', resp.email);
          
        } else {
          
        }
    
       
        if (resp && resp.token) {
          
    
          this.loadingService.hide(); 
    
          
          this.router.navigateByUrl('/home');
        } else {
         
          this.loadingService.hide(); 
        }
      },
      (error: any) => {
        console.error('Error al iniciar sesión:', error);
        this.loadingService.hide(); 
       
         Swal.fire({
                  title: 'error',
                  text: 'No se pudo iniciar sesión. Verifica tus credenciales e intenta nuevamente',
                  icon: 'info',
                  confirmButtonText: 'Entendido', // Cambia el texto del botón
                  confirmButtonColor: '#FF6F00' // Cambia el color del botón
                });
      }
    );
    
  }


}
