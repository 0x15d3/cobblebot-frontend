import { createRef, useState } from 'react';
import { Card, Form, Space, Input, Button, Modal, Spin, Select } from 'antd';
import { BotEntity, updateBot, deleteBot } from '../../firebase/bot';
import { FormInstance } from 'antd/lib/form';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import BotOptionsCard from './optionscard';
import BotInfoHeader from '../botpage/BotInfoHeader';
import CardContainer from './cardcontainer';

interface BotSettingsSubPageProps {
  bot: BotEntity
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { offset: 6, span: 18 },
  }
}

function BotSettingsSubPage({ bot }: BotSettingsSubPageProps) {
  const [ infoChanged, setInfoChanged ] = useState(false);
  const [ accountChanged, setAccountChanged ] = useState(false);
  const [ isSaving, setIsSaving ] = useState(false);
  const history = useNavigate();
  const infoForm = createRef<FormInstance>();
  const accountForm = createRef<FormInstance>();

  const infoValues = {
    name: bot.name,
    description: bot.description,
    server: bot.server,
  };
  const accountValues = {
    authType: bot.authType === 'cracked',
    username: bot.username,
  };
  const hasPassword = Boolean(bot.password);

  const onSaveValues = (values: any) => {
    setIsSaving(true);
    updateBot(bot.id, values)
      .then((status: boolean) => {
        if (status) {
          setTimeout(() => {
            location.reload()
          }, 1200);
        }
      })
      .catch(({ message }) => {
        setIsSaving(false);
        Modal.error({
          content: message,
        });
      });
  };

  const onDeleteBot = (id: string) => {
    setIsSaving(true);
    deleteBot(id)
      .then(() => {
        setIsSaving(false);
        Modal.success({
          content: 'Bot başarıyla silindi.',
          onOk: () => history('/')
        })
      })
      .catch(({ message }) => {
        setIsSaving(false);
        Modal.error({
          content: message,
        });
      });
  };

  return (
    <>
      <BotInfoHeader bot={bot} />
      <Modal visible={isSaving} footer={null} closable={false}>
        <Space size="large">
          <Spin size="large" />
          Kaydediliyor...
        </Space>
      </Modal>
      <CardContainer>
        <Card title="Site içi bilgiler" style={isMobile ? {width: '350px',} : {width: '450px'}}>
          <Form
            ref={infoForm}
            name="bot-info-form"
            initialValues={infoValues}
            onValuesChange={() => setInfoChanged(true)}
            onFinish={onSaveValues}
            {...formItemLayout}
          >
            <Form.Item name="name" label="Ad" rules={[{ required: true, message: 'Lütfen botunuzun adını doldurun.'}]}>
              <Input placeholder="Minecraft Botum" />
            </Form.Item>
            <Form.Item name="description" label="Açıklama" rules={[{ required: false, message:'Lütfen botunuzun açıklamasını doldurun.' }]}>
              <Input placeholder="AFK Botum" />
            </Form.Item>
            <Form.Item
              name="server"
              label="Server"
              extra="Hangi sunucuda afk bırakmak istiyorsunuz?"
              rules={[{ required: true, message: 'Lütfen botunuzun sunucusunu doldurun.'}]}
            >
              <Input placeholder="e.g. mc.cobblestone.com.tr" />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" disabled={!infoChanged}>Kaydet</Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Minecraft Hesabınız" style={isMobile ? {width: '350px',} : {width: '450px'}}>
          <Form
            ref={accountForm}
            name="bot-account-form"
            initialValues={accountValues}
            onValuesChange={() => setAccountChanged(true)}
            onFinish={onSaveValues}
            {...formItemLayout}
          >
            <Form.Item name="authType"
              label="Hesap Türü"
              rules={[{ required: true }]}
              extra={'Yanlış seçim botunuzun çalışmasına engel olabilir.'}
            >
              <Select disabled placeholder="Yakında...c:\Users\artren\Desktop\portal.mcbot.org\static\js\components\minecraft\InventoryView.tsx">
                <Select.Option key="mojang" value="mojang">Yakında</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="username" label="Hesap Adı" rules={[{ required: true, message: 'Hesabınızın adını girin',
                                validator: (_, value) =>
                                    !value.includes(" ")
                                    ? Promise.resolve()
                                    : Promise.reject(new Error("Boşluğa izin verilmiyor!"))
                                }]}>
              <Input placeholder="CobbleBotAFK" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Şifre"
              extra={hasPassword ? 'Değişmek istemiyorsanız boş bırakabilirsiniz.' : 'Kaydetmek istemiyorsanız boş bırakabilirsiniz.'}
            >
              <Input.Password placeholder={hasPassword ? 'Görüntülenemez.' : ''} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" disabled={!accountChanged}>Kaydet</Button>
            </Form.Item>
          </Form>
        </Card>
        <BotOptionsCard
          bot={bot}
          style={isMobile ? {width: '350px',} : {width: '450px'}}
          onSaveValues={onSaveValues}
          onDeleteBot={onDeleteBot}
        />
      </CardContainer>
    </>
  );
}

export default BotSettingsSubPage;
