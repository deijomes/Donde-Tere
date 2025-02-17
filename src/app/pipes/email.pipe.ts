import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'email',
  standalone: true
})
export class EmailPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';  // Si el valor es vacío o null, devuelve un string vacío
    const emailParts = value.split('@');  // Divide el correo en dos partes usando '@'
    return emailParts[0];  // Devuelve la primera parte (antes del '@')
  }
  }

 


