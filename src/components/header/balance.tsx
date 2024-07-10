
import { Link } from 'react-router-dom';
import logo from '../../../Cobblestone.png';


function Balance() {
  return (
    <Link to="/">
      <div>
      <img style={{height: '36px',position:"fixed", top:"15px"}} data-testid="logo" src={logo} alt="CobbleBot Logo" />
      <span style={{paddingLeft: '44px',fontSize: '24px',fontWeight: 'bold',color: '#fff'}}> 
        CobbleBot
      </span>
      </div>
    </Link>
  );
}

export default Balance;
