import { Table } from "@mantine/core";
import { useAppState } from "../lib/appstate";
import { Utils } from "../lib/utils";

import './stacked-grid.scss';

const sortDisplaysByWidth = (displays: Display[]) => {
  let maxWidth = 0, maxHeight = 0;
  const sorted = [...displays].sort((a, b) => {
    const {width: w1, height: h1} = Utils.computeDimension(a);
    const {width: w2, height: h2} = Utils.computeDimension(b);
    maxWidth = Math.max(maxWidth, w1, w2);
    maxHeight = Math.max(maxHeight, h1, h2);
    return w1 - w2;
  });
  return [sorted, maxWidth, maxHeight] as [Display[], number, number];
}

const getTableData = (displays: Display[]) => {
  const dims = displays.map(Utils.computeDimension);
  const areaBaseline = dims[0].area;

  return dims.map((d, idx) => [
    Utils.getDisplayLabel(displays[idx]),
    `${d.width.toFixed(1)} in / ${d.widthCm.toFixed(1)} cm`,
    `${d.height.toFixed(1)} in / ${d.heightCm.toFixed(1)} cm`,
    `${d.area.toFixed(1)} in² / ${d.areaSqcm.toFixed(1)} cm²`,
    `${(d.area / areaBaseline * 100).toFixed(0)}%`
  ]);
}

/**
 * Compare display sizes
 */
export const DisplaySizeComparison = () => {
  const {selectedDisplays, zoomFactor} = useAppState();
  const [displays, maxWidth, maxHeight] = sortDisplaysByWidth(selectedDisplays);

  const shouldRender = displays.length > 0;

  const tableData = !shouldRender ? {} : {
    head: ['Display', 'Width', 'Height', 'Viewing Area', 'Area Difference'],
    body: getTableData(displays)
  };

  return !shouldRender ? null : (
    <>
      <Table mb='lg' data={tableData}/>

      <div className="stacked-grid end" style={{
        width: `${maxWidth * zoomFactor}in`,
        height: `${maxHeight * zoomFactor}in`,
      }}>
      {
        // Stack narrower elements on top of wider elements
        [...displays].reverse().map((display, i) => {
          const dim = Utils.computeDimension(display);
          return (
            <div
                style={{
                  width: `${dim.width * zoomFactor}in`,
                  height: `${dim.height * zoomFactor}in`,
                  backgroundColor: `${Utils.getColor(i)}AF`
                }}
            >
              <i>{Utils.getDisplayLabel(display)}</i>
            </div>
          );
        })
      }
      </div>
    </>
  );
}