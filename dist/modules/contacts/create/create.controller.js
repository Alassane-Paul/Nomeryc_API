"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactRequest = void 0;
const response_1 = require("../../../utils/response");
const errorHandler_1 = require("../../../middlewares/errorHandler");
const create_service_1 = require("./create.service");
exports.createContactRequest = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const parsed = create_service_1.contactSchema.safeParse(req.body);
    if (!parsed.success)
        return (0, response_1.sendError)(res, '10', 'Données invalides', parsed.error.flatten());
    const contact = await (0, create_service_1.createContactRequestService)(parsed.data);
    return (0, response_1.sendResponse)(res, {
        responseCode: '01',
        responseMessage: 'Votre message a bien été envoyé. Nous vous contacterons bientôt !',
        data: { id: contact.id },
    });
});
