import { useState, useEffect } from 'react';
import { Empty, Input, Modal, Skeleton, Space, Switch, Timeline } from 'antd';
import { askBot, BotEntity, getBotDetails } from '../../firebase/bot';
import { isMobile } from 'react-device-detect';
import AnsiText from '../../components/bot/AnsiText';
import { getAnalytic } from '../../firebase';
import { logEvent } from 'firebase/analytics';
import BotInfoHeader from './BotInfoHeader';

interface BotMessagesSubPageProps {
  bot: BotEntity,
}

interface MessageEntry {
  timestamp: string,
  message: string,
  ansi?: string,
}

function BotMessagesSubPage({ bot }: BotMessagesSubPageProps) {
  const [ isLoading, setIsLoading ] = useState(true);
  const [ isAlive, setIsAlive ] = useState(false);
  const [ autoUpdate, setAutoUpdate ] = useState(false);
  const [ messages, setMessages ] = useState([] as MessageEntry[]);
  const [ isActionRunning, setIsActionRunning ] = useState(false);
  const [ message, setMessage ] = useState('');

  const showError = (error: string) => {
    setIsActionRunning(false);
    Modal.error({
      content: error
    });
  }

  const onSendMessage = () => {
    if (message) {
      const msg = message;
      setMessage('');
      setIsActionRunning(true);
      askBot(bot.username, msg)
        .then(() => {
          setIsActionRunning(false);
        })
        .catch(({ message }) => showError(message));
    }
  };

  useEffect(() => {
    logEvent(getAnalytic(),'view_bot_messages')

    const getMessages = () => {
        getBotDetails(bot.username)
          .then(({ isAlive, messages }) => {
            if (isAlive) {
              const filteredMessages = messages.filter((message) => message.trim() !== "");
              if(filteredMessages.length != 0){
                setMessages(filteredMessages);
                setIsAlive(true);
              }
              else{
                setIsAlive(false);
              }
            }
            setIsLoading(false);
          })
          .catch((error) => console.error(error));
      };
    

    getMessages();

    const intervalId = setInterval(() => {
      if (isLoading || !autoUpdate) {
        return;
      }
      getMessages();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [bot, isLoading, autoUpdate]);

  const body = isAlive ? (
    <>
      <Timeline style={{
        paddingTop: '24px',
        backgroundColor: 'rgba(0, 0, 0, .9)',
        color: 'white',}}>
        {messages.map((msg, index) => (
          <Timeline.Item key={index}>
            <Space size="middle">
              {!isMobile}
              <AnsiText text={msg.toString()} />
            </Space>
          </Timeline.Item>
        ))}
      </Timeline>
      <br></br>
      <Input.Search
        placeholder="sohbet edebilirsin"
        allowClear
        enterButton="Gönder"
        onSearch={onSendMessage}
        value={message}
        onChange={({ target: { value }}) => setMessage(value)}
        loading={isActionRunning}
      />
    </>
  ) : <Empty description="Veri Bulunamadı" />;

  return (
    <div>
      
      <BotInfoHeader bot={bot} 
      actions={
        <Space>
            <span>Otomatik yenile:</span>
            <Switch onChange={setAutoUpdate} />
          </Space>
      }/>
      {isLoading ? <Skeleton active /> : body}
    </div>
  );
}

export default BotMessagesSubPage;
