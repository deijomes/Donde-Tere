import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


declare var pdfMake: any;




@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor(private http: HttpClient) {
    // Asignar las fuentes virtuales
    (pdfMake as any).vfs = pdfMake.vfs;
  }

  

  convertirImagenABase64(ruta: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(ruta, { responseType: 'blob' }).subscribe({
        next: blob => {
          const lector = new FileReader();
          lector.onloadend = () => resolve(lector.result as string);
          lector.onerror = reject;
          lector.readAsDataURL(blob);
        },
        error: reject
      });
    });
  }


  generateFacturaPDF(factura: any, imagenBase64: any) {
    const documentDefinition = {

      background: [
        {
          image: imagenBase64,
          width: 595.28, // Ancho en puntos para A4
          height: 841.89, // Alto en puntos para A4
          absolutePosition: { x: 0, y: 0 } // Posición en la esquina superior izquierda
        },
       
      ],
      
      content: [

        { text: '', margin: [0, 40] },
       
  
        // Información de la Factura
        { text: `ID de la Factura: ${factura.id.slice(-12)}`, style: 'subHeaderBold' },
        { text: `Fecha de Registro: ${new Date(factura.createdAt).toLocaleDateString('es-ES')}`, style: 'subHeader' },
  
        // Información del Cliente
        { text: factura.customer?.toUpperCase() || 'N/A', style: 'customerName' },
        { text: 'Identificación:', style: 'subHeaderBold' },
        { text: (factura.identification?.toUpperCase() ?? 'N/A'), style: 'customerName' },
        
  
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
                { text: capitalizeFirstLetter(item.product.name), style: 'tableCellLeft' },
                { text: item.quantity.toString(), style: 'tableCellCenter' },
                { text: `$${item.price}`, style: 'tableCellCenter' },
                { text: `$${item.subtotal}`, style: 'tableCellCenter' }
              ]),
              [
                { text: 'Total de Productos', colSpan: 3, style: 'tableTotal', alignment: 'right' },
                {}, {}, `$${factura.total}`
              ]
            ]
          },
          layout: 'lightHorizontalLines',
        },
  
        // Espacio entre tablas
        { text: '', margin: [0, 10] },
  
        // Tabla de Suministros (Si hay suministros)
        ...(factura.supplyItems && factura.supplyItems.length > 0
          ? [
              { text: 'Suministros', style: 'subHeaderBold', margin: [0, 10, 0, 5] },
              {
                table: {
                  headerRows: 1,
                  widths: ['*', 'auto', 'auto', 'auto'],
                  body: [
                    [
                      { text: 'Nombre del producto', style: 'tableHeader', alignment: 'left' },
                      { text: 'Cantidad', style: 'tableHeader' },
                      { text: 'Precio', style: 'tableHeader' },
                      { text: 'Subtotal', style: 'tableHeader' }
                    ],
                    ...factura.supplyItems.map((item: any) => [
                      { text: capitalizeFirstLetter(item.description), style: 'tableCellLeft' },
                      { text: item.quantity.toString(), style: 'tableCellCenter' },
                      { text: `$${item.price}`, style: 'tableCellCenter' },
                      { text: `$${item.subtotal}`, style: 'tableCellCenter' }
                    ]),
                    [
                      { text: 'Total', colSpan: 3, style: 'tableTotal', alignment: 'right' },
                      {}, {}, `$${factura.total}`
                    ]
                  ]
                },
                layout: 'lightHorizontalLines',
              }
            ]
          : []),
  
        
      ],
      styles: {
        header: { fontSize: 15, bold: true, alignment: 'right', margin: [0, 0, 0, 20] },
        subHeader: { fontSize: 12, margin: [0, 5], alignment: 'left' },
        subHeaderBold: { fontSize: 12, margin: [0, 10], bold: true, alignment: 'left' },
        customerName: { fontSize: 12, margin: [0, 0, 0, 10], alignment: 'left' },
        footerTitle: { fontSize: 12, bold: true, margin: [0, 20, 0, 5], alignment: 'left' },
        footerText: { fontSize: 10, margin: [0, 0, 0, 2], alignment: 'left' },
        tableHeader: { fontSize: 12, bold: true, fillColor: '#f0f0f0', alignment: 'center', color: '#333' },
        tableCellLeft: { fontSize: 10, alignment: 'left', color: '#333' },
        tableCellCenter: { fontSize: 10, alignment: 'center', color: '#333' },
        tableTotal: { fontSize: 12, bold: true, alignment: 'right', color: '#333' }
      }
    };
  
    // Generar PDF
    pdfMake.createPdf(documentDefinition).open();
  
    function capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
  


  generateFacturaPDF2(factura: any,  imagenBase64: any) {
    const documentDefinition: any = {

      background: [
        {
          image: imagenBase64,
          width: 595.28, // Ancho en puntos para A4
          height: 841.89, // Alto en puntos para A4
          absolutePosition: { x: 0, y: 0 } // Posición en la esquina superior izquierda
        },
       
      ],
     
      content: [
        { text: '', margin: [0, 40] },
        
        { text: `ID de la Factura: ${factura.id.slice(-12)}`, style: 'subHeaderBold' },
        { text: `Fecha de Registro: ${new Date(factura.createdAt).toLocaleDateString('es-ES')}`, style: 'subHeader' },
        
        
        { text: 'Proveedor:', style: 'subHeaderBold' },
        { text: (factura.supplier?.toUpperCase() ?? 'N/A'), style: 'customerName' },
        
        { text: 'Identificación:', style: 'subHeaderBold' },
        { text: (factura.identification?.toUpperCase() ?? 'N/A'), style: 'customerName' },
        
      ],
      styles: {
        header: { fontSize: 15, bold: true, alignment: 'right', margin: [0, 0, 0, 20] },
        subHeader: { fontSize: 12, margin: [0, 5], alignment: 'left' },
        subHeaderBold: { fontSize: 12, margin: [0, 10], bold: true, alignment: 'left' },
        customerName: { fontSize: 12, margin: [0, 0, 0, 10], alignment: 'left' },
        footerTitle: { fontSize: 12, bold: true, margin: [0, 20, 0, 5], alignment: 'left' },
        footerText: { fontSize: 10, margin: [0, 0, 0, 2], alignment: 'left' },
        tableHeader: { fontSize: 12, bold: true, fillColor: '#f0f0f0', alignment: 'center', color: '#333' },
        tableCellLeft: { fontSize: 10, alignment: 'left', color: '#333' },
        tableCellCenter: { fontSize: 10, alignment: 'center', color: '#333' },
        tableTotal: { fontSize: 12, bold: true, alignment: 'right', color: '#333' }
      }
    };
  
    // Validar si `purchaseItems` tiene elementos
    if (factura.purchaseItems && factura.purchaseItems.length > 0) {
      documentDefinition.content.push({
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
            ...factura.purchaseItems.map((item: any) => [
              { text: capitalizeFirstLetter(item.product.name), style: 'tableCellLeft' },
              { text: item.quantity.toString(), style: 'tableCellCenter' },
              { text: `$${item.price}`, style: 'tableCellCenter' },
              { text: `$${item.subtotal}`, style: 'tableCellCenter' }
            ]),
            [
              { text: 'Total de la Factura', colSpan: 3, style: 'tableTotal', alignment: 'right' },
              {}, {}, `$${factura.total}`
            ]
          ]
        },
        layout: 'lightHorizontalLines',
      });
    }
  
    // Validar si `supplyItems` tiene elementos
    if (factura.supplyItems && factura.supplyItems.length > 0) {
      documentDefinition.content.push({
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Nombre del Suministro', style: 'tableHeader', alignment: 'left' },
              { text: 'Cantidad', style: 'tableHeader' },
              { text: 'Precio', style: 'tableHeader' },
              { text: 'Subtotal', style: 'tableHeader' }
            ],
            ...factura.supplyItems.map((item: any) => [
              { text: capitalizeFirstLetter(item.description), style: 'tableCellLeft' },
              { text: item.quantity.toString(), style: 'tableCellCenter' },
              { text: `$${item.price}`, style: 'tableCellCenter' },
              { text: `$${item.subtotal}`, style: 'tableCellCenter' }
            ]),
            [
              { text: 'Total', colSpan: 3, style: 'tableTotal', alignment: 'right' },
              {}, {}, `$${factura.total}`
            ]
          ]
        },
        layout: 'lightHorizontalLines',
      });
    }
  
    // Información de la Empresa (Pie de página)
    /* documentDefinition.content.push(
      { text: 'Información de la Empresa', style: 'footerTitle' },
      { text: 'Nombre de la Empresa', style: 'footerText' },
      { text: 'Dirección de la Empresa', style: 'footerText' },
      { text: 'Teléfono: (XXX) XXX-XXXX', style: 'footerText' },
      { text: 'Email: contacto@empresa.com', style: 'footerText' }
    );*/
  
    // Generar PDF
    pdfMake.createPdf(documentDefinition).open();
  
    function capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  }
  

  
  





}
