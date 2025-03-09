import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-user',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-user.component.html',
  styleUrl: './editar-user.component.css'
})
export class EditarUserComponent implements OnInit {


  id: string = '';
  usuarios: any[] = [];
  actualizarForm!: FormGroup;

  constructor(private activeRou: ActivatedRoute, private fb: FormBuilder, private http: ProfileService) {


  }
  ngOnInit(): void {
    this.activeRou.params.subscribe((params) => {

      this.id = params['id'];
      

    })

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
      password: ['', Validators.required],
      role: ['', Validators.required],
      fullName: ['', Validators.required],

    });
  }

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

    this.http.EditarUser(this.id, formu).subscribe({
      next: (response) => {




        Swal.fire({
          title: '¡Éxito!',
          text: 'Uusuario actualizado.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {

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
      }
    })








  }
}
