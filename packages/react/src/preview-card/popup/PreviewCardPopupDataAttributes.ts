export enum PreviewCardPopupDataAttributes {
  /**
   * Present when the preview card is open.
   */
  open = 'data-open',
  /**
   * Present when the preview card is closed.
   */
  closed = 'data-closed',
  /**
   * Present when the preview card is animating in.
   */
  startingStyle = 'data-starting-style',
  /**
   * Present when the preview card is animating out.
   */
  endingStyle = 'data-ending-style',
  /**
   * Indicates which side the preview card is positioned relative to the trigger.
   * @type {'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start'}
   */
  side = 'data-side',
}
