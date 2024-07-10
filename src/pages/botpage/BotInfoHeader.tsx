import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag } from 'antd';
import { CSSProperties } from 'react';
import { isMobile } from 'react-device-detect';
import ImmersiveModeTag from '../common/ImmersiveModeTag';
import { PageHeader } from '@ant-design/pro-components';
import { BotEntity } from '../../firebase/bot';
import { AuthContext } from '../../providers/AuthProvider';

interface BotInfoHeaderProps {
  bot: BotEntity,
  actions?: ReactNode,
}

const style: CSSProperties = {
  padding: '0 0 16px 0',
}

function BotInfoHeader({ bot, actions }: BotInfoHeaderProps) {
  const history = useNavigate();

  return (
    <AuthContext.Consumer>
      {({ userState }) => {
        const isImmersive = userState?.uid !== bot.userid;
        const tags = [<Tag key="bot-type">{`${bot.type.toUpperCase()} Bot`}</Tag>];
        if (isImmersive) {
          tags.push(<ImmersiveModeTag key="admin" />);
        }
        return <PageHeader
          style={style}
          onBack={() => history(isImmersive ? `/${bot.userid}` : '/')}
          title={bot.name}
          subTitle={isMobile ? '' : bot.description}
          tags={tags}
          extra={actions}
        />;
      }}
    </AuthContext.Consumer>
  );
}

export default BotInfoHeader;
