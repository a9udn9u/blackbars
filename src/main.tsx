import { render } from 'preact';
import { MantineProvider } from '@mantine/core';
import { buildTheme, cssVarResolver } from './theme.ts';
import { App } from './app.tsx';
import { AppStateProvider } from './lib/appstate.tsx';

import '@mantine/core/styles.css';
import './index.css';

render(
  <MantineProvider
      defaultColorScheme='dark'
      theme={buildTheme()}
      cssVariablesResolver={cssVarResolver}>
    <AppStateProvider>
      <App />
    </AppStateProvider>
  </MantineProvider>,
  document.getElementById('app')!
);
