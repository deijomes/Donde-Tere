import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  implements OnInit{

  usuariosRegistrados: any []=[]


  constructor(private httpProfile:ProfileService){}
  ngOnInit(): void {
    this.obtenerUsuario();
    this.getUsuarios();
  }

  usuariObtenido = '';

  obtenerUsuario() {
    const usuario = localStorage.getItem('email');
  
    if (usuario) {
      this.usuariObtenido = usuario
      
    }
  }

  regitroUsuariol() {
    

    setTimeout(() => {

      const destino = document.getElementById('resgistro');
      if (destino) {

        destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  getUsuarios(){

    this.httpProfile.getUser().subscribe({
      next:(data) =>{

        this.usuariosRegistrados = data
        

      }
    })

  }

}
