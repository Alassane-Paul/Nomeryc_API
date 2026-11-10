"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPriority = exports.TaskStatus = void 0;
// Statuts de tâche (colonnes du kanban)
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "todo";
    TaskStatus["IN_PROGRESS"] = "in_progress";
    TaskStatus["DONE"] = "done";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
// Priorités
var TaskPriority;
(function (TaskPriority) {
    TaskPriority["HAUTE"] = "haute";
    TaskPriority["MOYENNE"] = "moyenne";
    TaskPriority["BASSE"] = "basse";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
