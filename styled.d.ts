import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    bg: string;
    bgLight: string;
    primary: string;
    text_primary: string;
    text_secondary: string;
    card: string;
    card_light: string;
    button: string;
    white: string;
    black: string;
  }
}
