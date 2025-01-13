import { Badge, Code, Slider } from '@mantine/core';
import { InfoBubble } from './info-bubble';

import './ruler.scss'
import { useAppState } from '../lib/appstate';

type Props = {
}

export const Ruler = ({}: Props) => {
  const {zoomFactor, setZoomFactor} = useAppState();

  return (
    <>
      <div>
        <label>
          Zoom factor
          <InfoBubble>
            The browser cannot accurately display content in real-world length
            units, such as inches or centimeters. You can manually adjust the
            zoom factor to make the content size closer to its real-world size.
          </InfoBubble>

          <Slider defaultValue={zoomFactor} onChange={setZoomFactor} mt="xs"
              min={.25} max={2} step={0.01} size={2}
          />
        </label>
      </div>

      <Badge><Code bg={'transparent'}>{zoomFactor.toFixed(2)}</Code></Badge>

      <div className="units">
        <p className="unit cm" style={{width: (1 * zoomFactor) + 'cm'}}>
          <span>1 cm</span>
        </p>
        <p className="unit in" style={{width: (1 * zoomFactor) + 'in'}}>
          <span>1 in</span>
        </p>
      </div>
    </>
  );
};
