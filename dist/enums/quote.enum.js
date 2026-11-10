"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountType = exports.QuoteStatus = void 0;
// Statuts de devis
var QuoteStatus;
(function (QuoteStatus) {
    QuoteStatus["BROUILLON"] = "brouillon";
    QuoteStatus["ENVOYE"] = "envoye";
    QuoteStatus["ACCEPTE"] = "accepte";
    QuoteStatus["REFUSE"] = "refuse";
    QuoteStatus["EXPIRE"] = "expire";
})(QuoteStatus || (exports.QuoteStatus = QuoteStatus = {}));
// Types de remise
var DiscountType;
(function (DiscountType) {
    DiscountType["POURCENTAGE"] = "pourcentage";
    DiscountType["FIXE"] = "fixe";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
