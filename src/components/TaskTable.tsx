import {
    Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow,
    Badge, Button, Select, makeStyles, tokens, Text, Tooltip,
} from '@fluentui/react-components';
import { EditRegular, DeleteRegular } from '@fluentui/react-icons';
import type { Task, TaskStatus, FormField } from '../types';

const useStyles = makeStyles({
    table: {
        width: '100%',
    },
    headerRow: {
        backgroundColor: '#f8f8f8',
    },
    headerCell: {
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorNeutralForeground2,
        fontSize: tokens.fontSizeBase200,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
        borderBottom: `2px solid ${tokens.colorNeutralStroke1}`,
    },
    row: {
        ':hover': {
            backgroundColor: '#f3f2f1',
        },
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        transition: 'background-color 0.1s',
    },
    cell: {
        padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
        verticalAlign: 'middle',
    },
    titleCell: {
        fontWeight: tokens.fontWeightSemibold,
        color: tokens.colorNeutralForeground1,
    },
    descCell: {
        color: tokens.colorNeutralForeground3,
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    actions: {
        display: 'flex',
        gap: tokens.spacingHorizontalXS,
        opacity: 0,
        transition: 'opacity 0.15s',
    },
    actionsVisible: {
        opacity: 1,
    },
    statusSelect: {
        minWidth: '130px',
    },
});

const statusColor = (status: TaskStatus) => {
    if (status === 'Done') return 'success';
    if (status === 'In Progress') return 'warning';
    return 'informative';
};

const priorityColor = (priority: string) => {
    if (priority === 'High') return 'danger';
    if (priority === 'Medium') return 'warning';
    return 'success';
};

interface TaskTableProps {
    tasks: Task[];
    formFields: FormField[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: TaskStatus) => void;
}

export default function TaskTable({ tasks, formFields, onEdit, onDelete, onStatusChange }: TaskTableProps) {
    const styles = useStyles();
    const extraFields = formFields.filter(f => !f.isDefault);

    return (
        <Table className={styles.table}>
            <TableHeader>
                <TableRow className={styles.headerRow}>
                    <TableHeaderCell className={styles.headerCell}>Title</TableHeaderCell>
                    <TableHeaderCell className={styles.headerCell}>Description</TableHeaderCell>
                    <TableHeaderCell className={styles.headerCell}>Status</TableHeaderCell>
                    <TableHeaderCell className={styles.headerCell}>Priority</TableHeaderCell>
                    <TableHeaderCell className={styles.headerCell}>Due Date</TableHeaderCell>
                    <TableHeaderCell className={styles.headerCell}>Assignee</TableHeaderCell>
                    {extraFields.map(f => (
                        <TableHeaderCell key={f.id} className={styles.headerCell}>{f.label}</TableHeaderCell>
                    ))}
                    <TableHeaderCell className={styles.headerCell}>Actions</TableHeaderCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.map(task => (
                    <TableRow key={task.id} className={styles.row}>
                        <TableCell className={styles.cell}>
                            <Text className={styles.titleCell}>{task.title}</Text>
                        </TableCell>
                        <TableCell className={styles.cell}>
                            <Tooltip content={task.description || '-'} relationship="label">
                                <Text className={styles.descCell}>{task.description || '-'}</Text>
                            </Tooltip>
                        </TableCell>
                        <TableCell className={styles.cell}>
                            <Select
                                value={task.status}
                                onChange={(_, d) => onStatusChange(task.id, d.value as TaskStatus)}
                                className={styles.statusSelect}
                            >
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </Select>
                        </TableCell>
                        <TableCell className={styles.cell}>
                            <Badge color={priorityColor(task.priority)} shape="rounded">
                                {task.priority}
                            </Badge>
                        </TableCell>
                        <TableCell className={styles.cell}>
                            <Text size={300}>{task.dueDate || '-'}</Text>
                        </TableCell>
                        <TableCell className={styles.cell}>
                            <Text size={300}>{task.assignee || '-'}</Text>
                        </TableCell>
                        {extraFields.map(f => (
                            <TableCell key={f.id} className={styles.cell}>
                                <Text size={300}>{task[f.id] as string || '-'}</Text>
                            </TableCell>
                        ))}
                        <TableCell className={styles.cell}>
                            <div className={`${styles.actions} ${styles.actionsVisible}`}>
                                <Tooltip content="Edit task" relationship="label">
                                    <Button
                                        icon={<EditRegular />}
                                        appearance="subtle"
                                        size="small"
                                        onClick={() => onEdit(task)}
                                    />
                                </Tooltip>
                                <Tooltip content="Delete task" relationship="label">
                                    <Button
                                        icon={<DeleteRegular />}
                                        appearance="subtle"
                                        size="small"
                                        style={{ color: tokens.colorPaletteRedForeground1 }}
                                        onClick={() => onDelete(task.id)}
                                    />
                                </Tooltip>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}