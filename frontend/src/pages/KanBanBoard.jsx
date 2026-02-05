import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Card, Col, Row, Select, Modal, Form, Input, InputNumber, message, Tag, Empty } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { tasksService } from '../services/tasksService';
import MainLayout from '../components/MainLayout';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const KanBanBoard = () => {
    const [sprints, setSprints] = useState([]);
    const [currentSprintId, setCurrentSprintId] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [teamId, setTeamId] = useState(null);

    // Modal controls
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
    const [taskForm] = Form.useForm();
    const [sprintForm] = Form.useForm();

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await tasksService.getAllTasks();
            const allTasks = res.data?.tasks || res.data || [];
            setTasks(allTasks);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
            if (error.response?.status !== 401) {
                message.error("Failed to load tasks");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchSprintTasks = async (sprintId) => {
        setLoading(true);
        try {
            const res = await tasksService.getSprintTasks(sprintId);
            setTasks(res.data?.tasks || res.data || []);
        } catch (error) {
            console.error("Failed to fetch sprint tasks", error);
            message.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initial load
        fetchTasks();
    }, []);

    useEffect(() => {
        if (currentSprintId) {
            fetchSprintTasks(currentSprintId);
        }
    }, [currentSprintId]);

    const handleCreateTask = async (values) => {
        // Validate sprint is selected
        if (!currentSprintId) {
            message.warning('Please select or create a Sprint first');
            return;
        }

        try {
            await tasksService.createTask({
                ...values,
                sprint_id: currentSprintId,
                status: 'TODO' // Backend expects uppercase
            });
            message.success('Task created');
            setIsTaskModalOpen(false);
            taskForm.resetFields();
            if (currentSprintId) fetchSprintTasks(currentSprintId);
            else fetchTasks();
        } catch (error) {
            console.error("Create task error:", error);
            message.error(error.response?.data?.detail || 'Failed to create task');
        }
    };

    const handleCreateSprint = async (values) => {
        // Validate team_id
        if (!values.team_id) {
            message.warning('Please enter a Team ID');
            return;
        }

        try {
            const res = await tasksService.createSprint({
                team_id: values.team_id,
                name: values.name,
                start_date: values.start_date,
                end_date: values.end_date
            });
            message.success('Sprint created');
            setIsSprintModalOpen(false);
            sprintForm.resetFields();
            // Set the new sprint as current
            if (res.data && res.data.sprint_id) {
                setCurrentSprintId(res.data.sprint_id);
                setSprints(prev => [...prev, res.data]);
            }
        } catch (error) {
            console.error("Create sprint error:", error);
            message.error(error.response?.data?.detail || 'Failed to create sprint');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        // Map frontend status to backend status
        const statusMap = {
            'To Do': 'TODO',
            'In Progress': 'DOING',
            'Review': 'REVIEW',
            'Done': 'DONE'
        };

        const backendStatus = statusMap[newStatus] || newStatus;

        try {
            await tasksService.changeStatus(taskId, backendStatus);
            message.success("Status updated");
            // Optimistic update
            setTasks(prev => prev.map(t =>
                (t.task_id === taskId || t.id === taskId)
                    ? { ...t, status: backendStatus }
                    : t
            ));
        } catch (error) {
            console.error("Status change error:", error);
            message.error(error.response?.data?.detail || "Failed to update status");
        }
    };

    // Status columns matching backend
    const columns = [
        { key: 'TODO', label: 'To Do' },
        { key: 'DOING', label: 'In Progress' },
        { key: 'REVIEW', label: 'Review' },
        { key: 'DONE', label: 'Done' }
    ];

    const getTasksForStatus = (statusKey) => {
        return tasks.filter(t => (t.status || 'TODO') === statusKey);
    };

    return (
        <MainLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Title level={2} style={{ margin: '0 0 8px 0', fontWeight: 'normal' }}>Kanban Board</Title>
                <div style={{ display: 'flex', gap: 10 }}>
                    <Button icon={<ReloadOutlined />} onClick={() => currentSprintId ? fetchSprintTasks(currentSprintId) : fetchTasks()}>
                        Refresh
                    </Button>
                    <Button onClick={() => setIsSprintModalOpen(true)}>New Sprint</Button>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        if (!currentSprintId) {
                            message.warning('Please create and select a Sprint first');
                            setIsSprintModalOpen(true);
                        } else {
                            setIsTaskModalOpen(true);
                        }
                    }}>
                        New Task
                    </Button>
                </div>
            </div>

            {/* Sprint selector */}
            <div style={{ marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span>Sprint:</span>
                <Select
                    style={{ width: 200 }}
                    placeholder="Select Sprint"
                    onChange={setCurrentSprintId}
                    value={currentSprintId}
                    allowClear
                >
                    {sprints.map(s => <Option key={s.sprint_id} value={s.sprint_id}>{s.name}</Option>)}
                </Select>
                {!sprints.length && <span style={{ color: '#888' }}>(Create a Sprint first)</span>}
            </div>

            <Row gutter={16}>
                {columns.map(col => (
                    <Col span={6} key={col.key}>
                        <Card
                            title={<>{col.label} <Tag>{getTasksForStatus(col.key).length}</Tag></>}
                            style={{ background: '#f0f2f5', minHeight: 500 }}
                            loading={loading}
                        >
                            {getTasksForStatus(col.key).length === 0 ? (
                                <Empty description="No tasks" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            ) : (
                                getTasksForStatus(col.key).map(task => (
                                    <Card
                                        key={task.task_id || task.id}
                                        style={{ marginBottom: 10, cursor: 'pointer' }}
                                        size="small"
                                        title={task.title}
                                        extra={<Tag color={task.priority === 'HIGH' ? 'red' : task.priority === 'MEDIUM' ? 'orange' : 'green'}>{task.priority || 'Normal'}</Tag>}
                                    >
                                        <p style={{ fontSize: 12, color: '#666' }}>{task.description}</p>
                                        <Select
                                            value={task.status}
                                            size="small"
                                            onChange={(val) => handleStatusChange(task.task_id || task.id, val)}
                                            style={{ width: '100%' }}
                                        >
                                            {columns.map(c => <Option key={c.key} value={c.key}>{c.label}</Option>)}
                                        </Select>
                                    </Card>
                                ))
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Create Task Modal */}
            <Modal
                title="Create Task"
                open={isTaskModalOpen}
                onCancel={() => setIsTaskModalOpen(false)}
                onOk={() => taskForm.submit()}
            >
                <Form form={taskForm} layout="vertical" onFinish={handleCreateTask}>
                    <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter title' }]}>
                        <Input placeholder="Task title" />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea placeholder="Task description" />
                    </Form.Item>
                    <Form.Item name="priority" label="Priority" initialValue="MEDIUM">
                        <Select>
                            <Option value="LOW">Low</Option>
                            <Option value="MEDIUM">Medium</Option>
                            <Option value="HIGH">High</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Create Sprint Modal */}
            <Modal
                title="Create Sprint"
                open={isSprintModalOpen}
                onCancel={() => setIsSprintModalOpen(false)}
                onOk={() => sprintForm.submit()}
            >
                <Form form={sprintForm} layout="vertical" onFinish={handleCreateSprint}>
                    <Form.Item
                        name="team_id"
                        label="Team ID"
                        rules={[{ required: true, message: 'Please enter Team ID' }]}
                        tooltip="Enter the ID of your team"
                    >
                        <InputNumber min={1} placeholder="Enter Team ID" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Sprint Name"
                        rules={[{ required: true, message: 'Please enter Sprint name' }]}
                    >
                        <Input placeholder="e.g. Sprint 1 - Setup" />
                    </Form.Item>
                    <Form.Item name="start_date" label="Start Date">
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="end_date" label="End Date">
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Modal>
        </MainLayout>
    );
};

export default KanBanBoard;
