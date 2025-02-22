import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailsplit',
  standalone: true
})
export class EmailsplitPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';  
    const emailParts = value.split('@');  
    return emailParts[0];  
  }
  

}
