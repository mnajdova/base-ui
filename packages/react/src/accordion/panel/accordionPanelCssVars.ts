import { generateCssVariables } from '../../utils/generateCssVariables';

export type AccordionPanelCssVars = {
  /**
   * The accordion panel's height.
   * @type number
   * */
  accordionPanelHeight: string;
  /**
   * The accordion panel's width.
   * @type number
   * */
  accordionPanelWidth: string;
};

export const accordionPanelCssVars: AccordionPanelCssVars = generateCssVariables([
  'accordionPanelHeight',
  'accordionPanelWidth',
]);
