import { Card, Collapse, Descriptions,  Result} from 'antd';
import { BotEntity } from '../../firebase/bot';
import { isMobile } from 'react-device-detect';
import BotStatusCard from '../components/botstatuscard';
import CardContainer from '../components/cardcontainer';
import BotInfoHeader from './BotInfoHeader';
interface SelectedBotProps {
  bot: BotEntity | null,
}

function SelectedBot({ bot }: SelectedBotProps) {

  return (
    <div style={isMobile ? { margin: '0 auto' } : { margin: '0 auto' }}>
      {bot && (
      <BotInfoHeader bot={bot} />
      )}
      {bot ? (
            <CardContainer>
              <BotStatusCard bot={bot} />
              <Card title="Oyun Bilgileri" style={{width: '350px'}}>
                <Descriptions column={1}>
                  <Descriptions.Item key="server" label="Minecraft Server">{bot.server || '(Ayarlanmamış)'}</Descriptions.Item>
                  <Descriptions.Item key="username" label="Hesap">{bot.username || '(Ayarlanmamış)'}</Descriptions.Item>
                  <Descriptions.Item key="password" label="Şifre">{bot.password ? '******' : '(Ayarlanmamış)'}</Descriptions.Item>
                </Descriptions>
                {bot.options && (
                <Collapse ghost>
                  <Collapse.Panel header="Ayarlar" key="1">
                    <Descriptions column={1}>
                      <Descriptions.Item key="autoReconnect" label="Yeniden Başlat">{bot.options["autoReconnect"]}</Descriptions.Item>
                        <Descriptions.Item key="house" label="Ev">{bot.options["house"]}</Descriptions.Item>
                    </Descriptions>
                  </Collapse.Panel>
                </Collapse>
                )}
            </Card>
            </CardContainer>
      ) : (
        <Result
          data-testid="bot-not-found"
          status="404"
          title="Bot bulunamadı"
          subTitle="Bu bot artık bulunmamakta ya da giriş yapmak için yetkiniz yok."
        />
      )}
    </div>
  );
}

export default SelectedBot;
