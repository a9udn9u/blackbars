import { useState } from 'preact/hooks'
import { Autocomplete, Chip, Code, Group, Text } from '@mantine/core';
import { InfoBubble } from './info-bubble';
import { useAppState } from '../lib/appstate';
import { Utils } from '../lib/utils';

type Props = {
}

const parseAspectRatio = (specs: string): AspectRatio | undefined => {
  const matches = (specs || '').trim().match(/^(\d+)\s+(\d+)$/);
  if (matches) {
    const [_, x, y] = matches;
    return { x: parseInt(x), y: parseInt(y) };
  }
}

export const AspectRatioSelector = ({}: Props) => {
  const [arInput, setArInput] = useState('');
  const state = useAppState();

  const handleKeyUp = (ev: KeyboardEvent) => {
    const value = (ev.target as HTMLInputElement).value;
    if (ev.key === 'Enter' || ev.keyCode === 13) {
      ev.preventDefault();
      addAspectRatio(value);
    } else {
      setArInput(value);
    }
  }

  const handleBlur = (ev: FocusEvent) => {
    addAspectRatio((ev.target as HTMLInputElement).value);
  }

  const addAspectRatio = (deviceOrSpec: string) => {
    deviceOrSpec = deviceOrSpec.trim();
    if (deviceOrSpec) {
      let ar = state.platforms.get(deviceOrSpec);
      if (!ar) {
        ar = parseAspectRatio(deviceOrSpec);
      }
      if (ar) {
        state.addAspectRatio(ar);
        setArInput('');
      }
    }
  }

  return (
    <>
      <label>
        Content Aspect Ratio
        <InfoBubble>
          <Text>
            Select platforms, or add custom aspect ratio by typing
            <Code>&lt;width&gt; &lt;height&gt;</Code> then hit
            <Code>&lt;enter&gt;</Code>.
            For example <Code>4 3</Code> represents 4:3 content.
          </Text>
        </InfoBubble>

        <Autocomplete
            mt='xs'
            spellcheck={false}
            value={arInput}
            data={[...state.platforms.keys()]}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            onOptionSubmit={addAspectRatio}
        />
      </label>

      <Group>
        {
          state.selectedAspectRatios.map(ar =>
            <Chip icon='x' defaultChecked
                onClick={() => state.removeAspectRatio(ar)}>
              {Utils.getAspectRatioLabel(ar)}
            </Chip>
          )
        }
      </Group>
    </>
  );
};
