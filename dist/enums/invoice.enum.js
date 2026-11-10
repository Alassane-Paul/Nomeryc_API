"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.InvoiceStatus = void 0;
// Statuts de facture
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["BROUILLON"] = "brouillon";
    InvoiceStatus["ENVOYE"] = "envoye";
    InvoiceStatus["PAYE"] = "paye";
    InvoiceStatus["PARTIELLEMENT_PAYE"] = "partiellement_paye";
    InvoiceStatus["EN_RETARD"] = "en_retard";
    InvoiceStatus["ANNULE"] = "annule";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
// Méthodes de paiement
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["VIREMENT"] = "virement";
    PaymentMethod["CARTE"] = "carte";
    PaymentMethod["PAYPAL"] = "paypal";
    PaymentMethod["CHEQUE"] = "cheque";
    PaymentMethod["MOBILE_MONEY"] = "mobile_money";
    PaymentMethod["ESPECES"] = "especes";
    PaymentMethod["AUTRE"] = "autre";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
