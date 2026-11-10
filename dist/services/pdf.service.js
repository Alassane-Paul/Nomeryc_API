"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamDocumentPdf = streamDocumentPdf;
const pdfkit_1 = __importDefault(require("pdfkit"));
const PURPLE = '#8B5CF6';
const DARK = '#111827';
const GRAY = '#6B7280';
function formatAmount(amount) {
    return `${new Intl.NumberFormat('fr-FR').format(Math.round(amount || 0))} FCFA`;
}
/** Génère le PDF et le streame directement dans la réponse HTTP. */
function streamDocumentPdf(res, data) {
    const doc = new pdfkit_1.default({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${data.kind}-${data.number}.pdf"`);
    doc.pipe(res);
    // ===== EN-TÊTE =====
    doc.fillColor(PURPLE).fontSize(22).font('Helvetica-Bold').text('Nomeryc', 50, 50);
    doc.fillColor(GRAY).fontSize(9).font('Helvetica').text('Automatisation & développement sur mesure', 50, 76);
    doc.fillColor(DARK).fontSize(18).font('Helvetica-Bold').text(data.kind.toUpperCase(), 300, 50, { align: 'right', width: 245 });
    doc.fillColor(GRAY).fontSize(10).font('Helvetica')
        .text(`N° ${data.number}`, 300, 74, { align: 'right', width: 245 })
        .text(`Date : ${data.date.toLocaleDateString('fr-FR')}`, 300, 88, { align: 'right', width: 245 });
    if (data.validUntilOrDueDate) {
        doc.text(`${data.validUntilOrDueLabel} : ${data.validUntilOrDueDate.toLocaleDateString('fr-FR')}`, 300, 102, { align: 'right', width: 245 });
    }
    doc.moveTo(50, 130).lineTo(545, 130).strokeColor('#E5E7EB').stroke();
    // ===== CLIENT =====
    doc.fillColor(GRAY).fontSize(9).font('Helvetica-Bold').text('FACTURÉ À', 50, 145);
    doc.fillColor(DARK).fontSize(11).font('Helvetica-Bold').text(`${data.client.firstName} ${data.client.lastName}`, 50, 160);
    doc.fillColor(GRAY).fontSize(10).font('Helvetica');
    let y = 176;
    if (data.client.company) {
        doc.text(data.client.company, 50, y);
        y += 14;
    }
    doc.text(data.client.email, 50, y);
    y += 14;
    if (data.client.phone) {
        doc.text(data.client.phone, 50, y);
        y += 14;
    }
    // ===== TABLEAU DES LIGNES =====
    let tableTop = Math.max(y + 20, 230);
    const colX = { designation: 50, qty: 320, unit: 380, total: 460 };
    doc.rect(50, tableTop, 495, 24).fill('#F3F0FF');
    doc.fillColor(DARK).fontSize(9).font('Helvetica-Bold');
    doc.text('DÉSIGNATION', colX.designation + 8, tableTop + 7);
    doc.text('QTÉ', colX.qty, tableTop + 7, { width: 50, align: 'right' });
    doc.text('PRIX UNIT.', colX.unit, tableTop + 7, { width: 70, align: 'right' });
    doc.text('TOTAL', colX.total, tableTop + 7, { width: 75, align: 'right' });
    let rowY = tableTop + 24;
    doc.font('Helvetica').fontSize(9.5);
    data.items.forEach((item, i) => {
        const rowHeight = item.description ? 34 : 22;
        if (rowY + rowHeight > 760) {
            doc.addPage();
            rowY = 50;
        }
        if (i % 2 === 1)
            doc.rect(50, rowY, 495, rowHeight).fill('#FAFAFA');
        doc.fillColor(DARK).font('Helvetica-Bold').text(item.designation, colX.designation + 8, rowY + 6, { width: 260 });
        if (item.description) {
            doc.fillColor(GRAY).font('Helvetica').fontSize(8).text(item.description, colX.designation + 8, rowY + 19, { width: 260 });
            doc.fontSize(9.5);
        }
        doc.fillColor(DARK).font('Helvetica');
        doc.text(`${item.quantity}${item.unit ? ' ' + item.unit : ''}`, colX.qty, rowY + 6, { width: 50, align: 'right' });
        doc.text(formatAmount(item.unitPrice), colX.unit, rowY + 6, { width: 70, align: 'right' });
        doc.font('Helvetica-Bold').text(formatAmount(item.total), colX.total, rowY + 6, { width: 75, align: 'right' });
        rowY += rowHeight;
    });
    doc.moveTo(50, rowY).lineTo(545, rowY).strokeColor('#E5E7EB').stroke();
    rowY += 12;
    // ===== TOTAUX =====
    const totalsX = 360;
    doc.fontSize(10).fillColor(GRAY).font('Helvetica');
    doc.text('Total HT', totalsX, rowY, { width: 100 });
    doc.fillColor(DARK).text(formatAmount(data.totalHT), totalsX + 100, rowY, { width: 85, align: 'right' });
    rowY += 16;
    doc.fillColor(GRAY).text(`TVA (${data.tvaRate}%)`, totalsX, rowY, { width: 100 });
    doc.fillColor(DARK).text(formatAmount(data.totalTVA), totalsX + 100, rowY, { width: 85, align: 'right' });
    rowY += 20;
    doc.rect(totalsX, rowY, 185, 26).fill(PURPLE);
    doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(11).text('Total TTC', totalsX + 10, rowY + 7);
    doc.text(formatAmount(data.totalTTC), totalsX, rowY + 7, { width: 175, align: 'right' });
    rowY += 40;
    // ===== NOTES / CONDITIONS =====
    if (data.notes) {
        doc.fillColor(GRAY).fontSize(9).font('Helvetica-Bold').text('NOTES', 50, rowY);
        doc.fillColor(DARK).font('Helvetica').fontSize(9.5).text(data.notes, 50, rowY + 14, { width: 495 });
        rowY += 14 + doc.heightOfString(data.notes, { width: 495 }) + 16;
    }
    if (data.terms) {
        doc.fillColor(GRAY).fontSize(9).font('Helvetica-Bold').text('CONDITIONS', 50, rowY);
        doc.fillColor(DARK).font('Helvetica').fontSize(9.5).text(data.terms, 50, rowY + 14, { width: 495 });
    }
    // ===== PIED DE PAGE =====
    doc.fontSize(8).fillColor(GRAY).text('Nomeryc — Document généré automatiquement.', 50, 780, { width: 495, align: 'center' });
    doc.end();
}
