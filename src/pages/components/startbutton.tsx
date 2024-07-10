import { createRef, ReactNode, useState } from 'react';
import { Button, Modal, notification } from 'antd';
import { BotEntity, startBot } from '../../firebase/bot';
import { FormInstance } from 'antd/lib/form';
import { getAuthService } from '../../firebase';


interface BotStartButtonProps {
  bot: BotEntity
  hidden?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  onCompleted?: () => void;
}

export default function BotStartButton({
  bot,
  hidden = false,
  disabled = false,
  children = 'Başlat',
  onCompleted = () => {},
}: BotStartButtonProps) {
  const [inputVisible, setInputVisible] = useState(false);
  const [isActionRunning, setIsActionRunning] = useState(false);
  const [countdownNumber] = useState(Math.floor(Math.random() * 10));
  const inputForm = createRef<FormInstance>();

  const startingBot = async () => {
    setIsActionRunning(true);

    const currentUser = getAuthService().currentUser;
    const idTokenResult = await currentUser?.getIdTokenResult(true);
    const customClaims = idTokenResult?.claims;

    if (customClaims && customClaims.user === true) {
      startBot(bot)
        .then(() => onCompleted())
        .catch(({ message }) => Modal.error({ content: message }))
        .finally(() => setIsActionRunning(false));
    } else {
      let count = countdownNumber;
      notification.info({
        message: 'Sıra Sistemi',
        description: 'Yüksek talep nedeniyle botunu başlatırken sıra beklemek zorundasın...',
      });

      const countdownInterval = setInterval(() => {
        notification.info({
          message: 'Sıra Sistemi',
          description: `Sıradasınız: ${count}`,
        });

        if (count === 0) {
          notification.info({
            message: 'Sıra Sistemi',
            description: 'Sıranız bitti, botunuz başlıyor.',
          });
          clearInterval(countdownInterval);
          startBot(bot)
            .then(() => onCompleted())
            .catch(({ message }) => notification.error({ message }))
            .finally(() => location.reload());
        }

        count -= 1;
      }, Math.floor(Math.random() * (20000 - 1000 + 1) + 3000));
    }
    
    
  };
  const onClickStartButton = () => {
    if (bot.userid) {
      startingBot();
    } else {
      setInputVisible(true);
    }
  }
  const validateInput = () => {
    inputForm.current
      ?.validateFields()
      .then(() => {
        inputForm.current!.resetFields();
        setInputVisible(false);
        startingBot();
      })
      .catch(() => {});
  }

  return (
    <>
      
      <Button type="primary" hidden={hidden} disabled={disabled} onClick={onClickStartButton} loading={isActionRunning}>
        {children}
        </Button>
      <Modal
        visible={inputVisible}
        title="Minecraft Hesabı Gerekli"
        okText="Başlat"
        onCancel={() => setInputVisible(false)}
        onOk={validateInput}
      >
      </Modal>
    </>
  );
}