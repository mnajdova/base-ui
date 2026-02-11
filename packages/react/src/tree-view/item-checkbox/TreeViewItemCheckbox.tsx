'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { useTreeViewItemContext } from '../item/TreeViewItemContext';
import { useTreeViewRootContext } from '../root/TreeViewRootContext';
import { checkboxStateAttributesMapping } from './stateAttributesMapping';

/**
 * A checkbox for selecting a tree item.
 * Clicking this checkbox triggers selection.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI TreeView](https://base-ui.com/react/components/tree-view)
 */
export const TreeViewItemCheckbox = React.forwardRef(function TreeViewItemCheckbox(
  componentProps: TreeViewItemCheckbox.Props,
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

  const ariaChecked = state.indeterminate ? 'mixed' : state.selected;

  const element = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: [
      {
        onClick: handleClick,
        role: 'checkbox',
        'aria-checked': ariaChecked,
        'aria-disabled': disabled || undefined,
      },
      elementProps,
    ],
    stateAttributesMapping: checkboxStateAttributesMapping,
  });

  return element;
});

export interface TreeViewItemCheckboxProps extends BaseUIComponentProps<
  'div',
  TreeViewItemCheckbox.State
> {}

export namespace TreeViewItemCheckbox {
  export type Props = TreeViewItemCheckboxProps;
  export type State = import('../item/TreeViewItem').TreeViewItem.State;
}
