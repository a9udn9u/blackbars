import { useState } from 'preact/hooks'
import { Autocomplete, Chip, Code, Group, Text } from '@mantine/core';
import { InfoBubble } from './info-bubble';
import { useAppState } from '../lib/appstate';
import { Utils } from '../lib/utils';

type Props = {
}

const parseDisplay = (specs: string): Display | undefined => {
  const matches = (specs || '').trim().match(/^(\d*\.?\d+)\s+(\d+)\s+(\d+)$/);
  if (matches) {
    const [_, size, x, y] = matches;
    console.log(matches);
    return {
      size: Math.round(parseFloat(size) * 100) / 100,
      ar: { x: parseInt(x), y: parseInt(y) }
    }
  }
}

export const DisplaySelector = ({}: Props) => {
  const [displayInput, setDisplayInput] = useState('');
  const state = useAppState();

  const handleKeyUp = (ev: KeyboardEvent) => {
    const value = (ev.target as HTMLInputElement).value;
    if (ev.key === 'Enter' || ev.keyCode === 13) {
      ev.preventDefault();
      addDisplay(value);
    } else {
      setDisplayInput(value);
    }
  }

  const handleBlur = (ev: FocusEvent) => {
    addDisplay((ev.target as HTMLInputElement).value);
  }

  const addDisplay = (deviceOrSpec: string) => {
    deviceOrSpec = deviceOrSpec.trim();
    if (deviceOrSpec) {
      let display = state.devices.get(deviceOrSpec);
      if (!display) {
        display = parseDisplay(deviceOrSpec);
      }
      if (display) {
        state.addDisplay(display);
        setDisplayInput('');
      }
    }
  }

  return (
    <>
      <div>
        <label>
          Add Display
          <InfoBubble>
            <Text>
              Try search by handheld names, if the handheld is not in our
              database, you can add custom display specs by typing
              <Code>&lt;size&gt; &lt;width&gt; &lt;height&gt;</Code>
              then hit <Code>&lt;enter&gt;</Code>.
              For example <Code>3.5 4 3</Code> represents a 3.5 inch 4:3
              display.
            </Text>
          </InfoBubble>

          <Autocomplete
              mt='xs'
              spellcheck={false}
              value={displayInput}
              data={[...state.devices.keys()]}
              onBlur={handleBlur}
              onKeyUp={handleKeyUp}
              onOptionSubmit={addDisplay}
          />
        </label>
      </div>

      <Group>
        {
          state.selectedDisplays.map(display =>
            <Chip icon='x' defaultChecked
                onClick={() => state.removeDisplay(display)}>
              {Utils.getDisplayLabel(display)}
            </Chip>
          )
        }
      </Group>
    </>
  );
};
