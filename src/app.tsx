import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import viteLogo from '/vite.svg'
import './app.css'
import { Ruler } from './ruler/ruler'

type AspectRatio = {
  width: number, height: number
}

export const App = () => {
  const [aspectRatios, setAspectRatios] = useState<AspectRatio[]>([]);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');

  // Add a new aspect ratio to the list
  const addAspectRatio = () => {
    if (width && height) {
      const newAspectRatio = { width: parseInt(width), height: parseInt(height) };
      setAspectRatios([...aspectRatios, newAspectRatio]);
      setWidth('');
      setHeight('');
    }
  };

  return (
    <div className="App">
      <h1>Black Bar Visualizer</h1>

      <Ruler/>

      <div className="input-container">
        <input
          type="number"
          value={width}
          onChange={e => setWidth(e.currentTarget.value)}
          placeholder="Width"
        />
        <input
          type="number"
          value={height}
          onChange={e => setHeight(e.currentTarget.value)}
          placeholder="Height"
        />
        <button onClick={addAspectRatio}>Add Aspect Ratio</button>
      </div>

      <div className="ratios-container">
        {aspectRatios.length > 0 ? (
          aspectRatios.map((ratio, index) => (
            <div key={index} className="aspect-ratio-box" style={{
              aspectRatio: `${ratio.width} / ${ratio.height}`
            }}>
              <span>{ratio.width} : {ratio.height}</span>
            </div>
          ))
        ) : (
          <p>No aspect ratios added yet.</p>
        )}
      </div>
    </div>
  );
};

export default App;