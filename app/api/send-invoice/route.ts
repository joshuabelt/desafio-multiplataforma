import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { buildInvoiceEmailContent, createInvoicePdfBuffer } from '../../../lib/invoiceMailer';

export async function POST(request: Request) {
  try {
    const invoice = await request.json();

    if (!invoice?.customerEmail) {
      return NextResponse.json({ success: false, error: 'Falta el correo del cliente' }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { success: false, error: 'Falta configurar SMTP_HOST, SMTP_USER o SMTP_PASS en .env.local' },
        { status: 500 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(smtpUser)) {
      return NextResponse.json(
        { success: false, error: 'SMTP_USER debe ser una dirección de correo válida' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.verify();

    const { subject, text, html } = buildInvoiceEmailContent(invoice);
    const pdfBuffer = createInvoicePdfBuffer(invoice);

    await transporter.sendMail({
      from: smtpFrom,
      to: invoice.customerEmail,
      subject,
      text,
      html,
      attachments: [
        {
          filename: `${invoice.invoiceNumber || 'factura'}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending invoice email', error);
    return NextResponse.json({ success: false, error: 'No se pudo enviar la factura. Revisa SMTP_HOST, SMTP_USER, SMTP_PASS y la contraseña de aplicación de Gmail.' }, { status: 500 });
  }
}
