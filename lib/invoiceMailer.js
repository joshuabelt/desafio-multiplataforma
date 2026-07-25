import { jsPDF } from 'jspdf';

export function buildInvoiceEmailContent(invoice) {
  const subject = `Factura ${invoice.invoiceNumber}`;
  const text = [
    'FACTURA DE COMPRA',
    '=================',
    `Número: ${invoice.invoiceNumber}`,
    `Fecha: ${invoice.orderDate}`,
    `Cliente: ${invoice.customerName}`,
    `Correo: ${invoice.customerEmail}`,
    '',
    'Productos:',
    ...invoice.items.map((item) => `- ${item.title} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`),
    '',
    `Total de artículos: ${invoice.totalItems}`,
    `Total: $${invoice.cartTotal.toFixed(2)}`,
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827;">
      <h2>Factura de compra</h2>
      <p><strong>Número:</strong> ${invoice.invoiceNumber}</p>
      <p><strong>Fecha:</strong> ${invoice.orderDate}</p>
      <p><strong>Cliente:</strong> ${invoice.customerName}</p>
      <p><strong>Correo:</strong> ${invoice.customerEmail}</p>
      <h3>Productos</h3>
      <ul>
        ${invoice.items.map((item) => `<li>${item.title} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Total de artículos:</strong> ${invoice.totalItems}</p>
      <p><strong>Total:</strong> $${invoice.cartTotal.toFixed(2)}</p>
    </div>
  `;

  return { subject, text, html };
}

export function createInvoicePdfBuffer(invoice) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('FACTURA DE COMPRA', 14, 20);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  pdf.text(`Número: ${invoice.invoiceNumber}`, 14, 35);
  pdf.text(`Fecha: ${invoice.orderDate}`, 14, 42);
  pdf.text(`Cliente: ${invoice.customerName}`, 14, 49);
  pdf.text(`Correo: ${invoice.customerEmail}`, 14, 56);

  pdf.setFontSize(12);
  pdf.text('Productos:', 14, 71);

  const lines = invoice.items.map((item) => `- ${item.title} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`);
  let yPosition = 78;

  lines.forEach((line) => {
    const wrappedLines = pdf.splitTextToSize(line, pageWidth - 28);
    wrappedLines.forEach((wrappedLine) => {
      pdf.text(wrappedLine, 18, yPosition);
      yPosition += 7;
    });
  });

  pdf.text(`Total de artículos: ${invoice.totalItems}`, 14, yPosition + 8);
  pdf.text(`Total: $${invoice.cartTotal.toFixed(2)}`, 14, yPosition + 16);

  return Buffer.from(pdf.output('arraybuffer'));
}
