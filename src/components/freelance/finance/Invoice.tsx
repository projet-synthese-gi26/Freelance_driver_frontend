// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import React from 'react';

// const logo = '/img/MainLogo1.png';
// interface InvoiceProps{
//   id:string;
//   driverName:string;
//   driverId:string;
//   driverAddress:string;
//   driverEmail:string;
//   subscriptionAmount:number;
//   subscriptionDate:string;  // Format YYYY-MM-DD
//   subscriptionPlan:string;
//   subscriptionStatus:string;
//   subscriptionDuration:number;
//   subscriptionPaymentMethod:string;
// }

// const generateInvoicePDF = (invoice: InvoiceProps) => {
//   const doc = new jsPDF();
//   doc.setFontSize(14);
//   doc.text('FACTURE', 105, 20, { align: 'center' });
//   doc.setFontSize(11);
//   doc.text(`${invoice.driverName}`, 10, 40);
//   doc.text(`${invoice.driverAddress}`, 10, 45);
//   doc.text(`${invoice.driverEmail}`, 10, 50);
//   doc.text(`${invoice.driverName}`, 170, 40);
//   doc.text(`${invoice.driverAddress}`, 170, 45);
//   doc.text(`${invoice.driverEmail}`, 170, 50);

//   // Add items table
//   doc.autoTable({
//     startY: 80,
//     head: [['Description', 'Quantité', 'Prix unitaire', 'Total']],
//     body: invoice.items.map(item => [
//       item.description,
//       item.quantity.toString(),
//       `${item.unitPrice.toFixed(2)} XAF`,
//       `${item.total.toFixed(2)} XAF`
//     ]),
//     foot: [
//       ['Sous-total', '', '', `${invoice.subtotal.toFixed(2)} XAF`],
//       ['TVA', '', '', `${invoice.tax.toFixed(2)} XAF`],
//       ['Total', '', '', `${invoice.total.toFixed(2)} XAF`],
//     ],
//     theme: 'striped',
//     headStyles: { fillColor: [41, 128, 185], textColor: 255 },
//     footStyles: { fillColor: [41, 128, 185], textColor: 255 },
//   });

//   // Add footer
//   const pageCount = (doc.internal as any).getNumberOfPages();
//   for (let i = 1; i <= pageCount; i++) {
//     doc.setPage(i);
//     doc.setFontSize(10);
//     doc.text('Page ' + String(i) + ' sur ' + String(pageCount), doc.internal.pageSize.width / 2, 287, { align: 'center' });
//   }

//   // Save the PDF
//   doc.save(`facture_${invoice.invoiceNumber}.pdf`);
// };
// const Invoice = ({id, driverName, driverId, subscriptionAmount, subscriptionDate,subscriptionPlan,subscriptionStatus
//     ,subscriptionDuration,subscriptionPaymentMethod
//  }:InvoiceProps) => (
// );

// export default Invoice;
