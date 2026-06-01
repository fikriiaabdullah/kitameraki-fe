export type TaskStatus = 'Todo' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type FieldType = 'text' | 'date' | 'datetime' | 'email';

export interface Task {
    id: string;
    organizationId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    assignee: string;
    [key: string]: unknown;
}

export interface FormField {
    id: string;
    label: string;
    type: FieldType;
    column: 1 | 2;
    row: number;
    isDefault: boolean;
}

export interface FormSettings {
    organizationId: string;
    fields: FormField[];
}