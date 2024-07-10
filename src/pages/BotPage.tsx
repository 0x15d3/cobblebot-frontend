import { useEffect, useState } from 'react';
import { Layout, Menu, Modal, Skeleton } from 'antd';
import { Link, Route, useParams, useLocation, Routes } from 'react-router-dom';
import { BotEntity, getBotById } from '../firebase/bot';
import { DashboardOutlined, HistoryOutlined, HomeOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons';
import SelectedBot from './botpage/SelectedBot';
import BotMessagesSubPage from './botpage/Messages';
import { getAnalytic, getAuthService } from '../firebase';
import { logEvent } from 'firebase/analytics';
import BotDashboardSubPage from './botpage/BotDashboard';
import BotSettingsSubPage from './components/settings';
import BotLogsSubPage from './botpage/Logs';


function BotPage() {
  const [isNarrow, setIsNarrow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [bot,setBot] = useState<BotEntity | null>(null);

  const selectedRoute = () => {
    const parts = location.pathname.match(/\/bot\/[^/]+\/(.+)/i) || ['', 'overview'];
    return [parts[1]];
  };
  const showError = (error: string) => {
    logEvent(getAnalytic(), 'unauthorized_bot_page_error');
    Modal.error({
      content: error,
    });
  };

  useEffect(() => {
    const fetchBot = async () => {
      try {
        const fetchedBot = await getBotById(id as string);
        const currentUser = getAuthService().currentUser;
        if(!currentUser)return
        if(!currentUser.uid.includes(fetchedBot.userid) && !(await currentUser.getIdTokenResult()).claims.admin) return showError("Bu bot sizin değil!")
        if(fetchedBot){
          setBot(fetchedBot);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching bot:', error);
      }
    };

    fetchBot();
    
  }, [id]);
  return (
    <div>
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
            <Menu.Item key="overview" icon={<HomeOutlined />}>
              <Link to={`/bot/${id}`}>Başlangıç</Link>
            </Menu.Item>
            <Menu.Item key="message" icon={<MessageOutlined />}>
              <Link to={`/bot/${id}/message`}>Mesajlar</Link>
            </Menu.Item>
            <Menu.Item key="logs" icon={<HistoryOutlined />}>
              <Link to={`/bot/${id}/logs`}>Geçmiş</Link>
            </Menu.Item>
            <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
              <Link to={`/bot/${id}/dashboard`}>Bilgiler</Link>
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
              <Link to={`/bot/${id}/settings`}>Ayarlar</Link>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        <Layout.Content style={isNarrow ? { marginLeft: 0, padding: '8px' } : { marginLeft: '200px', padding: '24px' }}>
          {isLoading ? <Skeleton active /> : (
          <Routes>
          <Route path={`/`} element={<SelectedBot bot={bot} />} />
          <Route path={`/message`} element={<BotMessagesSubPage bot={bot as BotEntity} />} />
          <Route path={`/logs`} element={<BotLogsSubPage bot={bot as BotEntity} />} />
          <Route path={`/dashboard`} element={<BotDashboardSubPage bot={bot as BotEntity} />} />
          <Route path={`/settings`} element={<BotSettingsSubPage bot={bot as BotEntity} />} />
        </Routes>
          )}  
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default BotPage;
