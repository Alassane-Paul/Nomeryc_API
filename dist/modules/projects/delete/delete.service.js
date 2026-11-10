"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = deleteProject;
const project_model_1 = require("../../../models/project.model");
async function deleteProject(id) {
    const project = await project_model_1.Project.findByPk(id);
    if (!project)
        return false;
    await project.destroy();
    return true;
}
