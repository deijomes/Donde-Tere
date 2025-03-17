import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
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

 
  

  usuariosRegistrados: any []=[];
  userId : string ='';
  tablaUsuario = false;
  usuariObtenido = '';
  rol = ''


  constructor(private httpProfile:ProfileService, private router:Router,){}
  ngOnInit(): void {
    
    this.obtenerUsuario();
    
    this.getUsuarios();
  }



  obtenerUsuario() {
    const usuario = localStorage.getItem('name');
  
    if (usuario) {
      this.usuariObtenido = usuario
      
    }
  }

  obtenerRol() {
    const usuario = localStorage.getItem('role');
  
    if (usuario) {
      this.rol = usuario
      
    }
  }



  regitroUsuariol() {
    
    this.tablaUsuario = false
    

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

  editarUser(id:string){

    this.userId = id
    this.router.navigateByUrl(`/admin/editar/${id}`)
    this.tablaUsuario = false
    
  }

  tablaUser(){

    this.getUsuarios();
    this.tablaUsuario =  true
    this.router.navigateByUrl(`admin`)
    
    

    setTimeout(()=>{
      const tablaDestino = document.getElementById('tab');
      if(tablaDestino){
        tablaDestino.scrollIntoView({behavior:'smooth', block:'start'});
      }
    },100)

  }

}
