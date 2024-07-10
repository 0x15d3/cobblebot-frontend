import { useState, useEffect } from 'react';
import { Empty, Input, Modal, Skeleton, Space, Switch, Timeline } from 'antd';
import { askBot, BotEntity, getBotDetails } from '../../firebase/bot';
import { isMobile } from 'react-device-detect';
import AnsiText from './AnsiText';
import { getAnalytic } from '../../firebase';
import { logEvent } from 'firebase/analytics';
import { PageHeader } from '@ant-design/pro-components';

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
          .then(({ status, messages }) => {
            if (status === "OK") {
              const filteredMessages = messages.filter((message) => message.trim() !== "");
              setMessages(filteredMessages);
              setIsAlive(true);
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
  ) : <Empty />;

  return (
    <div>
      <PageHeader
        style={{padding: '16px 0 16px 0'}}
        title={`Mesajlar`}
        {...(!isLoading ? { extra: <Space>
            <span>Otomatik yenile:</span>
            <Switch onChange={setAutoUpdate} />
          </Space>} : {})}
      />
        
      {isLoading ? <Skeleton active /> : body}
    </div>
  );
}

export default BotMessagesSubPage;
