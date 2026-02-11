'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { useTreeViewItemContext } from '../item/TreeViewItemContext';
import { useTreeViewRootContext } from '../root/TreeViewRootContext';
import { itemStateAttributesMapping } from '../item/stateAttributesMapping';

/**
 * The expand/collapse arrow indicator for a tree item.
 * Clicking this indicator toggles expansion (only).
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI TreeView](https://base-ui.com/react/components/tree-view)
 */
export const TreeViewItemIndicator = React.forwardRef(function TreeViewItemIndicator(
  componentProps: TreeViewItemIndicator.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, keepMounted = false, ...elementProps } = componentProps;

  const { disabled, value, hasChildren, expanded, state } = useTreeViewItemContext();
  const { handleExpandedChange } = useTreeViewRootContext();

  const handleClick = React.useCallback(
    (_event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !hasChildren) {
        return;
      }

      handleExpandedChange(value, !expanded);
    },
    [disabled, expanded, handleExpandedChange, hasChildren, value],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: [
      {
        onClick: handleClick,
        'aria-hidden': !hasChildren,
      },
      elementProps,
    ],
    stateAttributesMapping: itemStateAttributesMapping,
  });

  if (!hasChildren && !keepMounted) {
    return null;
  }

  return element;
});

export interface TreeViewItemIndicatorProps extends BaseUIComponentProps<
  'div',
  TreeViewItemIndicator.State
> {
  /**
   * Whether to keep the indicator in the DOM when the item has no children.
   * @default false
   */
  keepMounted?: boolean | undefined;
}

export namespace TreeViewItemIndicator {
  export type Props = TreeViewItemIndicatorProps;
  export type State = import('../item/TreeViewItem').TreeViewItem.State;
}
