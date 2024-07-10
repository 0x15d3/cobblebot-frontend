import { useEffect} from 'react';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';
import { getAuthService } from '../../firebase/index';
import { Alert, Space } from 'antd';
import { EmailAuthProvider, GoogleAuthProvider, PhoneAuthProvider} from 'firebase/auth';
import logo from '../../../Cobblestone.png';
import { isMobile } from 'react-device-detect';

const LoginPage = () => {

  const uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
      { provider: EmailAuthProvider.PROVIDER_ID, fullLabel: "Email ile giriş yap"},
      { provider: GoogleAuthProvider.PROVIDER_ID, fullLabel: "Gmail ile giriş yap"},
      { provider: PhoneAuthProvider.PROVIDER_ID, fullLabel: "Telefon ile giriş yap",
        defaultCountry: 'TR',
        recaptchaParameters: {
          type: 'image',
          size: 'invisible',
          badge: 'inline'
        }
      }
    ]
  };

  useEffect(() => {
    const auth = getAuthService();
      if (!firebaseui.auth.AuthUI.getInstance()) {
        const ui = new firebaseui.auth.AuthUI(auth);
        ui.start('#firebaseui-auth-container', uiConfig);
    }
  });

  return (
    <Space direction="vertical" align="center" style={{ width: '100%', margin: '0 auto' }} size={32}>
        <img style={{width: '100px',height: '100px'}} data-testid="logo" src={logo} alt="CobbleBot Logo" />
        <Alert type="info" style={{ width: isMobile ? '100%' : '500px'}} 
        message={"Yüksek talep nedeni ile botunu bugün başlatamayabilirsin. Botunu bugün başlatamıyorsan, lütfen birkaç saat sonra tekrar dene veya yarın tekrar gel. Anlayışın için teşekkürler."} />
        <div style={{ width: '360px' }}>
        <div id="firebaseui-auth-container"></div>
      </div>
    </Space>
  );
}

export default LoginPage;
