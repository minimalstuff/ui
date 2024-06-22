import '@emotion/react';
import { Borders } from '~/styles/border';
import { FontSizes } from '~/styles/font_size';
import { Medias } from '~/styles/media_queries';
import { lightThemeColors } from '~/styles/themes/light_theme';
import { Transitions } from '~/styles/transition';
import { UITheme } from './theme';

export type Colors = typeof lightThemeColors;

declare module '@emotion/react' {
  export interface Theme extends UITheme {
    colors: Colors;
    borders: Borders;
    medias: Medias;
    transitions: Transitions;
    fontSizes: FontSizes;
  }
}
