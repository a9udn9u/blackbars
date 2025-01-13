import { createContext } from "preact";
import { DEVICES, INITIAL_ASPECT_RATIOS, INITIAL_DISPLAYS, PLATFORMS } from "./initial-states";
import { useContext, useState } from "preact/hooks";

/**
 * Local storage keys for selected aspect ratios
 */
const SELECTED_AR_KEY = 'selected-aspect-ratios';

/**
 * Local storage keys for selected displays
 */
const SELECTED_DISPLAYS_KEY = 'selected-displays';

/**
 * Local storage key for the zoom factor
 */
const SELECTED_ZOOM_FACTOR_KEY = 'selected-zoom-factor';

const retrieve = localStorage.getItem.bind(localStorage);
const store = localStorage.setItem.bind(localStorage);
const fromJson = JSON.parse.bind(JSON);
const toJson = JSON.stringify.bind(JSON);

// Bootstrap app states
(() => {
  if (!retrieve(SELECTED_AR_KEY)) {
    store(SELECTED_AR_KEY, toJson(INITIAL_ASPECT_RATIOS));
  }
  if (!retrieve(SELECTED_DISPLAYS_KEY)) {
    store(SELECTED_DISPLAYS_KEY, toJson(INITIAL_DISPLAYS));
  }
  if (!retrieve(SELECTED_ZOOM_FACTOR_KEY)) {
    store(SELECTED_ZOOM_FACTOR_KEY, '1');
  }
})();

const storedAspectRatios: AspectRatio[] =
    fromJson(retrieve(SELECTED_AR_KEY) || '[]');

const storedDisplays: Display[] =
    fromJson(retrieve(SELECTED_DISPLAYS_KEY) || '[]');

const storedZoomFactor: number =
    parseFloat(retrieve(SELECTED_ZOOM_FACTOR_KEY) || '1');

// Add an element to an array, return the array with duplicated entries removed
const addAndDedupe = (list: any[], item: any): any[] => {
  return [...new Set((list || []).concat(item).map(d => toJson(d)))]
      .map(s => fromJson(s));
}

const storeAspectRatios = (aspectRatios: AspectRatio[]) => {
  store(SELECTED_AR_KEY, toJson(aspectRatios));
}

const storeDisplays = (displays: Display[]) => {
  store(SELECTED_DISPLAYS_KEY, toJson(displays));
}

const storeZoomFactor = (factor: number) => {
  store(SELECTED_ZOOM_FACTOR_KEY, '' + factor);
}

const appState = () => {
  const [aspectRatios, setAspectRatios] = useState(storedAspectRatios);
  const [displays, setDisplays] = useState(storedDisplays);
  const [zoomFactor, setZoomFactorState] = useState(storedZoomFactor);

  const addAspectRatio = (ar: AspectRatio) => {
    const neo = addAndDedupe(aspectRatios, ar);
    storeAspectRatios(neo);
    setAspectRatios(neo);
  }

  const removeAspectRatio = (ar: AspectRatio) => {
    const ser = new Set(aspectRatios.map(d => toJson(d)));
    ser.delete(toJson(ar));

    const neo = [...ser].map(s => fromJson(s));
    storeAspectRatios(neo);
    setAspectRatios(neo);
  }

  const addDisplay = (display: Display) => {
    const neo = addAndDedupe(displays, display);
    storeDisplays(neo);
    setDisplays(neo);
  }

  const removeDisplay = (display: Display) => {
    const ser = new Set(displays.map(d => toJson(d)));
    ser.delete(toJson(display));

    const neo = [...ser].map(s => fromJson(s));
    storeDisplays(neo);
    setDisplays(neo);
  }

  const setZoomFactor = (factor: number) => {
    storeZoomFactor(factor);
    setZoomFactorState(factor);
  }

  return {
    platforms: new Map<string, AspectRatio>(PLATFORMS),
    devices: new Map<string, Display>(DEVICES),
    selectedAspectRatios: aspectRatios,
    selectedDisplays: displays,
    zoomFactor,
    addAspectRatio,
    removeAspectRatio,
    addDisplay,
    removeDisplay,
    setZoomFactor,
  };
}

const context = createContext({
  platforms: new Map<string, AspectRatio>(),
  devices: new Map<string, Display>(),
  selectedAspectRatios: [] as AspectRatio[],
  selectedDisplays: [] as Display[],
  zoomFactor: 1.0,
  addAspectRatio: (_: AspectRatio) => {},
  removeAspectRatio: (_: AspectRatio) => {},
  addDisplay: (_: Display) => {},
  removeDisplay: (_: Display) => {},
  setZoomFactor: (_: number) => {},
});

export const AppStateProvider = ({ children }: any) => {
  return (
    <context.Provider value={appState()}>
      {children}
    </context.Provider>
  );
}

export const useAppState = () => {
  return useContext(context);
}