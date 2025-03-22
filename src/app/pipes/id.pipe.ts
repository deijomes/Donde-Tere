import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'id',
  standalone: true
})
export class IdPipe implements PipeTransform {

  transform(value: string): string {
    if (!value || value.length < 12) return value; 
    return value.slice(-12); 
  }

}
