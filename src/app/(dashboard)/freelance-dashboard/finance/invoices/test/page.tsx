"use client"
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React from 'react';
import { Button } from '@mui/material';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

interface InvoiceButtonProps {
    onGenerateInvoice: () => void;
  }
  
  const InvoiceButton: React.FC<InvoiceButtonProps> = ({ onGenerateInvoice }) => {
    return (
      <Button variant="contained" onClick={onGenerateInvoice}>
        Générer la facture PDF
      </Button>
    );
  };

const generateInvoicePDF = (invoice: Invoice) => {
  const doc = new jsPDF();

  // Add company logo
  // doc.addImage('path/to/logo.png', 'PNG', 10, 10, 40, 40);

  // Add invoice details
  doc.setFontSize(18);
  doc.text('FACTURE', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Facture N°: ${invoice.invoiceNumber}`, 10, 40);
  doc.text(`Date: ${invoice.date}`, 10, 45);
  doc.text(`Client: ${invoice.customerName}`, 170, 50);
  doc.text(`Adresse: ${invoice.customerAddress}`, 10, 65);

  // Add items table
  doc.autoTable({
    startY: 80,
    head: [['Description', 'Quantité', 'Prix unitaire', 'Total']],
    body: invoice.items.map(item => [
      item.description,
      item.quantity.toString(),
      `${item.unitPrice.toFixed(2)} XAF`,
      `${item.total.toFixed(2)} XAF`
    ]),
    foot: [
      ['Sous-total', '', '', `${invoice.subtotal.toFixed(2)} XAF`],
      ['TVA', '', '', `${invoice.tax.toFixed(2)} XAF`],
      ['Total', '', '', `${invoice.total.toFixed(2)} XAF`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    footStyles: { fillColor: [41, 128, 185], textColor: 255 },
  });

  // Add footer
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text('Page ' + String(i) + ' sur ' + String(pageCount), doc.internal.pageSize.width / 2, 287, { align: 'center' });
  }

  // Save the PDF
  doc.save(`facture_${invoice.invoiceNumber}.pdf`);
};



const InvoicePage: React.FC = () => {
  const handleGenerateInvoice = () => {
    const invoice: Invoice = {
      invoiceNumber: '2024-001',
      date: '2024-09-03',
      customerName: 'John Doe',
      customerAddress: '123 Main St, City, Country',
      items: [
        { description: 'Item 1', quantity: 2, unitPrice: 100, total: 200 },
        { description: 'Item 2', quantity: 1, unitPrice: 150, total: 150 },
      ],
      subtotal: 350,
      tax: 17.5,
      total: 367.5,
    };

    generateInvoicePDF(invoice);
  };

  return (
    <div>
      <h1>Page de facturation</h1>
      <InvoiceButton onGenerateInvoice={handleGenerateInvoice} />
    </div>
  );
};

export default InvoicePage;
