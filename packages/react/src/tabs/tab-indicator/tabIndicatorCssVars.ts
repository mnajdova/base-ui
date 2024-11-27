import { generateCssVariables } from '../../utils/generateCssVariables';

export type TabIndicatorCssVars = {
  /**
   * The active tab's left distance.
   * @type number
   * */
  activeTabLeft: string;
  /**
   * The active tab's right distance.
   * @type number
   * */
  activeTabRight: string;
  /**
   * The active tab's top distance.
   * @type number
   * */
  activeTabTop: string;
  /**
   * The active tab's bottom distance.
   * @type number
   * */
  activeTabBottom: string;
  /**
   * The active tab's width.
   * @type number
   * */
  activeTabWidth: string;
  /**
   * The active tab's height.
   * @type number
   * */
  activeTabHeight: string;
};

export const tabIndicatorCssVars: TabIndicatorCssVars = generateCssVariables([
  'activeTabLeft',
  'activeTabRight',
  'activeTabTop',
  'activeTabBottom',
  'activeTabWidth',
  'activeTabHeight',
]);
