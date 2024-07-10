import { useState, useEffect, useCallback } from 'react';
import { Button, Card, Descriptions, Modal, Space, Spin } from 'antd';
import { BotEntity, getBotDetails, getLogs, stopBot } from '../../firebase/bot';
import BotStartButton from './startbutton';
import { getAuthService } from '../../firebase';
import BotLogs, { LogEntry } from '../../components/bot/BotLogs';


interface BotStatusCardProps {
  bot: BotEntity,
}

let uid;

function BotStatusCard({ bot }: BotStatusCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [ isAlive, setIsAlive ] = useState(false);
  const [isActionRunning, setIsActionRunning] = useState(false);
  const [ lastLogs, setLastLogs ] = useState([] as LogEntry[]);

  const showError = (error: string) => {
    setIsActionRunning(false);
    Modal.error({
      content: error
    });
  };

  const fetchBotDetails = useCallback(() => {
    uid = getAuthService().currentUser!.uid;
    setIsLoading(true);
    getLogs(bot.username)
    .then(({ logs }) => setLastLogs(logs.slice(-5)))
    .catch(error => Modal.error({ content: error }))
    .finally(() => setIsLoading(false));

    console.log(lastLogs)
    getBotDetails(bot.username)
    .then(({ isAlive }) => {
      setIsAlive(isAlive);
      setIsLoading(false);
    })
    .catch(({ message }) => showError(message))
    .finally(() => setIsLoading(false));
  }, [bot.id]);

  const onClickStopButton = () => {
    setIsActionRunning(true);
    if (!uid) return
    stopBot(bot.username)
      .then(() => {
        fetchBotDetails();
      })
      .catch(({ message }) => showError(message))
      .finally(() => setIsActionRunning(false));
  };

  const onBotStarted = () => {
    setIsLoading(true);
    setTimeout(() => fetchBotDetails(), 3000);
  };

  useEffect(() => fetchBotDetails(), [fetchBotDetails]);

  return (
    <div style={{ display: 'flex', flexFlow: 'wrap' }}>
      <Card title="Durum" style={{ marginLeft: '24px', width: '350px' }}>
        <Descriptions column={1}>
          <Descriptions.Item key="createdat" label="Oluşturulduğu Tarih">{bot.createdAt.toDate().toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item key="status" label="Durum">
            {isLoading ? (
              <Spin />
            ) : (
              isAlive ? 'Çevrimiçi' : 'Çevrimdışı'
            )}
          </Descriptions.Item>
          {!isLoading && (
            <Descriptions.Item key="control" label="Kontrol">
              {isAlive ?
                <Button type="primary" danger onClick={onClickStopButton} loading={isActionRunning}>Durdur</Button>
                :
                <BotStartButton bot={bot} onCompleted={onBotStarted} />
              }
            </Descriptions.Item>
          )}
        </Descriptions>
        {!isLoading && lastLogs.length > 0 && (
          <Space direction="vertical">
            <p>En Güncel Oyun İçi Geçmiş:</p>
            <BotLogs logs={lastLogs} narrow />
          </Space>
        )}
      </Card>
    </div>
  );
}

export default BotStatusCard;
