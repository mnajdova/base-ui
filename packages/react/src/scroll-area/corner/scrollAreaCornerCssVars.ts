import { generateCssVariables } from '../../utils/generateCssVariables';

export type ScrollAreaCornerCssVars = {
  /**
   * The scroll area corner's height.
   * @type number
   * */
  scrollAreaCornerHeight: string;
  /**
   * The scroll area corner's width.
   * @type number
   * */
  scrollAreaCornerWidth: string;
};

export const scrollAreaCornerCssVars: ScrollAreaCornerCssVars = generateCssVariables([
  'scrollAreaCornerHeight',
  'scrollAreaCornerWidth',
]);
