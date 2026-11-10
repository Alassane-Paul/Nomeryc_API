"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactRequestService = deleteContactRequestService;
const contactRequest_model_1 = require("../../../models/contactRequest.model");
async function deleteContactRequestService(id) {
    const contact = await contactRequest_model_1.ContactRequest.findByPk(id);
    if (!contact)
        return false;
    await contact.destroy();
    return true;
}
