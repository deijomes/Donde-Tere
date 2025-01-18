import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { registroModel } from '../../../models/registroModel';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-actualizar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './actualizar.component.html',
  styleUrls: ['./actualizar.component.css']
})
export class ActualizarComponent implements OnInit {
  registro: registroModel;
  actualizarForm!: FormGroup;
  formEnviado = false;
  codigo!: string;
  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activeRou: ActivatedRoute,
    private productoService: ProductoService
  ) {
    this.registro = new registroModel();
  }

  ngOnInit(): void {
    // Inicializamos el formulario
    this.getform();

    // Obtenemos el parámetro de la URL
    this.activeRou.params.subscribe(params => {
      this.codigo = params['codigo'];
      if (this.codigo) {
        // Buscamos el producto por código
        const producto = this.productoService.obtenerProducto(this.codigo);
        if (producto) {
          this.actualizarForm.patchValue(producto); // Actualizamos el formulario
        } else {
          console.error(`Producto con código ${this.codigo} no encontrado.`);
        }
      }
    });

  
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
      articulo: ['', Validators.required],
      codigo: ['', Validators.required],
      cantidadInicial: ['', Validators.required],
      cantidadMinima: ['', Validators.required],
      PvUnitario: ['', Validators.required],
      PcUnitario: ['', Validators.required]
    });
  }

  editar(): void {
    this.formEnviado = true;

    if (this.actualizarForm.valid) {
      const productoEditado: registroModel = { ...this.actualizarForm.value };

      this.productoService.editarProducto(this.codigo, productoEditado);
      this.router.navigateByUrl('productos');
      console.log('Producto editado:', productoEditado);
    } else {
      console.log('Formulario inválido');
    }
  }

  cancelar(): void {
    this.router.navigate(['/productos']);
  }

 
}
