import { generateCssVariables } from '../../utils/generateCssVariables';

export type ScrollAreaThumbCssVars = {
  /**
   * The scroll area thumb's height.
   * @type number
   * */
  scrollAreaThumbHeight: string;
  /**
   * The scroll area thumb's width.
   * @type number
   * */
  scrollAreaThumbWidth: string;
};

export const scrollAreaThumbCssVars: ScrollAreaThumbCssVars = generateCssVariables([
  'scrollAreaThumbHeight',
  'scrollAreaThumbWidth',
]);
