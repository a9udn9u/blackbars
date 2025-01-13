import './app.css'
import { Ruler } from './components/ruler'
import { DisplaySelector } from './components/display-selector'
import { Group, Tabs, Text, Title } from '@mantine/core'
import { AspectRatioSelector } from './components/ar-selector'
import { DisplaySizeComparison } from './renders/display-size-comparison'
import { ContentSizeVisualizer } from './renders/content-size-visualizer'

export const App = () => {
  return (
    <>
      <Title order={1} my={'lg'} className="site-name">Black Bars</Title>

      <Text my={'md'}>
        This simple tool helps retro handheld enthusiasts visualize how content
        will appear on screens with different aspect ratios.
      </Text>

      <Group mb='xl' gap='xl' align='flex-end'>
        <AspectRatioSelector/>
      </Group>

      <Group mb='xl' gap='xl' align='flex-end'>
        <DisplaySelector/>
      </Group>

      <Group mb='xl' gap='xl'>
        <Ruler/>
      </Group>

      <Tabs defaultValue="csv">
        <Tabs.List>
          <Tabs.Tab value="csv">Content Size Visualization</Tabs.Tab>
          <Tabs.Tab value="dsc">Display Size Comparison</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel my='lg' value="csv">
          <ContentSizeVisualizer/>
        </Tabs.Panel>

        <Tabs.Panel my='lg' value="dsc">
          <DisplaySizeComparison/>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default App;