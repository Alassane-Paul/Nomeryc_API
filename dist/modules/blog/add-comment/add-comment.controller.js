"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addComment = void 0;
const response_1 = require("../../../utils/response");
const errorHandler_1 = require("../../../middlewares/errorHandler");
const add_comment_service_1 = require("./add-comment.service");
exports.addComment = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const result = await (0, add_comment_service_1.addCommentService)(req.params.slug, req.body);
    if ('error' in result && result.error === 'not-found')
        return (0, response_1.sendError)(res, '30', 'Article non trouvé');
    if ('error' in result && result.error === 'invalid')
        return (0, response_1.sendError)(res, '11', 'Nom et commentaire requis');
    return (0, response_1.sendResponse)(res, {
        responseCode: '01',
        responseMessage: 'Commentaire soumis pour modération',
        data: result.comment,
    });
});
