import { Button, Card, Modal, Skeleton, Space, Statistic } from 'antd';
import { useState, useEffect } from 'react';
import { getStatistics } from '../../firebase/admin';
import { camelToTitle } from '../../helpers';
import AdminHeader from './AdminHeader';

function AdminOverviewSubPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState({} as any);

  const loadData = () => {
    setIsLoading(true);
    getStatistics()
      .then(statistics => {
        setStatistics(statistics);
        setIsLoading(false);
      })
      .catch(({ message }) => Modal.error({ content: message }));
  };

  useEffect(() => loadData(), []);

  return (
    <>
      <AdminHeader
        title={`Ana Sayfa`}
        actions={
          <Button type="primary" loading={isLoading} disabled={isLoading} onClick={loadData}>Yenile</Button>
        }
      />
      {isLoading && <Skeleton active />}
      {!isLoading && (
        <Space size="large" wrap>
          {Object.keys(statistics).map(key => <Card key={key}><Statistic title={camelToTitle(key)} value={statistics[key]}></Statistic></Card>)}
        </Space>
      )}
    </>
  );
}

export default AdminOverviewSubPage;
