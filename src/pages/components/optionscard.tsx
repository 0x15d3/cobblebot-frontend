import { useState } from 'react';
import { BotEntity } from '../../firebase/bot';
import { CSSProperties } from 'react';
import { Button, Card, Form, Select, Modal, Flex } from 'antd';

interface BotOptionsCardProps {
  bot: BotEntity,
  style: CSSProperties,
  onSaveValues: (values: any) => void,
  onDeleteBot: (id: string) => void,
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { offset: 8, span: 16 },
  }
}

function BotOptionsCard({
  bot,
  style,
  onSaveValues,
  onDeleteBot,
}: BotOptionsCardProps) {
  const [infoChanged, setInfoChanged] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const optionValues = {
    house: 'random',
    ...bot.options,
  }

  const handleSave = (values: any) => {
    onSaveValues({
      options: values,
    });
  };

  const handleDelete = () => {
    onDeleteBot(bot.id);
    setIsModalVisible(false);
  };

  const getFormItems = (botType: string) => {
    switch (botType) {
      case 'AFK':
        return (
          <Form.Item name="autoReconnect" label="Yeniden Başlat" extra="Bot sunucudan düşünce ne sıklık ile yeniden başlasın">
            <Select data-testid="auto-reconnect-config">
              <Select.Option value={0}>Asla</Select.Option>
              <Select.Option value={60}>1 dakika sonra</Select.Option>
              <Select.Option value={300}>5 dakika sonra</Select.Option>
              <Select.Option data-testid="auto-reconnect-option-600" value={600}>10 dakika sonra</Select.Option>
            </Select>
          </Form.Item>
        );
    }
  };

  return (
    <>
      <Card title={`${bot.type.toUpperCase()} Bot ayarları`} style={style}>
        <Form
          name="bot-options-form"
          initialValues={optionValues}
          onValuesChange={() => setInfoChanged(true)}
          onFinish={handleSave}
          {...formItemLayout}
        >
          <Form.Item name="house" label="Lokasyon" extra="Botunuzun sunucuya giriş yapacağı lokasyon">
            <Select data-testid="house-config">
              <Select.Option value="random">Rastgele</Select.Option>
              <Select.Option key="netherlands" value="netherlands">Hollanda</Select.Option>
              <Select.Option key="turkey" value="turkey">Türkiye</Select.Option>
            </Select>
          </Form.Item>
          {getFormItems(bot.type)}
          <Form.Item {...tailLayout}>
          <Flex gap="small">
            <Button data-testid="save-button" type="primary" htmlType="submit" disabled={!infoChanged}>Kaydet</Button>
            <Button data-testid="delete-button" type="primary" danger onClick={() => setIsModalVisible(true)}>Botu Sil</Button>
          </Flex>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        title="Botu Sil"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="Evet"
        cancelText="Hayır"
      >
        <p>Bu botu silmek istediğinize emin misiniz?</p>
      </Modal>
    </>
  );
}

export default BotOptionsCard;
