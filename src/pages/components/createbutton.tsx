import { Component, createRef, ReactNode } from 'react';
import { Button, Form, Input, Modal, Select, Steps, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BotEntity, createBot } from '../../firebase/bot';
import { FormInstance } from 'antd/lib/form';
import { CSSProperties } from 'react';
import { getAnalytic, getAuthService } from '../../firebase';
import { logEvent } from 'firebase/analytics';
import { Option } from 'antd/lib/mentions';
interface BotCreationButtonProps {
    disabled?: boolean;
    children?: ReactNode;
}

interface BotCreationButtonState {
    modalVisible: boolean;
    requesting: boolean;
    currentStep: number;
    formValues: any;
}

const formStyle: CSSProperties = {
    marginTop: '24px',
};

let uid;
class BotCreationButton extends Component<BotCreationButtonProps, BotCreationButtonState> {
    state = {
        modalVisible: false,
        requesting: false,
        currentStep: 0,
        formValues: {
            status: "OFFLINE",
            type: 'AFK',
            dig: 'ABORT',
            authType: 'Cracked',
        },
    };

    formRef = createRef<FormInstance>();

    showModal = () => {
        uid = getAuthService().currentUser!.uid;

        if (!uid) return this.showError("Önce kayıt olmanız gerekiyor!")
        logEvent(getAnalytic(), 'create_bot_start');
        this.setState({
            modalVisible: true,
        });
    };

    showError = (error: string) => {
        logEvent(getAnalytic(), 'create_bot_show_error');
        this.setState({
            requesting: false,
        });
        Modal.error({
            content: error,
        });
    };

    validateServer = (server: string) => {
        this.setState({
            requesting: true,
        });
        return new Promise((resolve, reject) => {
            fetch(`https://api.mcsrvstat.us/2/${server}`)
                .then(response => response.json())
                .then(data => {
                    const { ip, port, online, protocol, version } = data;
                    if (!ip || !port || !online || !protocol) {
                        logEvent(getAnalytic(), 'create_bot_validate_server_failed');
                        reject(`${server} geçerli bir sunucu gibi gözükmüyor lütfen tekrar gözden geçir`);
                    }
                    logEvent(getAnalytic(), 'create_bot_validate_server_success');
                    resolve(version);
                })
                .catch(() => {
                    logEvent(getAnalytic(), 'create_bot_validate_server_error');
                    resolve('');
                })
                .finally(() =>
                    this.setState({
                        requesting: false,
                    })
                );
        });
    };

    onOK = () => {
        this.formRef.current
            ?.validateFields()
            .then(lastValues => {
                logEvent(getAnalytic(), 'create_bot_finish');
                const values = {
                    ...this.state.formValues,
                    ...lastValues,
                };
                this.setState({
                    requesting: true,
                });
                if (!uid) return this.showError("Kayıt olman gerekiyor!")
                createBot(values as BotEntity)
                    .then(data => {
                        const botId = data.id;
                        if (!botId) {
                            this.showError('Oluşturlan botun IDsini alamadım...');
                        } else {
                            this.setState({
                                modalVisible: false,
                            });
                            location.reload()
                        }
                    })
                    .catch(({ message }) => this.showError(message));
            })
            .catch(() => { });
    };

    onCancel = () => {
        logEvent(getAnalytic(), 'create_bot_cancel');
        const { requesting } = this.state;

        if (!requesting) {
            this.setState({
                modalVisible: false,
            });
        }
    };

    onPrevious = () => {
        this.setState(({ currentStep }) => ({ currentStep: currentStep - 1 }));
    };

    onNext = () => {
        const moveToNextStep = (values: any) =>
            this.setState(({ currentStep, formValues }) => ({
                currentStep: currentStep + 1,
                formValues: {
                    userid: uid,
                    ...formValues,
                    ...values,
                },
            }));
        this.formRef.current
            ?.validateFields()
            .then(values => {
                const { currentStep } = this.state;
                const needValidateMCServer = true
                if (currentStep === 1 && needValidateMCServer) {
                    this.validateServer(values.server)
                        .then(() => moveToNextStep(values))
                        .catch(this.showError);
                } else {
                    moveToNextStep(values);
                }
            })
            .catch(() => { });
    };

