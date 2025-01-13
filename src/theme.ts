import { createTheme, CSSVariablesResolver } from "@mantine/core"

export const buildTheme = () => {
  return createTheme({
    fontFamily: 'roboto, sans-serif',
    headings: {
      fontFamily: 'inter tight, sans-serif',
    },
    colors: {
      'atomic-purple': [
        '#F0BBDD',
        '#ED9BCF',
        '#EC7CC3',
        '#ED5DB8',
        '#F13EAF',
        '#F71FA7',
        '#FF00A1',
        '#E00890',
        '#C50E82',
        '#AD1374'
      ],
    },
    primaryColor: 'atomic-purple'
  });
}

export const cssVarResolver: CSSVariablesResolver = _theme => ({
  variables: {
  },
  light: {
  },
  dark: {
  }
});