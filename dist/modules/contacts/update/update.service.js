"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactStatusService = updateContactStatusService;
const contactRequest_model_1 = require("../../../models/contactRequest.model");
async function updateContactStatusService(id, data) {
    const contact = await contactRequest_model_1.ContactRequest.findByPk(id);
    if (!contact)
        return null;
    await contact.update({ status: data.status, notes: data.notes, assignedTo: data.assignedTo });
    return contact;
}
