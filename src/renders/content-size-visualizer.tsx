import { Code, CSSProperties, Group, parseThemeColor, Stack, Table, Title } from "@mantine/core";
import { useAppState } from "../lib/appstate";
import { Utils } from "../lib/utils";
import { useEffect, useState } from "preact/hooks";

import './stacked-grid.scss';

type RenderData = [
  Display,        // Display
  Dimension,      // Display dimensions
  AspectRatio[],  // All selected aspect ratios
  Dimension[],    // Content dimensions on this display
  number[],       // Smallest content area for each aspect ratio by display
];

const sortDisplayByArea = (displays: Display[]): [Display, Dimension][] => {
  const dims = new Map<Display, Dimension>();

  if (!displays || displays.length === 0) return [];
  if (displays.length == 1) {
    const [d] = displays;
    return [[d, Utils.computeDimension(d)]];
  }

  const sorted = [...displays].sort((a, b) => {
    if (!dims.has(a)) dims.set(a, Utils.computeDimension(a));
    if (!dims.has(b)) dims.set(b, Utils.computeDimension(b));
    return dims.get(a)!.area - dims.get(b)!.area;
  });
  return sorted.map(d => [d, dims.get(d)!]);
}

const buildRenderData = (displays: Display[], aspectRatios: AspectRatio[]):
    RenderData[] => {
  const displaysAndDims = sortDisplayByArea(displays);
  const arDimsByDisplay = displaysAndDims.map(([_, dims]) => {
    return aspectRatios.map(ar => Utils.computeContentDimension(dims, ar));
  });
  const arDimsBaselines: number[] = [];
  for (let i = 0; i < aspectRatios.length; i++) {
    const areas = [];
    for (let j = 0; j < arDimsByDisplay.length; j++) {
      areas.push(arDimsByDisplay[j][i].area);
    }
    arDimsBaselines.push(Math.min(...areas));
  }

  return displaysAndDims.map(([display, displayDims], idx) => ([
    display,
    displayDims,
    aspectRatios,
    arDimsByDisplay[idx],
    arDimsBaselines,
  ]));
}

/**
 * Visualize content viewing size on each display
 */
export const ContentSizeVisualizer = () => {
  const {
    selectedDisplays: displays,
    selectedAspectRatios: aspectRatios,
    zoomFactor
  } = useAppState();

  const [highlightIndex, setHighlightIndex] = useState<number>(0);

  useEffect(() => {
    if (highlightIndex >= aspectRatios.length) {
      setHighlightIndex(0);
    }
  }, [aspectRatios]);

  const highlightAspectRatio = (ev: MouseEvent) => {
    let row: HTMLElement | null = ev.target as HTMLElement;
    while (row && row.tagName !== 'TR') row = row.parentElement;
    if (row) {
      const idx = Math.max(0, [...row.parentElement!.children].indexOf(row));
      if (idx !== highlightIndex) {
        setHighlightIndex(idx);
      }
    }
  }

  const shouldRender = displays.length > 0 && aspectRatios.length > 0;

  if (!shouldRender) {
    return null;
  }

  const renderData = buildRenderData(displays, aspectRatios);

  return (
    <>
    <Title order={3} mb='lg'>Content Size Visualization</Title>

      <Group mb='lg'>
        {
          renderData.map(data =>
              renderDisplaySection(data, highlightIndex, zoomFactor))
        }
      </Group>
      <Stack onMouseEnterCapture={highlightAspectRatio} gap={0}>
        {
          renderData.map(data => renderStatsTables(data, highlightIndex))
        }
      </Stack>
    </>
  );
}

const renderDisplaySection = (
  [
    display,
    displayDim,
    aspectRatios,
    arDims,
    arBaselines,
  ]: RenderData,
  arIndex: number,
  zoomFactor: number,
) => {

  return (
    <Stack gap={0} align='center'>
      <Title order={4}>
        <Code fz='h4' bg='none'>{Utils.getDisplayLabel(display)}</Code>
      </Title>
      <div className="stacked-grid content-wrapper" style={{
        width: `${displayDim.width * zoomFactor}in`,
        height: `${displayDim.height * zoomFactor}in`,
      }}>
        {
          arDims
            .filter((_, i) => arIndex === i)
            .map(dim => {
              const color = Utils.getColor(arIndex);
              return (
                <div style={{
                  width: `${dim.width * zoomFactor}in`,
                  height: `${dim.height * zoomFactor}in`,
                  backgroundColor: `${color}`
                }}>
                  <i>{Utils.getAspectRatioLabel(aspectRatios[arIndex])}</i>
                  {
                    <>
                      <div className="diagonal-line" />
                      <i className="diagonal-text" style={{
                        backgroundColor: `${color}`
                      }}>
                        {dim.diagonal.toFixed(1)} in
                        <br/>
                        {(dim.area / arBaselines[arIndex] * 100).toFixed(0)}%
                      </i>
                    </>
                  }
                </div>
              );
            })
        }
      </div>
    </Stack>
  );
}

const renderStatsTables = (
  [
    display,
    displayDim,
    aspectRatios,
    arDims,
  ]: RenderData,
  arIndex: number,
) => {
  return (
    <>
      <Title order={4}>
        The
        <Code fz='h4' bg='none'>{Utils.getDisplayLabel(display)}</Code>
        Display
      </Title>

      {renderTable(displayDim, aspectRatios, arDims, arIndex)}
    </>
  );
}

const renderTable = (
  displayDim: Dimension,
  aspectRatios: AspectRatio[],
  arDims: Dimension[],
  arIndex: number,
) => {
  return (
    <Table mb='md'>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Content</Table.Th>
          <Table.Th>Diagonal</Table.Th>
          <Table.Th>Content Size</Table.Th>
          <Table.Th>Content / Display Ratio</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {
          arDims.map((d, idx) => (
            <Table.Tr styles={theme => {
              const style: Partial<Record<"tr", CSSProperties>> = {};
              if (idx === arIndex) {
                const color = parseThemeColor({
                  color: theme.primaryColor,
                  theme,
                });
                style.tr = {
                  backgroundColor: color.value + '33'
                };
              }
              return style;
            }}>
              <Table.Td>
                {Utils.getAspectRatioLabel(aspectRatios[idx])}
              </Table.Td>
              <Table.Td>
                {`${d.diagonal.toFixed(1)} in / ${d.diagonalCm.toFixed(1)} cm`}
              </Table.Td>
              <Table.Td>
                {`${d.area.toFixed(1)} in² / ${d.areaSqcm.toFixed(1)} cm²`}
              </Table.Td>
              <Table.Td>
                {`${(d.area / displayDim.area * 100).toFixed(0)}%`}
              </Table.Td>
            </Table.Tr>
          ))
        }
      </Table.Tbody>
    </Table>
  );
}