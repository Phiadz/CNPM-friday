import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Layout, Typography, Button, Card, Row, Col, Progress, List,
    Avatar, Space, Badge, Input, Upload, Timeline, Tag, Divider
} from 'antd';
import {
    SettingOutlined, BellOutlined, SearchOutlined, PlusOutlined,
    DashboardOutlined, TeamOutlined, DesktopOutlined, TableOutlined,
    FileTextOutlined, VideoCameraOutlined, SendOutlined, FormOutlined,
    LogoutOutlined, UserOutlined, MenuOutlined, FilePdfOutlined,
    FileImageOutlined, FileOutlined, ClockCircleOutlined, UploadOutlined,
    MoreOutlined, CheckCircleOutlined, SyncOutlined, PlayCircleOutlined,
    FolderOutlined, CloudUploadOutlined, CalendarOutlined, ProjectOutlined,
    LeftOutlined, RightOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;

const ProjectDashboard = () => {
    const navigate = useNavigate();
    const [userData] = useState({ name: 'Alex Johnson' });
    const [collapsed, setCollapsed] = useState(false);
    const [avatarUrl] = useState(localStorage.getItem('user_avatar'));
    const [currentDate, setCurrentDate] = useState(dayjs());

    // Active Projects Data
    const activeProjects = [
        { id: 1, title: 'Project A', description: 'Website redesign with improved UX and responsive layout', icon: <PlayCircleOutlined /> },
        { id: 2, title: 'Project B', description: 'Mobile app development for campus navigation', icon: <PlayCircleOutlined /> },
        { id: 3, title: 'Project C', description: 'AI-powered learning assistant system', icon: <PlayCircleOutlined /> },
        { id: 4, title: 'Project D', description: 'E-commerce platform optimization', icon: <PlayCircleOutlined /> },
    ];

    // Recent Files Data
    const recentFiles = [
        { name: 'Test_report_2025.pdf', size: '1.0 MB', time: '2h ago', icon: <FilePdfOutlined />, type: 'PDF' },
        { name: 'Mockup.fig', size: '4.2 MB', time: '2h ago', icon: <FileImageOutlined />, type: 'Design' },
        { name: 'Requirements.docx', size: '1.1 MB', time: '1d ago', icon: <FileOutlined />, type: 'Document' },
        { name: 'Design_specs.pdf', size: '3.5 MB', time: '1d ago', icon: <FilePdfOutlined />, type: 'PDF' },
        { name: 'Wireframes.xd', size: '2.8 MB', time: '2d ago', icon: <FileImageOutlined />, type: 'Design' },
        { name: 'Backend_api.json', size: '0.8 MB', time: '3d ago', icon: <FileOutlined />, type: 'JSON' },
    ];

    // Timeline Data
    const timelineData = [
        { date: 'Nov. 10, 2025', project: 'Project A', description: 'Project kickoff meeting and requirements gathering', status: 'completed' },
        { date: 'Nov. 12, 2025', project: 'Project B', description: 'Initial design review and feedback session', status: 'in-progress' },
        { date: 'Nov. 15, 2025', project: 'Project C', description: 'Development sprint planning and task assignment', status: 'pending' },
        { date: 'Nov. 17, 2025', project: 'Project D', description: 'Client presentation and milestone review', status: 'in-progress' },
        { date: 'Nov. 20, 2025', project: 'Project A', description: 'User testing phase begins', status: 'pending' },
    ];

    // Recent Activities Data
    const recentActivities = [
        'Smart Inventory System',
        'AI Health Monitor',
        'Smart Campus App',
        'Drone Delivery'
    ];

    // Calendar Logic
    const startDay = currentDate.startOf('month').day();
    const daysInMonth = currentDate.daysInMonth();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startDay }, (_, i) => i);

    const nextMonth = () => setCurrentDate(currentDate.add(1, 'month'));
    const prevMonth = () => setCurrentDate(currentDate.subtract(1, 'month'));

    const getStatusTag = (status) => {
        switch (status) {
            case 'completed': return <Tag color="green" icon={<CheckCircleOutlined />}>Completed</Tag>;
            case 'in-progress': return <Tag color="blue" icon={<SyncOutlined spin />}>In Progress</Tag>;
            default: return <Tag color="orange">Pending</Tag>;
        }
    };

    return (

        <Layout style={{ minHeight: '100vh', background: '#fff' }}>
            {/* Fixed Header */}
            <Header style={{
                position: 'fixed',
                top: 0,
                zIndex: 1000,
                width: '100%',
                background: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 24px',
                borderBottom: '1px solid #f0f0f0',
                height: '64px',
                lineHeight: '64px',
            }}>
                <Space size="large">
                    <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>C</Avatar>
                    <Text strong style={{ fontSize: '16px' }}>CollabSphere</Text>
                </Space>
                <Space size="large">
                    <Badge dot offset={[-5, 5]}>
                        <BellOutlined style={{ fontSize: 20, color: '#000', cursor: 'pointer' }} />
                    </Badge>
                    <Input
                        placeholder="Search..."
                        prefix={<SearchOutlined />}
                        style={{ width: 200, borderRadius: '6px' }}
                    />
                </Space>
            </Header>

            <Layout style={{ marginTop: '64px', height: 'calc(100vh - 64px)' }}>
                {/* Fixed Left Sidebar */}
                <Sider
                    width={240}
                    theme="light"
                    style={{
                        borderRight: '1px solid #f0f0f0',
                        height: 'calc(100vh - 64px)',
                        overflow: 'auto',
                        position: 'fixed',
                        left: 0,
                        top: '64px'
                    }}
                    collapsible
                    collapsed={collapsed}
                    trigger={null}
                >
                    <div style={{ padding: collapsed ? '24px 8px' : '24px 24px 0', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ marginBottom: 24, paddingLeft: collapsed ? 12 : 0 }}>
                            <Button
                                type="text"
                                icon={<MenuOutlined style={{ fontSize: '18px' }} />}
                                onClick={() => setCollapsed(!collapsed)}
                            />
                        </div>

                        {/* User Info Section */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, justifyContent: collapsed ? 'center' : 'flex-start', flexDirection: collapsed ? 'column' : 'row' }}>
                            <Avatar size={collapsed ? 40 : 64} src={avatarUrl} style={{ backgroundColor: '#d9d9d9', marginRight: collapsed ? 0 : 16 }} />
                            {!collapsed && (
                                <div>
                                    <Title level={4} style={{ margin: 0, fontWeight: 'normal' }}>Hi <span style={{ color: '#1890ff' }}>{userData.name.split(' ').pop()}</span>!</Title>
                                    <Text type="secondary">Project Lead</Text>
                                </div>
                            )}
                        </div>

                        {/* Navigation Menu */}
                        <div style={{ marginBottom: 24, flex: 1, overflowY: 'auto' }}>
                            {!collapsed && <Text strong style={{ color: '#1890ff', fontSize: '12px', letterSpacing: '1px' }}>OVERVIEW</Text>}
                            <Space direction="vertical" style={{ width: '100%', marginTop: 16 }} size={8}>
                                <Button type="text" block icon={<DashboardOutlined />} style={{ textAlign: collapsed ? 'center' : 'left', color: '#1890ff', fontWeight: 'bold' }}>
                                    {!collapsed && "Dashboard"}
                                </Button>
                                <Button type="text" block icon={<TeamOutlined />} style={{ textAlign: collapsed ? 'center' : 'left' }}>
                                    {!collapsed && "Team Management"}
                                </Button>
                                <Button type="text" block icon={<DesktopOutlined />} style={{ textAlign: collapsed ? 'center' : 'left' }}>
                                    {!collapsed && "Real-time Workspace"}
                                </Button>
                                <Button type="text" block icon={<TableOutlined />} style={{ textAlign: collapsed ? 'center' : 'left' }}>
                                    {!collapsed && "Kanban Board Detail"}
                                </Button>
                                <Button type="text" block icon={<FormOutlined />} style={{ textAlign: collapsed ? 'center' : 'left' }}>
                                    {!collapsed && "Whiteboard Canvas"}
                                </Button>
                                <Button type="text" block icon={<VideoCameraOutlined />} style={{ textAlign: collapsed ? 'center' : 'left' }}>
                                    {!collapsed && "Video Meeting Room"}
                                </Button>
                                <Button type="text" block icon={<SendOutlined />} style={{ textAlign: collapsed ? 'center' : 'left' }}>
                                    {!collapsed && "Submission Portal"}
                                </Button>
                                <Button type="text" block icon={<FileTextOutlined />} style={{ textAlign: collapsed ? 'center' : 'left' }}>
                                    {!collapsed && "Peer Review Form"}
                                </Button>
                            </Space>
                        </div>

                        {/* Settings Section */}
                        <div>
                            {!collapsed && <Text strong style={{ color: '#1890ff', fontSize: '12px', letterSpacing: '1px' }}>SETTINGS</Text>}
                            <Space direction="vertical" style={{ width: '100%', marginTop: 16 }} size={8}>
                                <Button type="text" block icon={<SettingOutlined />} style={{ textAlign: collapsed ? 'center' : 'left' }} onClick={() => navigate('/profile')}>
                                    {!collapsed && "Settings"}
                                </Button>
                                <Button type="text" block icon={<LogoutOutlined />} style={{ textAlign: collapsed ? 'center' : 'left' }}>
                                    {!collapsed && "Logout"}
                                </Button>
                            </Space>
                        </div>
                    </div>
                </Sider>

                {/* Main Content - Scrollable */}
                <Content style={{
                    marginLeft: collapsed ? '80px' : '240px',
                    marginRight: '300px',
                    padding: '24px',
                    background: '#f5f5f5',
                    height: 'calc(100vh - 64px)',
                    overflow: 'auto'
                }}>
                    {/* TOP SECTION: Active Projects and Timeline */}
                    <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                        {/* Active Projects Box */}
                        <Col span={12}>
                            <Card
                                title={
                                    <Space>
                                        <ProjectOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
                                        <Text strong style={{ fontSize: '16px' }}>Active Projects (4)</Text>
                                    </Space>
                                }
                                extra={
                                    <Button type="text" icon={<PlusOutlined />} size="small">
                                        Add Project
                                    </Button>
                                }
                                style={{ height: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                            >
                                <List
                                    dataSource={activeProjects}
                                    renderItem={(project) => (
                                        <List.Item
                                            style={{
                                                padding: '16px 0',
                                                borderBottom: '1px solid #f0f0f0',
                                                transition: 'all 0.3s'
                                            }}
                                            className="project-item"
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <div style={{
                                                        backgroundColor: '#f6ffed',
                                                        borderRadius: '8px',
                                                        padding: '8px',
                                                        color: '#52c41a'
                                                    }}>
                                                        {project.icon}
                                                    </div>
                                                }
                                                title={<Text strong style={{ fontSize: '14px' }}>{project.title}</Text>}
                                                description={
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        {project.description}
                                                    </Text>
                                                }
                                            />
                                            <Button size="small" type="text" icon={<MoreOutlined />} />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>

                        {/* Timeline Box */}
                        <Col span={12}>
                            <Card
                                title={
                                    <Space>
                                        <CalendarOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
                                        <Text strong style={{ fontSize: '16px' }}>Project Timeline (5)</Text>
                                    </Space>
                                }
                                extra={
                                    <Button type="text" icon={<PlusOutlined />} size="small">
                                        Add Event
                                    </Button>
                                }
                                style={{ height: '100%', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                            >
                                <Timeline
                                    style={{ marginTop: 8, maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}
                                    items={timelineData.map((item, index) => ({
                                        color: index % 2 === 0 ? 'blue' : 'green',
                                        children: (
                                            <div style={{ padding: '8px 0' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <div>
                                                        <Text strong style={{ fontSize: '12px', color: '#666' }}>{item.date}</Text>
                                                        <div style={{ marginTop: '4px' }}>
                                                            <Text strong style={{ fontSize: '14px' }}>{item.project}</Text>
                                                            <div style={{ marginTop: '2px' }}>
                                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                                    {item.description}
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ marginLeft: '12px' }}>
                                                        {getStatusTag(item.status)}
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    }))}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* BOTTOM SECTION: Files */}
                    <Card
                        title={
                            <Space>
                                <FolderOutlined style={{ color: '#722ed1', fontSize: '18px' }} />
                                <Text strong style={{ fontSize: '16px' }}>Files & Documents</Text>
                            </Space>
                        }
                        extra={
                            <Space>
                                <Button type="text" size="small">
                                    View All Files
                                </Button>
                                <Upload>
                                    <Button type="primary" icon={<CloudUploadOutlined />} size="small">
                                        Upload Files
                                    </Button>
                                </Upload>
                            </Space>
                        }
                        style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        {/* Files Stats Row */}
                        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                            <Col span={6}>
                                <Card
                                    size="small"
                                    style={{ background: '#f9f0ff', border: 'none', borderRadius: '6px' }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <Text strong style={{ fontSize: '24px', color: '#722ed1' }}>124</Text>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>Total Files</Text>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card
                                    size="small"
                                    style={{ border: 'none', borderRadius: '6px' }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                            <Text strong>Storage Usage</Text>
                                            <Text strong>65%</Text>
                                        </div>
                                        <Progress percent={65} status="active" strokeColor="#722ed1" />
                                        <div style={{ marginTop: '8px' }}>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>18 Recent (76 total available)</Text>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <Card
                                    size="small"
                                    style={{ background: '#f6ffed', border: 'none', borderRadius: '6px' }}
                                >
                                    <div style={{ textAlign: 'center' }}>
                                        <Text strong style={{ fontSize: '24px', color: '#52c41a' }}>86</Text>
                                        <div>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>Shared Files</Text>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        {/* Recent Files Header */}
                        <div style={{ marginBottom: 16 }}>
                            <Text strong style={{ fontSize: '14px' }}>Recent Files</Text>
                        </div>

                        {/* Files Grid */}
                        <Row gutter={[16, 16]}>
                            {recentFiles.map((file, index) => (
                                <Col span={8} key={index}>
                                    <Card
                                        size="small"
                                        hoverable
                                        style={{
                                            borderRadius: '6px',
                                            border: '1px solid #f0f0f0',
                                            height: '100%'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                            <div style={{
                                                backgroundColor: '#f9f0ff',
                                                borderRadius: '6px',
                                                padding: '8px',
                                                marginRight: '12px',
                                                color: '#722ed1'
                                            }}>
                                                {file.icon}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <Text strong style={{ fontSize: '12px', display: 'block' }}>
                                                    {file.name}
                                                </Text>
                                                <div style={{ marginTop: '4px' }}>
                                                    <Tag size="small" color="purple">{file.type}</Tag>
                                                    <Text type="secondary" style={{ fontSize: '10px', marginLeft: '8px' }}>
                                                        {file.size}
                                                    </Text>
                                                </div>
                                                <div style={{ marginTop: '8px' }}>
                                                    <Text type="secondary" style={{ fontSize: '10px' }}>
                                                        Updated {file.time}
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                        {/* Quick Actions */}
                        <div style={{ marginTop: 24, padding: '16px', background: '#fafafa', borderRadius: '6px' }}>
                            <Text strong style={{ fontSize: '14px', marginBottom: '12px', display: 'block' }}>
                                Quick Actions
                            </Text>
                            <Row gutter={[12, 12]}>
                                <Col>
                                    <Button icon={<FilePdfOutlined />} size="small">
                                        Export as PDF
                                    </Button>
                                </Col>
                                <Col>
                                    <Button icon={<FolderOutlined />} size="small">
                                        Create Folder
                                    </Button>
                                </Col>
                                <Col>
                                    <Button icon={<FileOutlined />} size="small">
                                        New Document
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    </Card>

                    {/* Extra content to show scrolling */}
                    <div style={{ height: '200px', marginTop: '24px' }} />
                </Content>

                {/* Fixed Right Sidebar - Calendar & Recent Activities */}
                <Sider
                    width={300}
                    theme="light"
                    style={{
                        position: 'fixed',
                        right: 0,
                        top: '64px',
                        height: 'calc(100vh - 64px)',
                        overflow: 'auto',
                        borderLeft: '1px solid #f0f0f0',
                        background: '#fff'
                    }}
                >
                    <div style={{ padding: '24px' }}>
                        {/* CALENDAR SECTION */}
                        <div style={{
                            background: '#fff',
                            borderRadius: 12,
                            padding: '16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            marginBottom: 24
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <Text strong style={{ fontSize: '16px' }}>{currentDate.format('MMMM YYYY')}</Text>
                                <Space>
                                    <Button
                                        size="small"
                                        type="text"
                                        icon={<LeftOutlined />}
                                        onClick={prevMonth}
                                        style={{ border: '1px solid #d9d9d9' }}
                                    />
                                    <Button
                                        size="small"
                                        type="text"
                                        icon={<RightOutlined />}
                                        onClick={nextMonth}
                                        style={{ border: '1px solid #d9d9d9' }}
                                    />
                                </Space>
                            </div>

                            {/* Calendar Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '4px' }}>
                                {/* Weekday headers */}
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                    <Text key={day} type="secondary" style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: 4 }}>{day}</Text>
                                ))}

                                {/* Empty days from previous month */}
                                {emptyDays.map(i => <div key={`empty-${i}`} style={{ height: '32px' }} />)}

                                {/* Days of current month */}
                                {daysArray.map(day => {
                                    const isToday = day === dayjs().date() && currentDate.isSame(dayjs(), 'month');
                                    return (
                                        <div
                                            key={day}
                                            style={{
                                                height: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                borderRadius: '50%',
                                                background: isToday ? '#1890ff' : 'transparent',
                                                color: isToday ? '#fff' : '#000',
                                                fontWeight: isToday ? 'bold' : 'normal',
                                                transition: 'all 0.3s',
                                                fontSize: '14px'
                                            }}
                                        >
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RECENT ACTIVITIES SECTION */}
                        <div style={{ marginBottom: 24 }}>
                            <Title level={5} style={{ marginBottom: 12 }}>Recent activities</Title>
                            <div style={{
                                background: '#f5f5f5',
                                borderRadius: 12,
                                padding: '16px',
                                minHeight: 150
                            }}>
                                <List
                                    dataSource={recentActivities}
                                    renderItem={item => (
                                        <List.Item style={{
                                            padding: '8px 0',
                                            border: 'none',
                                            borderBottom: '1px solid #e8e8e8'
                                        }}>
                                            <Typography.Text style={{ fontSize: '14px' }}>{item}</Typography.Text>
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <div style={{ textAlign: 'right', marginTop: 8 }}>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        cursor: 'pointer',
                                        color: '#1890ff'
                                    }}
                                >
                                    see more
                                </Text>
                            </div>
                        </div>

                        {/* Optional: Additional widget */}
                        <div style={{
                            background: '#f9f0ff',
                            borderRadius: 12,
                            padding: '16px',
                            textAlign: 'center'
                        }}>
                            <Title level={5} style={{ color: '#722ed1' }}>Upcoming Events</Title>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                No events scheduled for today
                            </Text>
                        </div>
                    </div>
                </Sider>
            </Layout>
        </Layout>
    );
};

export default ProjectDashboard;