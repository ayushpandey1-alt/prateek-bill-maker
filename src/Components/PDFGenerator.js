import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import signature from "../signature.png"; // Make sure this path is correct

// Helper: convert numbers to words (Indian numbering system)
const numberToWords = (num) => {
  const a = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const numToWords = (n) => {
    if (n < 20) return a[n];
    if (n < 100)
      return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        " Hundred" +
        (n % 100 ? " and " + numToWords(n % 100) : "")
      );
    if (n < 100000)
      return (
        numToWords(Math.floor(n / 1000)) +
        " Thousand" +
        (n % 1000 ? " " + numToWords(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        numToWords(Math.floor(n / 100000)) +
        " Lakh" +
        (n % 100000 ? " " + numToWords(n % 100000) : "")
      );
    return (
      numToWords(Math.floor(n / 10000000)) +
      " Crore" +
      (n % 10000000 ? " " + numToWords(n % 10000000) : "")
    );
  };

  return num ? numToWords(num) + " Only" : "Zero Only";
};

// Helper: format date as DD-MM-YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const PDFGenerator = ({ formData }) => {

   const buildPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 30;

    let cursorY = margin;

    // Draw page border
    doc.rect(
      margin - 10,
      margin - 10,
      pageWidth - 2 * (margin - 10),
      pageHeight - 2 * (margin - 10)
    );

    // Header
       const headerHeight = 75;
    doc.rect(margin, cursorY, pageWidth - 2 * margin, headerHeight);
    doc.setFontSize(9);
    doc.text(`GSTIN: 05AKTPP8056E2ZP`, margin + 5, cursorY + 15);
    doc.setFontSize(12);
    doc.text("TAX INVOICE", pageWidth / 2 - 30, cursorY + 15);
    doc.text("SHRI HARI TRADING", pageWidth / 2 - 50, cursorY + 35);
    doc.setFontSize(9);
    doc.text(`Contact No : 8273271604`,  pageWidth - 140, cursorY + 15);
    doc.text("Supplier of M.T.O ,Solvent 0il and other products", pageWidth / 2 - 90, cursorY + 50);
    doc.text(
      `Godown : NEAR PARWATI CONVENT PUBLIC SCHOOL,KALON, DHAULCHHINA Distt. Almora, Uttarakhand (INDIA)`,
      pageWidth / 2 - 240,
      cursorY + 65
    );
    cursorY += headerHeight + 5;

    // Invoice Info
    const invoiceInfoHeight = 65;
    doc.rect(margin, cursorY, pageWidth - 2 * margin, invoiceInfoHeight);
    doc.line(pageWidth / 2, cursorY, pageWidth / 2, cursorY + invoiceInfoHeight);
    doc.setFont(undefined, "bold");
    doc.text(`Invoice No:`, margin + 5, cursorY + 15);
    doc.setFont(undefined, "normal");
    doc.text(`${formData.invoiceNo}`, margin + 60, cursorY + 15);
    doc.setFont(undefined, "bold");
    doc.text(`Date of Invoice:`, margin + 5, cursorY + 30);
    doc.setFont(undefined, "normal");
    doc.text(`${formatDate(formData.invoiceDate)}`, margin + 78, cursorY + 30);
    doc.setFont(undefined, "bold");
    doc.text(`State:`, margin + 5, cursorY + 45);
    doc.setFont(undefined, "normal");
    doc.text(`Uttarakhand`, margin + 33, cursorY + 45);
    doc.setFont(undefined, "bold");
    doc.text(`State Code:`, margin + 165, cursorY + 45);
    doc.setFont(undefined, "normal");
    doc.text(`05`, margin + 219, cursorY + 45);
    doc.setFont(undefined, "bold");
    doc.text(`Transportation Mode:`, pageWidth / 2 + 5, cursorY + 15);
    doc.setFont(undefined, "normal");
    doc.text(`${formData.transportMode}`, pageWidth / 2 + 100, cursorY + 15);
    doc.setFont(undefined, "bold");
    doc.text(`Vehicle Number:`, pageWidth / 2 + 5, cursorY + 30);
    doc.setFont(undefined, "normal");
    doc.text(`${formData.vehicleNumber}`, pageWidth / 2 + 80, cursorY + 30);
    doc.setFont(undefined, "bold");
    doc.text(`Date of Supply:`, pageWidth / 2 + 5, cursorY + 45);
    doc.setFont(undefined, "normal");
    doc.text(`${formatDate(formData.supplyDate)}`, pageWidth / 2 + 75, cursorY + 45);
    doc.setFont(undefined, "bold");
    doc.text(`Place of Supply:`, pageWidth / 2 + 5, cursorY + 60);
    doc.setFont(undefined, "normal");
    doc.text(`${formData.placeOfSupply}`, pageWidth / 2 + 80, cursorY + 60);
    cursorY += invoiceInfoHeight + 5;

    // Party Box (Billed & Shipped same)
    const partyBoxHeight = 135;
    doc.rect(margin, cursorY, pageWidth - 2 * margin, partyBoxHeight);
    doc.line(pageWidth / 2, cursorY, pageWidth / 2, cursorY + partyBoxHeight);

    const billed = formData;

    // --- Billed To ---
    doc.setFont(undefined, "bold");
    doc.text("Billed To:", margin + 5, cursorY + 15);
    doc.line(margin, cursorY + 20, pageWidth / 2, cursorY + 20);
    doc.setFont(undefined, "bold");
    doc.text("Name:", margin + 5, cursorY + 35);
    doc.setFont(undefined, "normal");
    doc.text(billed.billedName, margin + 35, cursorY + 35);

    doc.setFont(undefined, "bold");
    doc.text("Address:", margin + 5, cursorY + 50);
    doc.setFont(undefined, "normal");
    const billedAddress = doc.splitTextToSize(billed.billedAddress, pageWidth / 2 - 80);
    doc.text(billedAddress, margin + 47, cursorY + 50);

    const addrHeight = billedAddress.length * 8;
    doc.setFont(undefined, "bold");
    doc.text("GSTIN:", margin + 5, cursorY + 50 + addrHeight + 10);
    doc.setFont(undefined, "normal");
    doc.text(billed.billedGstin, margin + 38, cursorY + 50 + addrHeight + 10);

    doc.setFont(undefined, "bold");
    doc.text("PAN No:", margin + 5, cursorY + 50 + addrHeight + 25);
    doc.setFont(undefined, "normal");
    doc.text(billed.panNo, margin + 42, cursorY + 50 + addrHeight + 25);

    doc.setFont(undefined, "bold");
    doc.text("State:", margin + 5, cursorY + 50 + addrHeight + 40);
    doc.setFont(undefined, "normal");
    doc.text(billed.billedState, margin + 33, cursorY + 50 + addrHeight + 40);

    doc.setFont(undefined, "bold");
    doc.text("State Code:", margin + 165, cursorY + 50 + addrHeight + 40);
    doc.setFont(undefined, "normal");
    doc.text(billed.billedStateCode, margin + 218, cursorY + 50 + addrHeight + 40);

    doc.setFont(undefined, "bold");
    doc.text("E-way Bill:", margin + 5, cursorY + 50 + addrHeight + 55);
    doc.setFont(undefined, "normal");
    doc.text(billed.EWayBillNo, margin + 52, cursorY + 50 + addrHeight + 55);

    doc.setFont(undefined, "bold");
    doc.text("E-way Date:", margin + 165, cursorY + 50 + addrHeight + 55);
    doc.setFont(undefined, "normal");
    doc.text(formatDate(billed.EWayDate), margin + 218, cursorY + 50 + addrHeight + 55);

    // --- Shipped To ---
    doc.setFont(undefined, "bold");
    doc.text("Details of Consignee/Shipped To:", pageWidth / 2 + 5, cursorY + 15);
    doc.line(pageWidth / 2, cursorY + 20, pageWidth - margin, cursorY + 20);

    doc.setFont(undefined, "bold");
    doc.text("Name:", pageWidth / 2 + 5, cursorY + 35);
    doc.setFont(undefined, "normal");
    doc.text(billed.billedName, pageWidth / 2 + 35, cursorY + 35);

    doc.setFont(undefined, "bold");
    doc.text("Address:", pageWidth / 2 + 5, cursorY + 50);
    doc.setFont(undefined, "normal");
    const shipAddr = doc.splitTextToSize(billed.billedAddress, pageWidth / 2 - 80);
    doc.text(shipAddr, pageWidth / 2 + 48, cursorY + 50);

    doc.setFont(undefined, "bold");
    doc.text("GSTIN:", pageWidth / 2 + 5, cursorY + 50 + addrHeight + 10);
    doc.setFont(undefined, "normal");
    doc.text(billed.billedGstin, pageWidth / 2 + 38, cursorY + 50 + addrHeight + 10);
    
    doc.setFont(undefined, "bold");
    doc.text("PAN No:", pageWidth / 2 + 5, cursorY + 50 + addrHeight + 25);
    doc.setFont(undefined, "normal");
    doc.text(billed.panNo, pageWidth / 2 + 42, cursorY + 50 + addrHeight + 25);

    doc.setFont(undefined, "bold");
    doc.text("State:", pageWidth / 2 + 5, cursorY + 50 + addrHeight + 40);
    doc.setFont(undefined, "normal");
    doc.text(billed.billedState, pageWidth / 2 + 32, cursorY + 50 + addrHeight + 40);

    doc.setFont(undefined, "bold");
    doc.text("State Code:", pageWidth / 2 + 165, cursorY + 50 + addrHeight + 40);
    doc.setFont(undefined, "normal");
    doc.text(billed.billedStateCode, pageWidth / 2 + 218, cursorY + 50 + addrHeight + 40);

    cursorY += partyBoxHeight + 10;

    // Goods Table
    const goods = formData.items || [];
    const tableData = goods.map((item, i) => {
      const qty = parseFloat(item.qty) || 0;
      const rate = parseFloat(item.rate) || 0;
      const amount = qty * rate;
      return [i + 1, item.itemDescription, item.hsnCode, qty, item.unit, rate.toFixed(2), amount.toFixed(2)];
    });

    const totalBeforeTax = tableData.reduce((sum, row) => sum + parseFloat(row[6]), 0);
    const cgstRate = parseFloat(formData.cgst) || 0;
    const sgstRate = parseFloat(formData.sgst) || 0;
    const igstRate = parseFloat(formData.igst) || 0;

    const cgstAmt = (totalBeforeTax * cgstRate) / 100;
    const sgstAmt = (totalBeforeTax * sgstRate) / 100;
    const igstAmt = (totalBeforeTax * igstRate) / 100;
    const totalAfterTax = totalBeforeTax + cgstAmt + sgstAmt + igstAmt;

    autoTable(doc, {
      startY: cursorY,
      head: [["S.N.", "Description of Goods", "HSN Code", "Qty", "Unit", "Rate", "Amount"]],
      body: tableData,
      theme: "grid",
      styles: { fontSize: 9 },
      margin: { left: margin, right: margin },
    });

    cursorY = doc.lastAutoTable.finalY + 10;

    // Bank & Totals Section
    const bankBoxHeight = 120;
    doc.rect(margin, cursorY, pageWidth - 2 * margin, bankBoxHeight);
    doc.line(pageWidth / 2, cursorY, pageWidth / 2, cursorY + bankBoxHeight);

    // Amount in Words (label bold, words normal)
    const words = numberToWords(Math.round(totalAfterTax));
    doc.setFont(undefined, "bold");
    doc.text("Total Amount in Words:", margin + 5, cursorY + 15);
    doc.setFont(undefined, "normal");
    const amountWords = doc.splitTextToSize(words, pageWidth / 2 - 150);
    doc.text(amountWords, margin + 110, cursorY + 15);

    // Bank details
    doc.setFont(undefined, "bold");
    doc.text("Bank Details:", margin + 5, cursorY + 45);
    doc.setFont(undefined, "normal");
    doc.text("Bank of India", margin + 64, cursorY + 45);

    doc.setFont(undefined, "bold");
    doc.text("Branch:", margin + 5, cursorY + 60);
    doc.setFont(undefined, "normal");
    doc.text("Mall Road Almora (Uttarakhand)", margin + 42, cursorY + 60);

    doc.setFont(undefined, "bold");
    doc.text("A/c No:", margin + 5, cursorY + 75);
    doc.setFont(undefined, "normal");
    doc.text("689020110000248", margin + 39, cursorY + 75);

    doc.setFont(undefined, "bold");
    doc.text("IFSC Code:", margin + 5, cursorY + 90);
    doc.setFont(undefined, "normal");
    doc.text("BKID0006890", margin + 56, cursorY + 90);

     const taxData = [
      ["Total Amount Before Tax", totalBeforeTax.toFixed(2)],
      [`Add CGST @ ${isNaN(cgstRate) ? "N/A" : cgstRate + "%"}`, cgstAmt],
      [`Add SGST @ ${isNaN(sgstRate) ? "N/A" : sgstRate + "%"}`, sgstAmt],
      [`Add IGST @ ${isNaN(igstRate) ? "N/A" : igstRate + "%"}`, igstAmt],
      ["Total Amount After Tax", totalAfterTax.toFixed(2)],
    ];

    autoTable(doc, {
      startY: cursorY + 15,
      body: taxData,
      theme: "grid",
      styles: { fontSize: 9, fontStyle: "bold" },
      margin: { left: pageWidth / 2 + 5, right: margin },
      tableWidth: pageWidth / 2 - margin - 10,
      columnStyles: { 1: { halign: "right" } },
    });

    const taxTableY = doc.lastAutoTable.finalY;

    
    // --- Signature Section with Border and Static Image
    const signBoxY = taxTableY + 10;
    const signBoxHeight = 90;
    const signBoxWidth = pageWidth - 2 * margin;

    // Outer box
    doc.rect(margin, signBoxY, signBoxWidth, signBoxHeight);

    // Add signature image (use your own base64 or import path)
   

    const signX = pageWidth - margin - 150;
    const signY = signBoxY + 10;
    doc.addImage(signature, "PNG", signX, signY, 100, 40);

    // Add signature text
    doc.setFont(undefined, "bold");
    doc.text("For M/s SHRI HARI TRADING", signX - 10, signBoxY + 60);
    doc.text("Authorised Signatory", signX + 10, signBoxY + 75);

    // Terms

    doc.setFontSize(8);
    doc.text("Terms & Conditions:", margin, pageHeight - 103);
    doc.text("1. Goods once sold will not be taken back or exchanged.", margin + 10, pageHeight - 91);
    doc.text("2. All disputes subject to Almora jurisdiction only.", margin + 10, pageHeight - 79);
    doc.text("3. Interest @ 24% p.a. will be charged after 15 days from the date of bill.", margin + 10, pageHeight - 67);
    doc.line(margin -10, pageHeight - 59, pageWidth -20 , pageHeight - 59);
    doc.text("Declaration: Certified that the particulars given above are true and correct. The amount indicated represent the price actually charged,", margin , pageHeight - 43);
    doc.text("there is no flow of additional consideration directly or indirectly from the Buyer.", margin , pageHeight - 31);
    
    return doc;

  }

  // === Download PDF ===
  const generatePDF = () => {
    const doc = buildPDF();
    doc.save(`Shri Hari Trading Bill No.${formData.invoiceNo || "unnumbered"}.pdf`);
  };

  // === Print PDF ===
const printPDF = () => {
  const doc = buildPDF();
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank"); // Open in new tab for both desktop and mobile
};


  // Styles for buttons
  const styles = `
    .pdf-buttons-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      margin-top: 40px;
      margin-bottom: 60px;
      width: 100%;
    }

    .pdf-button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .pdf-button:hover {
      background-color: #0056b3;
    }

    .pdf-button.print {
      background-color: #28a745;
    }

    .pdf-button.print:hover {
      background-color: #1e7e34;
    }

    @media (max-width: 768px) {
      .pdf-buttons-wrapper {
        flex-direction: column;
        gap: 12px;
      }

      .pdf-button {
        width: 80%;
        max-width: 280px;
        font-size: 14px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      {/* Buttons will appear after the form */}
      <div className="pdf-buttons-wrapper">
        <button className="pdf-button" onClick={generatePDF}>
          Generate PDF
        </button>
        <button className="pdf-button print" onClick={printPDF}>
          Print PDF
        </button>
      </div>
    </>
  );
};

export default PDFGenerator;