"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = deleteTask;
const task_model_1 = require("../../../models/task.model");
async function deleteTask(id) {
    const task = await task_model_1.Task.findByPk(id);
    if (!task)
        return false;
    await task.destroy();
    return true;
}
