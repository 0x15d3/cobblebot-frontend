import { useCallback, useEffect, useState } from 'react';
import { Button,Card, Descriptions, Modal, Progress, Result, Skeleton, Space, Tooltip, Typography} from 'antd';
import { BotEntity, getBotDetails, stopBot } from '../../firebase/bot';
import { isMobile } from 'react-device-detect';
import PlayerList, { Player } from '../components/playerlist';
import CardContainer from '../components/cardcontainer';
import BotStartButton from '../components/startbutton';
import BotInfoHeader from './BotInfoHeader';
import InventoryView from '../components/inventoryview';

interface DashboardProps{
  bot : BotEntity
}

function BotDashboard({ bot }:DashboardProps){
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isAlive, setIsAlive ] = useState(false);
  const [ isActionRunning, setIsActionRunning ] = useState(false);
  const [ players, setPlayers ] = useState([] as Player[]);
  const [ time, setTime ] = useState({} as any);
  const [ inventory, setInventory ] = useState({} as any);
  const [ position, setPosition ] = useState({} as any);
  const [ status, setStatus ] = useState({} as any);
  const [ misc, setMisc ] = useState({} as any);

  const showError = (error: string) => {
    setIsActionRunning(false);
    Modal.error({
      content: error
    });
  };

  const getBotStatus = useCallback(() => {
    setIsLoading(true);
    getBotDetails(bot.username)
      .then(({isAlive, status})=>{
        if (isAlive) {
          setPlayers(status.players);
          setTime(status.time);
          setInventory(status.inventory);
          setPosition({
            dimension: status.game.dimension,
            x: status.x,
            y: status.y,
            z: status.z,
            pitch: status.pitch,
            yaw: status.yaw,
          });
          setStatus({
            experience: status.experience,
            health: status.health,
            food: status.food,
            foodSaturation: status.foodSaturation,
          });
          setMisc(status.game);
        }
        setIsAlive(isAlive)
      })
      .catch(error => Modal.error({ content: error }))
      .finally(() => setIsLoading(false));
  }, [ bot ]);

  const onBotStarted = () => {
    setIsLoading(true);
    setTimeout(() => getBotStatus(), 5000);
  };

  const onClickStopButton = () => {
    setIsActionRunning(true);
    stopBot(bot.username)
      .then(() => getBotStatus())
      .catch(({ message }) => showError(message))
      .finally(() => setIsActionRunning(false));
  };

  useEffect(() => {
    getBotStatus();
  }, [ bot, getBotStatus ]);

  return (
    <div style={isMobile ? {margin: '0 auto'}: {margin: '0 auto'}}>
      <BotInfoHeader bot={bot} actions={[
        <Button type="primary" key="refresh" hidden={!isAlive} disabled={isActionRunning} loading={isLoading} onClick={getBotStatus}>Yenile</Button>,
        <Button type="primary" key="stop" danger hidden={!isAlive} disabled={isLoading} loading={isActionRunning} onClick={onClickStopButton}>Durdur</Button>,
      
      ]} />
      {isLoading && <Skeleton active avatar />}
      {!isLoading && !isAlive &&(
        <Result
          data-testid="dashboard-empty"
          status="500"
          title="Botunuz Çevrimdışı!"
          subTitle="Bu sayfayı görebilmek için botunuzun çalışır durumda olması gerekiyor!"
          extra={<BotStartButton bot={bot} onCompleted={onBotStarted}>Şimdi Botunu Başlat</BotStartButton>}
        />
      )}

    {!isLoading && isAlive && players.length > 0 && (
      <CardContainer>
      <Card size="small" title={`Aktif Oyuncular (${players.length}/${misc.maxPlayers})`}>
              <PlayerList style={{ width: '320px', height: '500px', overflow: 'scroll' }} players={players} />
          </Card>
      <Card size="small" title="Durum" style={{width: '380px'}}>
            <Space direction="vertical" size="middle">
              <Space direction="vertical">
                <Space size="large">
                  <Tooltip title={`XP: ${status.experience.points}`}>
                    <Progress
                      type="circle"
                      percent={status.experience.progress * 100}
                      strokeColor="#52c41a"
                      format={() => `Level ${status.experience.level}`}
                    />
                  </Tooltip>
                  <Descriptions column={1}>
                  <Descriptions.Item key="server" label="Server">
                      <Tooltip>{bot.server}</Tooltip>
                    </Descriptions.Item>
                    <Descriptions.Item key="gamemode" label="GameMode">{misc.gameMode}</Descriptions.Item>
                    <Descriptions.Item key="difficulty" label="Zorluk">{misc.difficulty}</Descriptions.Item>
                  </Descriptions>
                </Space>
                <Tooltip title={`Doygunluk: ${status.foodSaturation ?? 0}`}>
                  <Progress showInfo={false} percent={status.foodSaturation* 100 / 20} />
                </Tooltip>
                <Space>
                  <Tooltip title={`Can: ${status.health}`}>
                    <Progress showInfo={false} percent={status.health * 100 / 20} steps={10} strokeColor="#ff4d4f" />
                  </Tooltip>
                  <Tooltip title={`Açlık: ${status.food}`}>
                    <Progress strokeColor='orange' showInfo={false} percent={status.food * 100 / 20} steps={10} />
                  </Tooltip>
                </Space>
              </Space>
              <InventoryView slots={inventory} />
            </Space>
          </Card>
          <Space direction="vertical" size="large">
            <Card size="small" title="Pozisyon">
              <Typography.Paragraph>
              Boyut: {position.dimension}
              </Typography.Paragraph>
              <Typography.Paragraph>
                Pozisyon: ({position.x?.toFixed(2)}, {position.y?.toFixed(2).toString()}, {position.z?.toFixed(2)})
              </Typography.Paragraph>
              <Typography.Paragraph>
                Eğim: {position.pitch}
              </Typography.Paragraph>
              <Typography.Paragraph>
                Rotasyon: {position.yaw}
              </Typography.Paragraph>
            </Card>
            <Card size="small" title="Zaman">
              <Typography.Paragraph>
                Yaş / Saat: {time.age} / {time.time}
              </Typography.Paragraph>
              <Typography.Paragraph>
                Saat / Gün: {time.timeOfDay} / {time.day}
              </Typography.Paragraph>
              <Typography.Paragraph>
                {time.isDay ? 'Gündüz' : 'Gece'} ve {time.isRaining ? 'Yağmurlu' : 'Güneşli'}.
              </Typography.Paragraph>
              <Typography.Paragraph>
                Ay Evresi: {time.moonPhase}
              </Typography.Paragraph>
            </Card>
          </Space>
        </CardContainer>
      )}
    </div>
  );
}

export default BotDashboard;
