import { useEffect, useState } from 'react';
import {
    Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface,
    DialogTitle, DialogTrigger, Field, Input, Select, Textarea,
} from '@fluentui/react-components';
import type { Task, TaskPriority, TaskStatus, FormField } from '../types';

interface TaskDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (task: Omit<Task, 'id' | 'organizationId'>) => void;
    initialData?: Task;
    formFields: FormField[];
}

const defaultForm = {
    title: '',
    description: '',
    status: 'Todo' as TaskStatus,
    priority: 'Medium' as TaskPriority,
    dueDate: '',
    assignee: '',
};

export default function TaskDialog({ open, onClose, onSubmit, initialData, formFields }: TaskDialogProps) {
    const [form, setForm] = useState<Record<string, unknown>>(defaultForm);

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            setForm(defaultForm);
        }
    }, [initialData, open]);

    const handleChange = (key: string, value: unknown) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        onSubmit(form as Omit<Task, 'id' | 'organizationId'>);
        onClose();
    };

    const renderField = (field: FormField) => {
        const value = (form[field.id] as string) || '';
        switch (field.type) {
            case 'date':
                return (
                    <Field key={field.id} label={field.label}>
                        <Input type="date" value={value} onChange={(_, d) => handleChange(field.id, d.value)} />
                    </Field>
                );
            case 'datetime':
                return (
                    <Field key={field.id} label={field.label}>
                        <Input type="datetime-local" value={value} onChange={(_, d) => handleChange(field.id, d.value)} />
                    </Field>
                );
            case 'email':
                return (
                    <Field key={field.id} label={field.label}>
                        <Input type="email" value={value} onChange={(_, d) => handleChange(field.id, d.value)} />
                    </Field>
                );
            default:
                return (
                    <Field key={field.id} label={field.label}>
                        <Input value={value} onChange={(_, d) => handleChange(field.id, d.value)} />
                    </Field>
                );
        }
    };

    return (
        <Dialog open={open} onOpenChange={(_, d) => { if (!d.open) onClose(); }}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{initialData ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                    <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Field label="Title" required>
                            <Input value={form.title as string} onChange={(_, d) => handleChange('title', d.value)} />
                        </Field>
                        <Field label="Description">
                            <Textarea value={form.description as string} onChange={(_, d) => handleChange('description', d.value)} />
                        </Field>
                        <Field label="Status">
                            <Select value={form.status as string} onChange={(_, d) => handleChange('status', d.value)}>
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </Select>
                        </Field>
                        <Field label="Priority">
                            <Select value={form.priority as string} onChange={(_, d) => handleChange('priority', d.value)}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </Select>
                        </Field>
                        <Field label="Due Date">
                            <Input type="date" value={form.dueDate as string} onChange={(_, d) => handleChange('dueDate', d.value)} />
                        </Field>
                        <Field label="Assignee">
                            <Input value={form.assignee as string} onChange={(_, d) => handleChange('assignee', d.value)} />
                        </Field>
                        {formFields.filter(f => !f.isDefault).map(renderField)}
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary" onClick={onClose}>Cancel</Button>
                        </DialogTrigger>
                        <Button appearance="primary" onClick={handleSubmit}>
                            {initialData ? 'Save' : 'Add Task'}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}