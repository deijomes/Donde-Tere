import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {

  private translations = new Map<string, string>([
    ['PURCHASE', 'COMPRA'],
    ['SALE', 'VENTA'],
    ['RETURN', 'DEVOLUCIÓN'],
    
  ]);

  transform(value: string): string {
    if (!value) return ''; // Retorna vacío si el valor es null o undefined
    return this.translations.get(value.toUpperCase()) || value; // Retorna la traducción o la palabra original
  }

}
