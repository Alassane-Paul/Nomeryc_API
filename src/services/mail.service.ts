import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';

let transporter: Transporter | null = null;

/**
 * Transport SMTP créé à la demande. Si aucun SMTP_HOST n'est configuré,
 * on ne plante pas : les mails sont simplement loggés (mode dev).
 */
function getTransporter(): Transporter | null {
  if (!env.SMTP_HOST || !env.SMTP_USER) return null;
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD },
  });

  return transporter;
}

interface MailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/** Envoi bas niveau. Ne throw jamais : un mail raté ne doit pas casser une requête API. */
export async function sendMail({ to, subject, html, text }: MailOptions): Promise<boolean> {
  const tx = getTransporter();

  if (!tx) {
    console.warn(`📧 [MAIL NON ENVOYÉ - SMTP non configuré] → ${to} : ${subject}`);
    return false;
  }

  try {
    await tx.sendMail({ from: env.SMTP_FROM, to, subject, html, text: text || stripHtml(html) });
    return true;
  } catch (error: any) {
    console.error(`❌ Échec envoi mail à ${to} :`, error?.message);
    return false;
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// ===================== TEMPLATE DE BASE =====================

function layout(title: string, body: string, cta?: { label: string; url: string }): string {
  return `
  <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#0F0A1E;padding:32px;color:#E5E7EB">
    <div style="max-width:560px;margin:0 auto;background:#1A1230;border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden">
      <div style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,.08)">
        <span style="font-size:20px;font-weight:800;color:#8B5CF6">Nomeryc</span>
      </div>
      <div style="padding:28px">
        <h1 style="margin:0 0 16px;font-size:20px;color:#fff">${title}</h1>
        <div style="font-size:14px;line-height:1.7;color:#C9C6D4">${body}</div>
        ${
          cta
            ? `<a href="${cta.url}" style="display:inline-block;margin-top:24px;background:#8B5CF6;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px">${cta.label}</a>`
            : ''
        }
      </div>
      <div style="padding:18px 28px;border-top:1px solid rgba(255,255,255,.08);font-size:11px;color:#6B7280">
        Nomeryc — Automatisation & développement sur mesure.<br>
        Cet email est automatique, merci de ne pas y répondre directement.
      </div>
    </div>
  </div>`;
}

// ===================== TEMPLATES MÉTIER =====================

export const mailTemplates = {
  welcome: (firstName: string) => ({
    subject: 'Bienvenue chez Nomeryc 👋',
    html: layout(
      `Bienvenue ${firstName} !`,
      `<p>Votre espace client Nomeryc est prêt. Vous pouvez y suivre vos projets, consulter vos devis et factures, et échanger directement avec notre équipe.</p>`,
      { label: 'Accéder à mon espace', url: `${env.FRONTEND_URL}/client` }
    ),
  }),

  newsletterWelcome: () => ({
    subject: 'Bienvenue dans la newsletter Nomeryc 📬',
    html: layout(
      'Merci de votre inscription !',
      `<p>Vous recevrez désormais nos derniers articles sur le développement web, mobile et l'automatisation, directement dans votre boîte mail.</p>
       <p style="color:#9CA3AF;font-size:13px">Vous pouvez vous désabonner à tout moment via le lien présent en bas de chaque email.</p>`,
      { label: 'Découvrir le blog', url: `${env.FRONTEND_URL}/blog` }
    ),
  }),

  passwordReset: (firstName: string, resetUrl: string) => ({
    subject: 'Réinitialisation de votre mot de passe',
    html: layout(
      'Réinitialisation de mot de passe',
      `<p>Bonjour ${firstName},</p>
       <p>Vous avez demandé à réinitialiser votre mot de passe. Ce lien est valable <strong>1 heure</strong>.</p>
       <p style="color:#9CA3AF;font-size:13px">Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email : votre mot de passe reste inchangé.</p>`,
      { label: 'Choisir un nouveau mot de passe', url: resetUrl }
    ),
  }),

  contactReceived: (name: string, email: string, message: string) => ({
    subject: `Nouvelle demande de contact — ${name}`,
    html: layout(
      'Nouvelle demande de contact',
      `<p><strong>${name}</strong> (${email}) vous a écrit :</p>
       <blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid #8B5CF6;background:rgba(139,92,246,.08)">${message}</blockquote>`,
      { label: 'Voir dans le back-office', url: `${env.FRONTEND_URL}/admin/contacts` }
    ),
  }),

  quoteSent: (firstName: string, quoteNumber: string, totalTTC: number) => ({
    subject: `Votre devis ${quoteNumber}`,
    html: layout(
      `Votre devis est disponible`,
      `<p>Bonjour ${firstName},</p>
       <p>Votre devis <strong>${quoteNumber}</strong> d'un montant de <strong>${formatAmount(totalTTC)}</strong> TTC est consultable dans votre espace client.</p>`,
      { label: 'Consulter le devis', url: `${env.FRONTEND_URL}/client/devis` }
    ),
  }),

  invoiceSent: (firstName: string, invoiceNumber: string, totalTTC: number, dueDate?: Date) => ({
    subject: `Votre facture ${invoiceNumber}`,
    html: layout(
      'Nouvelle facture',
      `<p>Bonjour ${firstName},</p>
       <p>Votre facture <strong>${invoiceNumber}</strong> d'un montant de <strong>${formatAmount(totalTTC)}</strong> TTC est disponible.</p>
       ${dueDate ? `<p>Échéance de règlement : <strong>${new Date(dueDate).toLocaleDateString('fr-FR')}</strong>.</p>` : ''}`,
      { label: 'Consulter la facture', url: `${env.FRONTEND_URL}/client/factures` }
    ),
  }),

  invoicePaid: (firstName: string, invoiceNumber: string, totalTTC: number) => ({
    subject: `Paiement reçu — ${invoiceNumber}`,
    html: layout(
      'Paiement bien reçu',
      `<p>Bonjour ${firstName},</p>
       <p>Nous confirmons la réception de votre règlement de <strong>${formatAmount(totalTTC)}</strong> pour la facture <strong>${invoiceNumber}</strong>. Merci !</p>`
    ),
  }),

  newMessage: (firstName: string, excerpt: string) => ({
    subject: 'Nouveau message de l\'équipe Nomeryc',
    html: layout(
      'Vous avez un nouveau message',
      `<p>Bonjour ${firstName},</p>
       <blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid #8B5CF6;background:rgba(139,92,246,.08)">${excerpt}</blockquote>`,
      { label: 'Répondre', url: `${env.FRONTEND_URL}/client/messages` }
    ),
  }),
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount || 0);
}