    render() {
        const { disabled, children = 'Bir Bot Oluştur' } = this.props;
        const { formValues, modalVisible, requesting, currentStep } = this.state;
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

        return (
            <>
                <Button
                    data-testid="bot-creation-button"
                    type="primary"
                    icon={<PlusOutlined />}
                    disabled={disabled}
                    onClick={this.showModal}
                >
                    {children}
                </Button>
                <Modal
                    open={modalVisible}
                    onOk={this.onOK}
                    onCancel={this.onCancel}
                    footer={
                        <>
                            {currentStep > 0 && (
                                <Button key="previous" disabled={requesting} onClick={this.onPrevious}>
                                    Geri
                                </Button>
                            )}
                            {currentStep < 2 && (
                                <Button type="primary" key="next" loading={requesting} disabled={requesting} onClick={this.onNext}>
                                    Devam
                                </Button>
                            )}
                            {currentStep === 2 && (
                                <Button key="ok" type="primary" loading={requesting} onClick={this.onOK}>
                                    Oluştur
                                </Button>
                            )}
                        </>
                    }
                    title="Bot Oluştur"
                >
                    <Steps current={currentStep}>
                        <Steps.Step key={0} title="Botun Tipi" />
                        <Steps.Step key={1} title="Bilgiler" />
                        <Steps.Step key={2} title="Minecraft Kısmı" />
                    </Steps>
                    <Form data-testid="bot-creation-form" ref={this.formRef} name="bot-creation-form" style={formStyle} initialValues={formValues} {...formItemLayout}>
                        {currentStep === 0 && (
                            <>
                                <Typography.Paragraph>Botunuz için bir tür seçin</Typography.Paragraph>
                                <Form.Item name="type" label="Tür" rules={[{ required: true, message: 'Botunuz için bir tür seçmelisiniz' }]}>
                                    <Select>
                                        <Select.Option key={"crack"} value={"crack"}>
                                            AFK
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                            </>
                        )}
                        {currentStep === 1 && (
                            <>
                                <Typography.Paragraph>Lütfen gerekli alanları doldurun</Typography.Paragraph>
                                <Form.Item name="name" label="Ad" rules={[{ required: true, message: 'Botunuzu adlandırın' }]}>
                                    <Input placeholder="AFK Botum" />
                                </Form.Item>
                                <Form.Item name="description" label="Açıklama" rules={[{ required: true, message: 'Açıklama zorunludur!' }]}>
                                    <Input placeholder="Botumun açıklaması" />
                                </Form.Item>
                                
                                <Form.Item name="version" label="Versiyon"  rules={[{ required: true, message: 'Versiyonu seçmeyi unutma!'}]}>
                                <Select defaultActiveFirstOption placeholder="1.16.5" style={{ width: 120 }}>
                                <Option value="1.14">1.14.x</Option>
                                <Option value="1.15">1.15.x</Option>
                                <Option value="1.16">1.16</Option>
                                <Option value="1.16.1">1.16.1</Option>
                                <Option value="1.16.2">1.16.2</Option>
                                <Option value="1.16.3">1.16.3</Option>
                                <Option value="1.16.4">1.16.4</Option>
                                <Option value="1.16.5">1.16.5</Option>
                                <Option value="1.17">1.17</Option>
                                <Option value="1.17.1">1.17.1</Option>
                                <Option value="1.18">1.18</Option>
                                <Option value="1.18.1">1.18.1</Option>
                                <Option value="1.18.2">1.18.2</Option>
                                <Option value="1.19">1.19</Option>
                                <Option value="1.19.1">1.19.1</Option>
                                <Option value="1.19.2">1.19.2</Option>
                                <Option value="1.19.3">1.19.3</Option>
                                <Option value="1.19.4">1.19.4</Option>
                                <Option value="1.20">1.20</Option>
                                <Option value="1.20.1">1.20.1</Option>
                                <Option value="1.20.2">1.20.2</Option>
                                <Option value="1.20.3">1.20.3</Option>
                                <Option value="1.20.4">1.20.4</Option>
                                </Select>
                                </Form.Item>
                                <Form.Item
                                    name="server"
                                    label="Server"
                                    extra="Hangi sunucuda afk bırakmak istiyorsunuz (Geçerli bir ip girmelisiniz)"
                                    rules={[{ required: true, message: 'Lütfen geçerli bir ip adresi gir!' }]}
                                >
                                    <Input placeholder="mc.cobblestone.com.tr" />
                                </Form.Item>
                            </>
                        )}
                        {currentStep === 2 && (
                            <>
                                <Typography.Paragraph>
                                    Botunuzun sunucuya girebilmesi için şifrenize ihtiyacımız var
                                    <strong>(Şifreniz depolarımızda şifreli ve korunaklı bir şekilde güvenle depolanır.)</strong>
                                </Typography.Paragraph>
                                <Form.Item
                                    name="authType"
                                    label="Hesap Türü"
                                    rules={[{ required: true, }]}
                                >
                                    <Select>
                                        <Select.Option key="cracked" value="cracked">
                                            Cracked
                                        </Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="username" label="Hesap Adı" rules={[{ required: true, message: 'Hesabınızın adını girin.',
                                validator: (_, value) =>
                                    !value.includes(" ")
                                    ? Promise.resolve()
                                    : Promise.reject(new Error("Boşluğa izin verilmiyor!"))
                                }]}>
                                    <Input placeholder="selivuzami" />
                                </Form.Item>
                                <Form.Item name="password" label="Şifre" rules={[{ required: true, message: 'Şifreni girmelisin!' }]}>
                                    <Input.Password placeholder="******" />
                                </Form.Item>
                            </>
                        )}
                    </Form>
                </Modal>
            </>
        );
    }
}

export default BotCreationButton;
