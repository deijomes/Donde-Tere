import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  implements OnInit{
  ngOnInit(): void {
    this.obtenerUsuario()
  }

  usuariObtenido = '';

  obtenerUsuario() {
    const usuario = localStorage.getItem('email');
  
    if (usuario) {
      this.usuariObtenido = usuario
      console.log(this.usuariObtenido)
    }
  }

}
