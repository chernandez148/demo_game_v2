import './App.css';
import { RecoilRoot } from 'recoil';
import GameContainer from '../Game/GameContainer/GameContainer';
import video from '../../assets/video/background_game.mp4'

function App() {
  return (
    <div className='video-container flex items-center justify-center h-screen'>
      <div className="video-overlay"></div>
      <div className="video-background">
        <video autoPlay loop muted>
          <source src={video} type="video/mp4" />
        </video>
      </div>
      <RecoilRoot>
        <GameContainer />
      </RecoilRoot>
    </div>

  );
}

export default App;
