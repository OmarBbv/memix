import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Order } from './entities/order.entity';

@Injectable()
export class InvoicesService {
  async generateOrderInvoice(order: Order): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Header
      this.generateHeader(doc);
      
      // Customer Information
      this.generateCustomerInformation(doc, order);

      // Invoice Table
      this.generateInvoiceTable(doc, order);

      // Footer
      this.generateFooter(doc);

      doc.end();
    });
  }

  generateHeader(doc: PDFKit.PDFDocument) {
    doc
      .fillColor('#444444')
      .fontSize(20)
      .text('MEMIX E-COMMERCE', 110, 57)
      .fontSize(10)
      .text('Bakı, Azərbaycan', 200, 65, { align: 'right' })
      .text('Phone: +994 (00) 000-00-00', 200, 80, { align: 'right' })
      .moveDown();
  }

  generateCustomerInformation(doc: PDFKit.PDFDocument, order: Order) {
    doc
      .fillColor('#444444')
      .fontSize(20)
      .text('İnvoys', 50, 160);

    this.generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
      .fontSize(10)
      .text('Sifariş ID:', 50, customerInformationTop)
      .font('Helvetica-Bold')
      .text(`#${order.id}`, 150, customerInformationTop)
      .font('Helvetica')
      .text('Tarix:', 50, customerInformationTop + 15)
      .text(new Date(order.createdAt).toLocaleDateString('az-AZ'), 150, customerInformationTop + 15)
      .text('Məbləğ:', 50, customerInformationTop + 30)
      .text(`${Number(order.totalPrice).toFixed(2)} AZN`, 150, customerInformationTop + 30)

      .font('Helvetica-Bold')
      .text('Müştəri:', 300, customerInformationTop)
      .font('Helvetica')
      .text(order.user?.name || 'Qonaq', 300, customerInformationTop + 15)
      .text(order.address || 'Ünvan qeyd olunmayıb', 300, customerInformationTop + 30)
      .text(order.contactPhone || '', 300, customerInformationTop + 45)
      .moveDown();

    this.generateHr(doc, 267);
  }

  generateInvoiceTable(doc: PDFKit.PDFDocument, order: Order) {
    let i;
    const invoiceTableTop = 330;

    doc.font('Helvetica-Bold');
    this.generateTableRow(
      doc,
      invoiceTableTop,
      'Məhsul',
      'Qiymət',
      'Sayı',
      'Cəmi'
    );
    this.generateHr(doc, invoiceTableTop + 20);
    doc.font('Helvetica');

    for (i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        this.generateTableRow(
          doc,
          position,
          item.product?.name || 'Məhsul',
          `${Number(item.price).toFixed(2)} AZN`,
          item.quantity.toString(),
          `${(Number(item.price) * item.quantity).toFixed(2)} AZN`
        );

        this.generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    this.generateTableRow(
      doc,
      subtotalPosition,
      '',
      '',
      'Cəmi:',
      `${Number(order.totalPrice).toFixed(2)} AZN`
    );
  }

  generateFooter(doc: PDFKit.PDFDocument) {
    doc
      .fontSize(10)
      .text(
        'Bizi seçdiyiniz üçün təşəkkür edirik!',
        50,
        780,
        { align: 'center', width: 500 }
      );
  }

  generateTableRow(
    doc: PDFKit.PDFDocument,
    y: number,
    item: string,
    unitCost: string,
    quantity: string,
    lineTotal: string
  ) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(unitCost, 280, y, { width: 90, align: 'right' })
      .text(quantity, 370, y, { width: 90, align: 'right' })
      .text(lineTotal, 0, y, { align: 'right' });
  }

  generateHr(doc: PDFKit.PDFDocument, y: number) {
    doc
      .strokeColor('#aaaaaa')
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }
}
