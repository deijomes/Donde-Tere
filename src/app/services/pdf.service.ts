import { Injectable } from '@angular/core';

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
        { text: 'Factura Detalles', style: 'header' },
        { text: `ID de la Factura: ${factura.id}`, style: 'subHeader' },
        { text: `Cliente: ${factura.customer.toUpperCase()}`, style: 'subHeader' },
        { text: `Fecha de Registro: ${new Date(factura.createdAt).toLocaleDateString('es-ES')}`, style: 'subHeader' },
        
        // Tabla con los productos
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Nombre del Producto', 'Cantidad', 'Precio', 'Subtotal'],
              ...factura.saleItems.map((item:any) => [
                item.product.name,
                item.quantity,
                `$${item.price}`,
                `$${item.subtotal}`
              ]),
              [{ text: 'Total de la Factura', colSpan: 3, alignment: 'right' }, {}, {}, `$${factura.total}`]
            ]
          }
        },
      ],
      styles: {
        header: { fontSize: 22, bold: true, margin: [0, 0, 0, 10] },
        subHeader: { fontSize: 14, margin: [0, 10] }
      }
    };

    // Crear y abrir el PDF
    pdfMake.createPdf(documentDefinition).open();
  }
}
