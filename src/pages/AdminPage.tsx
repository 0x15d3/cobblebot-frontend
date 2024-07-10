import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Route, Routes} from 'react-router-dom';
import { DashboardOutlined, RobotOutlined, TeamOutlined } from '@ant-design/icons';
import AdminUsersSubPage from './admin/AdminUsersSubPage';
import AdminBotsSubPage from './admin/AdminBotsSubPage';
import AdminOverviewSubPage from './admin/AdminDashboardSubPage';

function AdminPage() {
  const [isNarrow, setIsNarrow] = useState(false);
  
  const selectedRoute = () => {
    const parts = location.pathname.match(/\/admin\/[^/]+\/(.+)/i) || ['', 'home'];
    return [ parts[1] ];
  };

  return (
    <Layout>
    <Layout.Sider
      style={{
        background: '#fff',
        height: '100vh',
        position: 'fixed',
        left: 0,
        zIndex: 2,
      }}
      breakpoint="md"
      collapsedWidth="0"
      onBreakpoint={setIsNarrow}
      zeroWidthTriggerStyle={{
        top: 'auto',
        bottom: '200px',
      }}
    >
      <Menu style={{ paddingTop: '24px', borderRight: 0 }} mode="inline" selectedKeys={selectedRoute()}>
        <Menu.Item key="overview" icon={<DashboardOutlined />}>
            <Link to={`/admin/`}>Ana Sayfa</Link>
          </Menu.Item>
          <Menu.Item key="user" icon={<TeamOutlined />}>
            <Link to={`/admin/users`}>Kullanıcılar</Link>
          </Menu.Item>
          <Menu.Item key="bot" icon={<RobotOutlined />}>
            <Link to={`/admin/bots`}>Botlar</Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout.Content style={isNarrow ? {marginLeft: 0,padding: '8px',} : {marginLeft: '200px',padding: '24px',}}>
        <Routes>
        <Route path={`/`} element={<AdminOverviewSubPage />} />
        <Route path={`/bots`} element={<AdminBotsSubPage />} />
        <Route path={`/users`} element={<AdminUsersSubPage />} />
        </Routes>
      </Layout.Content>
    </Layout>
  );
}

export default AdminPage;
