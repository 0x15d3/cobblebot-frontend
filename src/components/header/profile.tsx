import { CSSProperties } from 'react';
import { LogoutOutlined, SmileOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { UserState } from '../../providers/AuthProvider';

type ProfileMenuProps = {
  user: UserState,
};

const style: CSSProperties = {
  color: '#ccc',
}

function ProfileMenu({ user }: ProfileMenuProps) {
  const { displayName, email, isAdmin } = user;
  return (
    <div>
      
        {isAdmin ?
        (
        <Link to="/admin" data-testid="admin-link">
          <Button type="link" icon={<SmileOutlined style={{ color: 'magenta' }} />} />
        </Link>
        ):
        (<div></div>)
        }

      {!isMobile && <Button type="text" style={style} disabled>{displayName || email}</Button>}
      <Tooltip title="Çıkış Yap">
        <Link to="/logout" data-testid="logout-link">
          <Button type="link" icon={<LogoutOutlined />} />
        </Link>
      </Tooltip>
    </div>
  );
}

export default ProfileMenu;
