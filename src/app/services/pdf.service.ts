import { Injectable } from '@angular/core';
import { IdPipe } from '../pipes/id.pipe';

declare var pdfMake: any;




@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {
    // Asignar las fuentes virtuales
    (pdfMake as any).vfs = pdfMake.vfs;
  }

  generateFacturaPDF(factura: any) {
    const documentDefinition = {
      content: [
        // Logo (Si quieres incluir un logo, añade la propiedad `image`)
        // { image: 'path_to_logo', width: 100, alignment: 'center' },
    
        // Título
        { text: 'Factura', style: 'header' },
    
        // Información de la Factura
        {
          text: `ID de la Factura: ${factura.id.slice(-12)}`,
          style: 'subHeaderBold'
        },
        {
          text: `Fecha de Registro: ${new Date(factura.createdAt).toLocaleDateString('es-ES')}`,
          style: 'subHeader'
        },
    
        // Información del Cliente
        { text: 'Cliente:', style: 'subHeaderBold' },
        { text: factura.customer.toUpperCase(), style: 'customerName' },
    
        // Tabla de Productos
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Nombre del Producto', style: 'tableHeader', alignment: 'left' },
                { text: 'Cantidad', style: 'tableHeader' },
                { text: 'Precio', style: 'tableHeader' },
                { text: 'Subtotal', style: 'tableHeader' }
              ],
              ...factura.saleItems.map((item: any) => [
                { text:capitalizeFirstLetter(item.product.name), style: 'tableCellLeft' }, // Alineado a la izquierda
                { text: item.quantity.toString(), style: 'tableCellCenter' }, // Alineado al centro
                { text: `$${item.price}`, style: 'tableCellCenter' }, // Alineado al centro
                { text: `$${item.subtotal}`, style: 'tableCellCenter' } // Alineado al centro
              ]),
              [
                { text: 'Total de la Factura', colSpan: 3, style: 'tableTotal', alignment: 'right' },
                {}, {}, `$${factura.total}`
              ]
            ]
          },
          layout: 'lightHorizontalLines', // Líneas horizontales suaves para la tabla
        },
    
        
        { text: 'Información de la Empresa', style: 'footerTitle' },
        { text: 'Nombre de la Empresa', style: 'footerText' },
        { text: 'Dirección de la Empresa', style: 'footerText' },
        { text: 'Teléfono: (XXX) XXX-XXXX', style: 'footerText' },
        { text: 'Email: contacto@empresa.com', style: 'footerText' },
      ],
      styles: {
        header: {
          fontSize: 15,
          bold: true,
          alignment: 'right', // Alineación a la derecha
          margin: [0, 0, 0, 20],
          
        },
        subHeader: {
          fontSize: 12,
          margin: [0, 5],
          alignment: 'left',
         
        },
        subHeaderBold: {
          fontSize: 12,
          margin: [0, 10], // Espacio mayor entre secciones
          bold: true, // Subtítulo en negrita
          alignment: 'left',
       
        },
        customerName: {
          fontSize: 12,
          margin: [0, 0, 0, 10],
          alignment: 'left',
         
        },
        footerTitle: {
          fontSize: 12,
          bold: true,
          margin: [0, 20, 0, 5],
          alignment: 'left',
       
        },
        footerText: {
          fontSize: 10,
          margin: [0, 0, 0, 2],
          alignment: 'left',
         
        },
        tableHeader: {
          fontSize: 12,
          bold: true,
          fillColor: '#f0f0f0', // Fondo gris claro
          margin: [0, 5, 0, 5],
          alignment: 'center',
          
          color: '#333' // Color de texto oscuro
        },
        tableCellLeft: {
          fontSize: 10,
          margin: [0, 5],
          alignment: 'left', // Alineación a la izquierda
          
          color: '#333' // Color de texto oscuro
        },
        tableCellCenter: {
          fontSize: 10,
          margin: [0, 5],
          alignment: 'center', // Alineación al centro
         
          color: '#333' // Color de texto oscuro
        },
        tableTotal: {
          fontSize: 12,
          bold: true,
          margin: [0, 10],
          alignment: 'right',
          
          color: '#333' // Color de texto oscuro
        }
      }
    };
    
    
    
    
    
    // Crear y abrir el PDF
    pdfMake.createPdf(documentDefinition).open();
    
    function capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
   
  }

  
}
