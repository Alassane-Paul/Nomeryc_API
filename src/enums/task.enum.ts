// Statuts de tâche (colonnes du kanban)
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

// Priorités
export enum TaskPriority {
  HAUTE = 'haute',
  MOYENNE = 'moyenne',
  BASSE = 'basse',
}

export type TaskStatusValue = `${TaskStatus}`;
export type TaskPriorityValue = `${TaskPriority}`;
