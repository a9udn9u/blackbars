import { useState } from 'preact/hooks'
import './ruler.scss'

type Props = {
  updateZoomFactor?: (f: number) => void
}

export const Ruler = ({updateZoomFactor}: Props) => {
  const [zoom, setZoom] = useState(1.0);

  const setZoomFactor = (newFactor: string) => {
    const factor = parseFloat(newFactor);
    setZoom(factor);
    updateZoomFactor && updateZoomFactor(factor);
  }

  return (
    <div className="ruler">
      <div className="slider-wrapper">
        <label>
          Zoom factor
          (
            <abbr title="The browser cannot accurately display content in
                real-world length units, such as inches or centimeters. You can
                manually adjust the zoom factor to make the content size closer
                to its real-world size.">
              ?
            </abbr>
          )
          :&nbsp;
          <code className="zoom-factor">{zoom.toFixed(2)}</code>
          <br/>
          <input className="slider" type="range" min="0.25" max="2"
              step="0.01" value={zoom}
              onInput={e => setZoomFactor(e.currentTarget.value)} />
        </label>
      </div>

      <div className="units">
        <p className="unit cm" style={{width: (1*zoom) + 'cm'}}>
          <span>1 cm</span>
        </p>
        <p className="unit in" style={{width: (1*zoom) + 'in'}}>
          <span>1 in</span>
        </p>
      </div>
    </div>
  );
};
