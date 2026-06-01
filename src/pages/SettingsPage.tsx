import { useState, useEffect } from 'react';
import {
    Button, Input, Select, makeStyles, tokens, Spinner,
    Text, Badge,
} from '@fluentui/react-components';
import { AddRegular, DeleteRegular, SaveRegular, ReOrderRegular } from '@fluentui/react-icons';
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
    useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FormField, FieldType, FormSettings } from '../types';
import { getFormSettings, saveFormSettings } from '../api/taskApi';
import Navbar from '../components/Navbar';

const useStyles = makeStyles({
    page: { display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f3f2f1' },
    header: {
        backgroundColor: 'white',
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalXS,
    },
    content: {
        padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
        flex: 1,
        maxWidth: '860px',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: tokens.borderRadiusMedium,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        marginBottom: tokens.spacingVerticalL,
    },
    cardHeader: {
        padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        backgroundColor: '#faf9f8',
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
    },
    cardBody: {
        padding: tokens.spacingVerticalM,
    },
    fieldRow: {
        display: 'flex',
        gap: tokens.spacingHorizontalM,
        alignItems: 'center',
        padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
        backgroundColor: 'white',
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        borderRadius: tokens.borderRadiusMedium,
        marginBottom: tokens.spacingVerticalS,
        transition: 'box-shadow 0.15s, border-color 0.15s',
        ':hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: `1px solid ${tokens.colorNeutralStroke1}`,
        },
    },
    dragHandle: {
        cursor: 'grab',
        color: tokens.colorNeutralForeground3,
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${tokens.spacingHorizontalXS}`,
        ':hover': {
            color: tokens.colorNeutralForeground1,
        },
    },
    fieldInput: {
        flex: 1,
    },
    columnLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalXS,
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase200,
        minWidth: '80px',
    },
    actions: {
        display: 'flex',
        gap: tokens.spacingHorizontalS,
        marginTop: tokens.spacingVerticalL,
        justifyContent: 'flex-end',
    },
    infoBox: {
        backgroundColor: '#eff6fc',
        border: `1px solid #c7e0f4`,
        borderRadius: tokens.borderRadiusMedium,
        padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
        marginBottom: tokens.spacingVerticalM,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacingHorizontalS,
    },
});

interface SortableFieldProps {
    field: FormField;
    onChange: (id: string, key: keyof FormField, value: unknown) => void;
    onDelete: (id: string) => void;
}

function SortableField({ field, onChange, onDelete }: SortableFieldProps) {
    const styles = useStyles();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isDragging ? '0 4px 16px rgba(0,0,0,0.15)' : undefined,
    };

    return (
        <div ref={setNodeRef} style={style} className={styles.fieldRow}>
            <span {...attributes} {...listeners} className={styles.dragHandle}>
                <ReOrderRegular fontSize={18} />
            </span>
            <Input
                value={field.label}
                onChange={(_, d) => onChange(field.id, 'label', d.value)}
                className={styles.fieldInput}
                disabled={field.isDefault}
                placeholder="Field label"
            />
            <Select
                value={field.type}
                onChange={(_, d) => onChange(field.id, 'type', d.value)}
                disabled={field.isDefault}
                style={{ minWidth: '150px' }}
            >
                <option value="text">Text</option>
                <option value="date">Date</option>
                <option value="datetime">Date and Time</option>
                <option value="email">Email</option>
            </Select>
            <Select
                value={String(field.column)}
                onChange={(_, d) => onChange(field.id, 'column', Number(d.value) as 1 | 2)}
                disabled={field.isDefault}
                style={{ minWidth: '110px' }}
            >
                <option value="1">1 Column</option>
                <option value="2">2 Columns</option>
            </Select>
            {field.isDefault ? (
                <Badge color="informative" shape="rounded" style={{ minWidth: '64px', justifyContent: 'center' }}>
                    Default
                </Badge>
            ) : (
                <Button
                    icon={<DeleteRegular />}
                    appearance="subtle"
                    size="small"
                    style={{ color: tokens.colorPaletteRedForeground1 }}
                    onClick={() => onDelete(field.id)}
                />
            )}
        </div>
    );
}

