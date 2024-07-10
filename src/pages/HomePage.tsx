import { CSSProperties,} from 'react';
import BotList from './botpage/BotList';
import { useParams } from 'react-router-dom';

const style: CSSProperties = {
  padding: '24px 0',
};

function HomePage() {
  const { uid } = useParams<{ uid:any }>();
  
  return (
    <div style={style}>
      <BotList id={uid} />
    </div>
  );
}

export default HomePage;
