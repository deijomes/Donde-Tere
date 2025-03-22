import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'texto',
  standalone: true
})
export class TextoSpañolPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    // Reemplazo de patrones comunes en alertas
    return value
      .replace(/Low stock alert:/gi, 'Alerta de bajo stock:')
      .replace(/Product "(.*?)" has only (\d+) units left \(threshold: (\d+)\)\./gi,
        'El producto "$1" tiene solo $2 unidades disponibles (mínimo permitido: $3).');
  }

}
