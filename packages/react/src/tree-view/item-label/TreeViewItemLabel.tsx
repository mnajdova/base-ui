'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { useTreeViewItemContext } from '../item/TreeViewItemContext';
import { useTreeViewRootContext } from '../root/TreeViewRootContext';
import { itemStateAttributesMapping } from '../item/stateAttributesMapping';

/**
 * The text label for a tree item.
 * Clicking this label triggers selection (when selectionMode is not 'none').
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI TreeView](https://base-ui.com/react/components/tree-view)
 */
export const TreeViewItemLabel = React.forwardRef(function TreeViewItemLabel(
  componentProps: TreeViewItemLabel.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, ...elementProps } = componentProps;

  const { disabled, value, state } = useTreeViewItemContext();
  const { handleSelection, selectionMode } = useTreeViewRootContext();

  const handleClick = React.useCallback(
    (_event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || selectionMode === 'none') {
        return;
      }

      handleSelection(value);
    },
    [disabled, handleSelection, selectionMode, value],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: [
      {
        onClick: handleClick,
      },
      elementProps,
    ],
    stateAttributesMapping: itemStateAttributesMapping,
  });

  return element;
});

export interface TreeViewItemLabelProps extends BaseUIComponentProps<
  'div',
  TreeViewItemLabel.State
> {}

export namespace TreeViewItemLabel {
  export type Props = TreeViewItemLabelProps;
  export type State = import('../item/TreeViewItem').TreeViewItem.State;
}
