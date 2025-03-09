import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from '../profile.component';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-editar-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './editar-user.component.html',
  styleUrl: './editar-user.component.css'
})
export class EditarUserComponent implements OnInit {


  id: string = '';
  usuarios: any[] = [];
  actualizarForm!: FormGroup;

  constructor(private activeRou: ActivatedRoute, private fb: FormBuilder, private http: ProfileService,
     private router:Router, private profile:ProfileComponent,private loadingService: LoadingService) {


  }
  ngOnInit(): void {
    this.activeRou.params.subscribe((params) => {

      this.id = params['id'];
      

    })

    this.loadingService.init();

    this.getUser();

    this.getform();


  }

  getUser() {
    this.http.getUser().subscribe({
      next: (data) => {

        this.usuarios = data;
        this.cargarUser()


      }
    })
  }

  getform(): void {
    this.actualizarForm = this.fb.group({
     
      email: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/) // Requisitos de seguridad
      ]],

      role: ['', Validators.required],
      fullName: ['', Validators.required],

    });
  }
  get password() { return this.actualizarForm.get('password'); }

  cargarUser() {
    const user = this.usuarios.find((p) => String(p.id) === this.id);
    

    if (user) {

      this.actualizarForm.patchValue({
        
        email: user.email,
        password: user.password,
        role: user.role,
        fullName: user.fullName,

      });
    } else {
      console.log('Producto no encontrado');
    }
  }

  guardarCambios() {
    
    
    const formu = this.actualizarForm.value
    console.log(formu,'daros formulario a enviar')

    this.loadingService.show();

    this.http.EditarUser(this.id, formu).subscribe({
      next: (response) => {




        Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario actualizado.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.loadingService.hide();

          this.router.navigateByUrl('/admin')
          this.profile.getUsuarios();
          this.profile.tablaUsuario =true
        });
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al actualizar usuario.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.loadingService.hide();
      }
    })








  }
}
