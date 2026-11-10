"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailTemplates = void 0;
exports.sendMail = sendMail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
let transporter = null;
/**
 * Transport SMTP créé à la demande. Si aucun SMTP_HOST n'est configuré,
 * on ne plante pas : les mails sont simplement loggés (mode dev).
 */
function getTransporter() {
    if (!env_1.env.SMTP_HOST || !env_1.env.SMTP_USER)
        return null;
    if (transporter)
        return transporter;
    transporter = nodemailer_1.default.createTransport({
        host: env_1.env.SMTP_HOST,
        port: env_1.env.SMTP_PORT,
        secure: env_1.env.SMTP_SECURE,
        auth: { user: env_1.env.SMTP_USER, pass: env_1.env.SMTP_PASSWORD },
    });
    return transporter;
}
/** Envoi bas niveau. Ne throw jamais : un mail raté ne doit pas casser une requête API. */
async function sendMail({ to, subject, html, text }) {
    const tx = getTransporter();
    if (!tx) {
        console.warn(`📧 [MAIL NON ENVOYÉ - SMTP non configuré] → ${to} : ${subject}`);
        return false;
    }
    try {
        await tx.sendMail({ from: env_1.env.SMTP_FROM, to, subject, html, text: text || stripHtml(html) });
        return true;
    }
    catch (error) {
        console.error(`❌ Échec envoi mail à ${to} :`, error?.message);
        return false;
    }
}
function stripHtml(html) {
    return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
// ===================== TEMPLATE DE BASE =====================
function layout(title, body, cta) {
    return `
  <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#0F0A1E;padding:32px;color:#E5E7EB">
    <div style="max-width:560px;margin:0 auto;background:#1A1230;border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden">
      <div style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,.08)">
        <span style="font-size:20px;font-weight:800;color:#8B5CF6">Nomeryc</span>
      </div>
      <div style="padding:28px">
        <h1 style="margin:0 0 16px;font-size:20px;color:#fff">${title}</h1>
        <div style="font-size:14px;line-height:1.7;color:#C9C6D4">${body}</div>
        ${cta
        ? `<a href="${cta.url}" style="display:inline-block;margin-top:24px;background:#8B5CF6;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px">${cta.label}</a>`
        : ''}
      </div>
      <div style="padding:18px 28px;border-top:1px solid rgba(255,255,255,.08);font-size:11px;color:#6B7280">
        Nomeryc — Automatisation & développement sur mesure.<br>
        Cet email est automatique, merci de ne pas y répondre directement.
      </div>
    </div>
  </div>`;
}
// ===================== TEMPLATES MÉTIER =====================
exports.mailTemplates = {
    welcome: (firstName) => ({
        subject: 'Bienvenue chez Nomeryc 👋',
        html: layout(`Bienvenue ${firstName} !`, `<p>Votre espace client Nomeryc est prêt. Vous pouvez y suivre vos projets, consulter vos devis et factures, et échanger directement avec notre équipe.</p>`, { label: 'Accéder à mon espace', url: `${env_1.env.FRONTEND_URL}/client` }),
    }),
    newsletterWelcome: () => ({
        subject: 'Bienvenue dans la newsletter Nomeryc 📬',
        html: layout('Merci de votre inscription !', `<p>Vous recevrez désormais nos derniers articles sur le développement web, mobile et l'automatisation, directement dans votre boîte mail.</p>
       <p style="color:#9CA3AF;font-size:13px">Vous pouvez vous désabonner à tout moment via le lien présent en bas de chaque email.</p>`, { label: 'Découvrir le blog', url: `${env_1.env.FRONTEND_URL}/blog` }),
    }),
    passwordReset: (firstName, resetUrl) => ({
        subject: 'Réinitialisation de votre mot de passe',
        html: layout('Réinitialisation de mot de passe', `<p>Bonjour ${firstName},</p>
       <p>Vous avez demandé à réinitialiser votre mot de passe. Ce lien est valable <strong>1 heure</strong>.</p>
       <p style="color:#9CA3AF;font-size:13px">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email : votre mot de passe reste inchangé.</p>`, { label: 'Choisir un nouveau mot de passe', url: resetUrl }),
    }),
    contactReceived: (name, email, message) => ({
        subject: `Nouvelle demande de contact — ${name}`,
        html: layout('Nouvelle demande de contact', `<p><strong>${name}</strong> (${email}) vous a écrit :</p>
       <blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid #8B5CF6;background:rgba(139,92,246,.08)">${message}</blockquote>`, { label: 'Voir dans le back-office', url: `${env_1.env.FRONTEND_URL}/admin/contacts` }),
    }),
    quoteSent: (firstName, quoteNumber, totalTTC) => ({
        subject: `Votre devis ${quoteNumber}`,
        html: layout(`Votre devis est disponible`, `<p>Bonjour ${firstName},</p>
       <p>Votre devis <strong>${quoteNumber}</strong> d'un montant de <strong>${formatAmount(totalTTC)}</strong> TTC est consultable dans votre espace client.</p>`, { label: 'Consulter le devis', url: `${env_1.env.FRONTEND_URL}/client/devis` }),
    }),
    invoiceSent: (firstName, invoiceNumber, totalTTC, dueDate) => ({
        subject: `Votre facture ${invoiceNumber}`,
        html: layout('Nouvelle facture', `<p>Bonjour ${firstName},</p>
       <p>Votre facture <strong>${invoiceNumber}</strong> d'un montant de <strong>${formatAmount(totalTTC)}</strong> TTC est disponible.</p>
       ${dueDate ? `<p>Échéance de règlement : <strong>${new Date(dueDate).toLocaleDateString('fr-FR')}</strong>.</p>` : ''}`, { label: 'Consulter la facture', url: `${env_1.env.FRONTEND_URL}/client/factures` }),
    }),
    invoicePaid: (firstName, invoiceNumber, totalTTC) => ({
        subject: `Paiement reçu — ${invoiceNumber}`,
        html: layout('Paiement bien reçu', `<p>Bonjour ${firstName},</p>
       <p>Nous confirmons la réception de votre règlement de <strong>${formatAmount(totalTTC)}</strong> pour la facture <strong>${invoiceNumber}</strong>. Merci !</p>`),
    }),
    newMessage: (firstName, excerpt) => ({
        subject: 'Nouveau message de l\'équipe Nomeryc',
        html: layout('Vous avez un nouveau message', `<p>Bonjour ${firstName},</p>
       <blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid #8B5CF6;background:rgba(139,92,246,.08)">${excerpt}</blockquote>`, { label: 'Répondre', url: `${env_1.env.FRONTEND_URL}/client/messages` }),
    }),
};
function formatAmount(amount) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount || 0);
}
