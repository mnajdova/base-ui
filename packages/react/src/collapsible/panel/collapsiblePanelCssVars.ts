import { generateCssVariables } from '../../utils/generateCssVariables';

export type CollapsiblePanelCssVars = {
  /**
   * The collapsible panel's height.
   * @type number
   * */
  collapsiblePanelHeight: string;
  /**
   * The collapsible panel's width.
   * @type number
   * */
  collapsiblePanelWidth: string;
};

export const collapsiblePanelCssVars: CollapsiblePanelCssVars = generateCssVariables([
  'collapsiblePanelHeight',
  'collapsiblePanelWidth',
]);
