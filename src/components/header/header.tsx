import { CSSProperties } from 'react';
import { Layout, Space } from 'antd';
import { AuthContext } from '../../providers/AuthProvider';
import '../../Header.css';
import Logo from './Logo';
import ProfileMenu from './profile';

const style: CSSProperties = {
  justifyContent: 'space-between',
  width: '100%',
};

function Header() {
  return (
    <AuthContext.Consumer>
      {({ userState }) => (
        userState ? (
          <Layout.Header className="header">
            <Space style={style}>
              <Logo />
              <ProfileMenu user={userState} />
            </Space>
          </Layout.Header>
        ) : <></>
      )}
    </AuthContext.Consumer>
  );
}

export default Header;
