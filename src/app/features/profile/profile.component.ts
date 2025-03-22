import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';



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
  eliminarUser(id: string) {
    if (!id) {
      console.error("ID no válido para eliminar usuariio.");
      Swal.fire("Error", "El ID del producto no es válido.", "error");
      return;
    }
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este usuario será eliminado de la lista.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#FF6F00', 
      cancelButtonColor: '#FF9800'
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpProfile.eliminarUser(id).subscribe({
          next: (response) => {
            console.log("usuario eliminado con éxito:", response);
  
            Swal.fire({
              title: '¡Éxito!',
              text: 'El usuario ha sido eliminado.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
  
            this.getUsuarios(); // Actualiza la lista después de eliminar
          },
          error: (error) => {
            console.error("Error al eliminar producto:", error);
  
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el producto.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        });
      }
    });
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
