import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../services/profile.service';

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
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],

    });
  }

  cargarUser() {
    const user = this.usuarios.find((p) => String(p.id) === this.id);
    console.log(user)

    if (user) {

      this.actualizarForm.patchValue({
        fullName: user.fullName,
        email: user.email,
        password: user.password,
        role: user.role

      });
    } else {
      console.log('Producto no encontrado');
    }
  }








}