const defaultFields: FormField[] = [
    { id: 'title', label: 'Title', type: 'text', column: 1, row: 1, isDefault: true },
    { id: 'description', label: 'Description', type: 'text', column: 1, row: 2, isDefault: true },
    { id: 'status', label: 'Status', type: 'text', column: 1, row: 3, isDefault: true },
    { id: 'priority', label: 'Priority', type: 'text', column: 1, row: 4, isDefault: true },
    { id: 'dueDate', label: 'Due Date', type: 'date', column: 1, row: 5, isDefault: true },
    { id: 'assignee', label: 'Assignee', type: 'text', column: 1, row: 6, isDefault: true },
];

export default function SettingsPage() {
    const styles = useStyles();
    const [fields, setFields] = useState<FormField[]>(defaultFields);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        getFormSettings().then(res => {
            if (res.data.fields && res.data.fields.length > 0) {
                setFields([...defaultFields, ...res.data.fields.filter((f: FormField) => !f.isDefault)]);
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setFields(prev => {
                const oldIndex = prev.findIndex(f => f.id === active.id);
                const newIndex = prev.findIndex(f => f.id === over.id);
                return arrayMove(prev, oldIndex, newIndex).map((f, i) => ({ ...f, row: i + 1 }));
            });
        }
    };

    const handleChange = (id: string, key: keyof FormField, value: unknown) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    const handleDelete = (id: string) => {
        setFields(prev => prev.filter(f => f.id !== id));
    };

    const handleAddField = () => {
        const newField: FormField = {
            id: `field_${Date.now()}`,
            label: 'New Field',
            type: 'text' as FieldType,
            column: 1,
            row: fields.length + 1,
            isDefault: false,
        };
        setFields(prev => [...prev, newField]);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const settings: FormSettings = {
                organizationId: 'default',
                fields,
            };
            await saveFormSettings(settings);
            alert('Settings saved successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className={styles.page}>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <Spinner label="Loading settings..." />
            </div>
        </div>
    );

    const customFields = fields.filter(f => !f.isDefault);

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Text size={600} weight="semibold">Form Settings</Text>
                    <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
                        Configure the fields shown in the task form
                    </Text>
                </div>
                <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
                    <Button icon={<AddRegular />} onClick={handleAddField}>
                        Add Field
                    </Button>
                    <Button
                        appearance="primary"
                        icon={<SaveRegular />}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.infoBox}>
                    <Text size={200} style={{ color: '#0078d4' }}>
                        💡 Drag fields to reorder them. Default fields cannot be modified or deleted. Custom fields will appear at the end of the form.
                    </Text>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Text weight="semibold">Default Fields</Text>
                        <Badge color="informative" size="small">{defaultFields.length}</Badge>
                    </div>
                    <div className={styles.cardBody}>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext
                                items={fields.filter(f => f.isDefault).map(f => f.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {fields.filter(f => f.isDefault).map(field => (
                                    <SortableField
                                        key={field.id}
                                        field={field}
                                        onChange={handleChange}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Text weight="semibold">Custom Fields</Text>
                        <Badge color="success" size="small">{customFields.length}</Badge>
                    </div>
                    <div className={styles.cardBody}>
                        {customFields.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: `${tokens.spacingVerticalL} 0`, color: tokens.colorNeutralForeground3 }}>
                                <Text size={300}>No custom fields yet. Click "Add Field" to add one.</Text>
                            </div>
                        ) : (
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext
                                    items={customFields.map(f => f.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {customFields.map(field => (
                                        <SortableField
                                            key={field.id}
                                            field={field}
                                            onChange={handleChange}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}