import { useState, useEffect } from 'react';
import { Button, Modal, Table, Tag } from 'antd';
import { listBots, deleteBot } from '../../firebase/admin';
import { Link } from 'react-router-dom';
import AdminHeader from './AdminHeader';

interface Bot {
  id: string;
  data: {
    server: string;
    createdAt: {
      _seconds: number;
      _nanoseconds: number;
    };
    password: string;
    name: string;
    description: string;
    type: string;
    authType: string;
    userid: string;
    version: string;
    username: string;
    dig: string;
    status: string;
  };
}

function AdminBotsSubPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [bots, setBots] = useState([] as Bot[]);

  const columns = [
    { title: 'Tür', dataIndex: ['data', 'type'], key: 'type', render: (type: string) => <Tag>{type}</Tag> },
    { title: 'Botun Adı', dataIndex: ['data', 'username'], key: 'username', render: (username: string, bot: Bot) => <Link to={`/bot/${bot.id}`} target="_blank">{username}</Link> },
    { title: 'Server', dataIndex: ['data', 'server'], key: 'server' },
    { title: 'Versiyon', dataIndex: ['data', 'version'], key: 'version' },
    { title: 'Durum', dataIndex: ['data', 'status'], key: 'status' },
    {
      key: 'action',
      render: (bot: Bot) => (
        <Button type="link" danger onClick={() => handleDelete(bot.id)}>
          Sil
        </Button>
      ),
    },
  ];

  const loadData = () => {
    setIsLoading(true);
    listBots()
      .then((bots) => {
        setBots(bots as Bot[]);
        setIsLoading(false);
      })
      .catch(({ message }) => Modal.error({ content: message }));
  };

  const handleDelete = (botId: string) => {
    Modal.confirm({
      title: 'Botu Sil',
      content: 'Bu botu silmek istediğine emin misin?',
      onOk: async () => {
        try {
          await deleteBot(botId).then(() => {
            loadData()
          })
          loadData();
        } catch (error) {
          Modal.error({ content: 'Error deleting bot' });
        }
      },
    });
  };

  useEffect(() => loadData(), []);

  return (
    <>
      <AdminHeader
            title={`Botlar`}
            actions={
              <Button type="primary" loading={isLoading} disabled={isLoading} onClick={loadData}>Yenile</Button>
            }
          />
      <Table
        loading={isLoading}
        size="large"
        dataSource={bots}
        columns={columns}
        pagination={{
          pageSize: 18,
        }}
      />
    </>
  );
}

export default AdminBotsSubPage;
