import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSProperties } from 'react';
import { PageHeader } from '@ant-design/pro-components';
import { AuthContext } from '../../providers/AuthProvider';

interface AdminHeaderProps {
  actions?: ReactNode,
  title?: string,
}

const style: CSSProperties = {
  padding: '0 0 16px 0',
}

function AdminHeader({ actions,title }: AdminHeaderProps) {
  const history = useNavigate();

  return (
    <AuthContext.Consumer>
      {() => {
        return <PageHeader
          style={style}
          title={title}
          onBack={() => history('/')}
          extra={actions}
        />;
      }}
    </AuthContext.Consumer>
  );
}

export default AdminHeader;
