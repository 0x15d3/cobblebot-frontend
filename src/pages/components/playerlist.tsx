import { Avatar, Badge, List, Tooltip } from 'antd';
import { CSSProperties } from 'react';
import AnsiText from '../../components/bot/AnsiText';

export interface Player {
  username: string;
  displayName: string;
  uuid: string;
  isNearby?: boolean;
}

interface PlayerListProps {
  players: Player[];
  style?: CSSProperties;
}

const style: CSSProperties = {
  backgroundColor: '#001529',
  padding: '16px',
};

function PlayerList({ players, style: customStyle }: PlayerListProps) {
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.isNearby && !b.isNearby) {
      return -1;
    }
    if (!a.isNearby && b.isNearby) {
      return 1;
    }
    return 0;
  });

  return (
    <List
      style={{
        ...style,
        ...customStyle,
      }}
      size="small"
      split={false}
      dataSource={sortedPlayers}
      renderItem={(player: Player) => (
        <List.Item>
          <List.Item.Meta
            key={player.uuid}
            avatar={
              <Badge dot={player.isNearby}>
                <Avatar size="small" shape="square" src={`https://mc-heads.net/avatar/${player.username}`} />
              </Badge>
            }
            title={
              <Tooltip title={player.username}>
                <AnsiText text={player.displayName} />
              </Tooltip>
            }
          />
        </List.Item>
      )}
    />
  );
}

export default PlayerList;
