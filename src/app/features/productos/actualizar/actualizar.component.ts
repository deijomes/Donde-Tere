import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { registerModel } from '../../../models/registerModel';
import { Subscription } from 'rxjs';
import { PoductService } from '../../../services/poduct.service';
import { InventarioComponent } from '../inventario/inventario.component';

@Component({
  selector: 'app-actualizar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ],
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.css']
})
export class ActualizarComponent implements OnInit {
  registro: registerModel;
  actualizarForm!: FormGroup;
  formEnviado = false;
  private paramsSubscription: Subscription | undefined;
  id :string = ''

  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRou: ActivatedRoute,
    private http : PoductService,
    private inventario : InventarioComponent,
   
  ) {
    this.registro = new registerModel();
  }

  ngOnInit(): void {
    // Inicializamos el formulario
    this.getform();

    this.activeRou.params.subscribe((params)=> {

      this.id = params['id'];
     

      this.cargarProdcuto();


    })
    
   
    

  
  }

  nombreNovalido() {
    return this.actualizarForm.get('articulo')?.invalid && (this.formEnviado || this.actualizarForm.get('codigo')?.touched);;
  }

  codigoNovalido() {
    return this.actualizarForm.get('codigo')?.invalid &&(this.formEnviado || this.actualizarForm.get('codigo')?.touched);
  }

 

  // Método para inicializar el formulario
  getform(): void {
    this.actualizarForm = this.fb.group({
      name: ['', Validators.required],
      
      code: ['', Validators.required],
      category: ['', Validators.required],
      price: [ null, Validators.required],
      quantity: [ null, Validators.required],
      ingredients: [[]]
    });
  }

  cargarProdcuto (){
    this.http.prodoctoEditar(this.id).subscribe({
      next: (producto) => this.actualizarForm.patchValue(producto)
    })

    error: (error:any) => {
      console.error('Error al cargar los datos del producto:', error);
      alert('No se pudo cargar la información del producto.');
      this.router.navigate(['/productos']); // Redirige en caso de error
    }
  };
  actualizarProducto(): void {
    this.formEnviado = true;
  
    if (this.actualizarForm.invalid) {
      
      return;
    }
  
    const productoActualizado = this.actualizarForm.value;
  
    this.http.EditarProducto(this.id, productoActualizado).subscribe({
      next: (response) => {
        
  
        Swal.fire({
          title: '¡Éxito!',
          text: 'El producto fue actualizado.',
          icon: 'success',
          timer: 2000, 
          showConfirmButton: false
        }).then(() => {
          this.inventario.recargarTabla(); 
          this.router.navigate(['/productos']); // 🔹 Navegación después de mostrar la alerta
        });
      },
      error: (error) => {
        console.error('Error al actualizar el producto:', error);
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al actualizar el producto.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
  
  cancelar(): void {
    this.router.navigate(['/productos']);
  }

 
}
