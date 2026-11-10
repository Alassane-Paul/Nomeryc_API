import { Request, Response } from 'express';
import { sendError, sendResponse } from '../../../utils/response';
import { asyncHandler } from '../../../middlewares/errorHandler';
import { contactSchema, createContactRequestService } from './create.service';

export const createContactRequest = asyncHandler(async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) return sendError(res, '10', 'Données invalides', parsed.error.flatten());

  const contact = await createContactRequestService(parsed.data);
  return sendResponse(res, {
    responseCode: '01',
    responseMessage: 'Votre message a bien été envoyé. Nous vous contacterons bientôt !',
    data: { id: contact.id },
  });
});
