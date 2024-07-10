import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Descriptions, List, Result, Skeleton, Tag } from 'antd';
import { getBotList, BotEntity } from '../../firebase/bot';
import { PageHeader } from '@ant-design/pro-components';
import { getAuthService } from '../../firebase';
import { isMobile } from 'react-device-detect';
import BotCreationButton from '../components/createbutton';

interface ListPrompts{
  id? : string
}

function BotListComponent({id}:ListPrompts){
  const [bots, setBots] = useState<BotEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userId= getAuthService().currentUser!.uid;
  useEffect(() => {
    if(!userId){
        return 
    }
    const fetchBotList = async () => {
        try {
          if(id){
            const botList = await getBotList(id);
            setBots(botList);
          }
          else{
          const botList = await getBotList(userId);
          setBots(botList);
          }
        } catch (error) {
          console.error('Error fetching bot list:', error);
        } finally {
          setIsLoading(false);
        }
      }


    fetchBotList();
  }, [userId,id]);

  return (
    <div style={isMobile ? {margin: '0 auto'}: {width: '960px',margin: '0 auto'}}>
      <PageHeader
        style={{padding: '16px 0 16px 0'}}
        title={`Botların`}
        {...(!isLoading && bots.length > 0 ? { extra: <BotCreationButton /> } : {})}
        //{...(userId ? { tags: <ImmersiveModeTag /> } : {})}
      />

      {isLoading && <Skeleton active />}
      {!isLoading && bots.length > 0 && (
        <List
          data-testid="bot-list"
          grid={{ gutter: 16, column: 3, xs: 1, sm: 2, md: 2 }}
          dataSource={bots}
          renderItem={bot => (
            <List.Item>
              <Link to={`/bot/${bot.id}`}>
                <Card
                  data-testid="bot-card"
                  title={bot.name}
                  extra={<Tag>{bot.description}</Tag>}
                >
                  <Descriptions column={1}>
                    <Descriptions.Item label="MC Server">{bot.server || '(Ayarlanmamış)'}</Descriptions.Item>
                    <Descriptions.Item label="Botun Adı">{bot.username || '(Ayarlanmamış)'}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Link>
            </List.Item>
            
          )}
        />
      )}
      {!isLoading && bots.length === 0 && (
        <Result
          data-testid="bot-empty-list"
          status="403"
          title="Botun bulunmamakta"
          subTitle={`En fazla 4 adet bot oluşturabilirsin`}
          extra={<BotCreationButton> {"İlk Botunu Oluştur"}</BotCreationButton>}
          />
      )}
      </div>
  );
}

export default BotListComponent;
