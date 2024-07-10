import { useState, useEffect, useCallback } from 'react';
import { Button, Card, Empty, Modal, Skeleton } from 'antd';
import { BotEntity, getLogs } from '../../firebase/bot';
import BotLogs, { LogEntry } from '../../components/bot/BotLogs';
import BotInfoHeader from './BotInfoHeader';

interface BotHistorySubPageProps {
  bot: BotEntity;
}

function BotHistorySubPage({ bot }: BotHistorySubPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([] as LogEntry[]);

  const getLogsData = useCallback(() => {
    setIsLoading(true);
    getLogs(bot.username)
      .then(({ logs }) => setLogs(logs.slice(-20)))
      .catch(error => Modal.error({ content: error }))
      .finally(() => setIsLoading(false));
  }, [bot]);

  useEffect(() => {
    getLogsData();
  }, [bot, getLogsData]);

  return (
    <div>
      <BotInfoHeader bot={bot} actions={[
        <Button type="primary" loading={isLoading} onClick={getLogsData}>Yenile</Button>
      ]} />
      {isLoading ? <Skeleton active /> : (
        <Card title="Geçmiş">
          {logs.length === 0 && <Empty />}
          {logs.length > 0 && <BotLogs logs={logs} reverse />}
        </Card>
      )}
    </div>
  );
}

export default BotHistorySubPage;
