import { Code, CSSProperties, parseThemeColor, Stack, Table, Title } from "@mantine/core";
import { useAppState } from "../lib/appstate";
import { Utils } from "../lib/utils";
import { useEffect, useState } from "preact/hooks";

import './stacked-grid.scss';

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
                console.log(color);
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

const renderDisplaySection = (
  display: Display,
  aspectRatios: AspectRatio[],
  arIndex: number,
  zoomFactor: number,
) => {
  const displayDim = Utils.computeDimension(display);
  const arDims =
    aspectRatios.map(ar => Utils.computeContentDimension(displayDim, ar));

  return (
    <Stack mb='xl' gap={0}>
      <Title order={4} mb='md'>
        On the
        <Code fz='h4' bg='none'>{Utils.getDisplayLabel(display)}</Code>
        Display
      </Title>

      {renderTable(displayDim, aspectRatios, arDims, arIndex)}

      <div className="stacked-grid" style={{
        width: `${displayDim.width * zoomFactor}in`,
        height: `${displayDim.height * zoomFactor}in`,
        outline: 'solid 1px',
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

  const shouldRender = displays.length > 0 && aspectRatios.length > 0;

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

  return !shouldRender ? null : (
    <div onMouseEnterCapture={highlightAspectRatio}>
      {
        displays.map(d => renderDisplaySection(
          d, aspectRatios, highlightIndex, zoomFactor))
      }
    </div>
  );
}