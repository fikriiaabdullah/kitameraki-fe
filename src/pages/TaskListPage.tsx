import { useEffect, useState } from 'react';
import {
    Button, Input, Select, makeStyles, tokens, Spinner,
    Text,
} from '@fluentui/react-components';
import { AddRegular, SearchRegular, FilterRegular } from '@fluentui/react-icons';
import type { Task, TaskStatus, FormField, FormSettings } from '../types';
import { getTasks, insertTask, updateTask, deleteTask, getFormSettings } from '../api/taskApi';
import TaskTable from '../components/TaskTable';
import TaskDialog from '../components/TaskDialog';
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
    },
    toolbar: {
        display: 'flex',
        gap: tokens.spacingHorizontalM,
        marginBottom: tokens.spacingVerticalL,
        flexWrap: 'wrap',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: tokens.spacingVerticalM,
        borderRadius: tokens.borderRadiusMedium,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    searchInput: {
        minWidth: '280px',
        flex: 1,
    },
    filterGroup: {
        display: 'flex',
        gap: tokens.spacingHorizontalS,
        alignItems: 'center',
    },
    filterIcon: {
        color: tokens.colorNeutralForeground3,
    },
    tableWrapper: {
        backgroundColor: 'white',
        borderRadius: tokens.borderRadiusMedium,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        overflow: 'hidden',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
        borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
        backgroundColor: 'white',
    },
    paginationButtons: {
        display: 'flex',
        gap: tokens.spacingHorizontalS,
        alignItems: 'center',
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${tokens.spacingVerticalXXL} 0`,
        gap: tokens.spacingVerticalM,
        color: tokens.colorNeutralForeground3,
    },
});

const PAGE_SIZE = 10;

const defaultFields: FormField[] = [
    { id: 'title', label: 'Title', type: 'text', column: 1, row: 1, isDefault: true },
    { id: 'description', label: 'Description', type: 'text', column: 1, row: 2, isDefault: true },
    { id: 'status', label: 'Status', type: 'text', column: 1, row: 3, isDefault: true },
    { id: 'priority', label: 'Priority', type: 'text', column: 1, row: 4, isDefault: true },
    { id: 'dueDate', label: 'Due Date', type: 'date', column: 1, row: 5, isDefault: true },
    { id: 'assignee', label: 'Assignee', type: 'text', column: 1, row: 6, isDefault: true },
];

export default function TaskListPage() {
    const styles = useStyles();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [formSettings, setFormSettings] = useState<FormSettings>({ organizationId: 'default', fields: [] });
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterPriority, setFilterPriority] = useState('');
    const [page, setPage] = useState(1);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [taskRes, settingsRes] = await Promise.all([getTasks(), getFormSettings()]);
            setTasks(taskRes.data);
            setFormSettings(settingsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (data: Omit<Task, 'id' | 'organizationId'>) => {
        try {
            if (editingTask) {
                await updateTask(editingTask.id, data);
            } else {
                await insertTask(data);
            }
            setEditingTask(undefined);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTask(id);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusChange = async (id: string, status: TaskStatus) => {
        try {
            await updateTask(id, { status });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setDialogOpen(true);
    };

    const filtered = tasks
        .filter(t => !search || t.title?.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase()))
        .filter(t => !filterStatus || t.status === filterStatus)
        .filter(t => !filterPriority || t.priority === filterPriority);

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const allFields = [...defaultFields, ...formSettings.fields.filter(f => !f.isDefault)];

    return (
        <div className={styles.page}>
            <Navbar />
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Text size={600} weight="semibold">Tasks</Text>
                    <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
                        {filtered.length} task{filtered.length !== 1 ? 's' : ''} found
                    </Text>
                </div>
                <Button
                    appearance="primary"
                    icon={<AddRegular />}
                    onClick={() => { setEditingTask(undefined); setDialogOpen(true); }}
                    size="medium"
                >
                    Add Task
                </Button>
            </div>

            <div className={styles.content}>
                <div className={styles.toolbar}>
                    <Input
                        placeholder="Search tasks..."
                        contentBefore={<SearchRegular />}
                        value={search}
                        onChange={(_, d) => { setSearch(d.value); setPage(1); }}
                        className={styles.searchInput}
                    />
                    <div className={styles.filterGroup}>
                        <FilterRegular className={styles.filterIcon} />
                        <Select
                            value={filterStatus}
                            onChange={(_, d) => { setFilterStatus(d.value); setPage(1); }}
                        >
                            <option value="">All Status</option>
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </Select>
                        <Select
                            value={filterPriority}
                            onChange={(_, d) => { setFilterPriority(d.value); setPage(1); }}
                        >
                            <option value="">All Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </Select>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                        <Spinner label="Loading tasks..." />
                    </div>
                ) : (
                    <div className={styles.tableWrapper}>
                        {paginated.length === 0 ? (
                            <div className={styles.emptyState}>
                                <Text size={500}>No tasks found</Text>
                                <Text size={300}>Try adjusting your search or filters, or add a new task.</Text>
                            </div>
                        ) : (
                            <TaskTable
                                tasks={paginated}
                                formFields={allFields}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                            />
                        )}
                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <Text size={300} style={{ color: tokens.colorNeutralForeground3 }}>
                                    Page {page} of {totalPages} · {filtered.length} total
                                </Text>
                                <div className={styles.paginationButtons}>
                                    <Button
                                        appearance="subtle"
                                        disabled={page === 1}
                                        onClick={() => setPage(p => p - 1)}
                                        size="small"
                                    >
                                        Previous
                                    </Button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                        <Button
                                            key={p}
                                            appearance={p === page ? 'primary' : 'subtle'}
                                            onClick={() => setPage(p)}
                                            size="small"
                                            style={{ minWidth: '32px' }}
                                        >
                                            {p}
                                        </Button>
                                    ))}
                                    <Button
                                        appearance="subtle"
                                        disabled={page === totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                        size="small"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <TaskDialog
                open={dialogOpen}
                onClose={() => { setDialogOpen(false); setEditingTask(undefined); }}
                onSubmit={handleSubmit}
                initialData={editingTask}
                formFields={allFields}
            />
        </div>
    );
}