'use client';
import * as React from 'react';
import { useMergedRefs } from '@base-ui/utils/useMergedRefs';
import { useBaseUiId } from '../../utils/useBaseUiId';
import { BaseUIComponentProps } from '../../utils/types';
import { useCompositeListItem } from '../../composite/list/useCompositeListItem';
import { useTreeViewRootContext } from '../root/TreeViewRootContext';
import { useTreeViewItemGroupContext } from '../item-group/TreeViewItemGroupContext';
import { TreeViewItemContext } from './TreeViewItemContext';
import { itemStateAttributesMapping } from './stateAttributesMapping';
import { useRenderElement } from '../../utils/useRenderElement';

/**
 * An individual tree node.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI TreeView](https://base-ui.com/react/components/tree-view)
 */
export const TreeViewItem = React.forwardRef(function TreeViewItem(
  componentProps: TreeViewItem.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    disabled: disabledProp = false,
    render,
    value: valueProp,
    index: indexProp,
    ...elementProps
  } = componentProps;

  const {
    disabled: contextDisabled,
    expanded: expandedArray,
    selected: selectedValue,
    selectionMode,
    virtualized,
    getDescendants,
  } = useTreeViewRootContext();

  // Get level from parent ItemGroup context, or default to 1 (root level)
  const groupContext = useTreeViewItemGroupContext();
  const level = groupContext ? groupContext.parentLevel + 1 : 1;

  const { ref: listItemRef } = useCompositeListItem({
    index: indexProp,
  });
  const mergedRef = useMergedRefs(forwardedRef, virtualized ? null : listItemRef);

  // Value is required
  if (!valueProp) {
    throw new Error(
      'Base UI: TreeView.Item requires a "value" prop. ' +
        'The value is used to identify the item for expansion and selection. ' +
        'Provide a unique string identifier. ' +
        'See https://base-ui.com/react/components/tree-view#api-reference',
    );
  }

  const value = valueProp;
  const disabled = disabledProp || contextDisabled;

  const isExpanded = expandedArray.includes(value);

  const isSelected = React.useMemo(() => {
    if (selectionMode === 'none') {
      return false;
    }

    if (selectionMode === 'single') {
      return selectedValue === value;
    }

    // multiple
    let selectedArray: string[];
    if (Array.isArray(selectedValue)) {
      selectedArray = selectedValue;
    } else if (selectedValue) {
      selectedArray = [selectedValue];
    } else {
      selectedArray = [];
    }
    return selectedArray.includes(value);
  }, [selectionMode, selectedValue, value]);

  const [hasChildren, setHasChildren] = React.useState(false);

  // Calculate indeterminate state for checkboxes
  const isIndeterminate = React.useMemo(() => {
    if (selectionMode !== 'multiple' || !hasChildren) {
      return false;
    }

    let selectedArray: string[];
    if (Array.isArray(selectedValue)) {
      selectedArray = selectedValue;
    } else if (selectedValue) {
      selectedArray = [selectedValue];
    } else {
      selectedArray = [];
    }

    const descendants = getDescendants(value);
    if (descendants.length === 0) {
      return false;
    }

    const selectedDescendants = descendants.filter((v) => selectedArray.includes(v));
    const allDescendantsSelected = selectedDescendants.length === descendants.length;
    const someDescendantsSelected = selectedDescendants.length > 0;

    // Indeterminate when some but not all descendants are selected
    return someDescendantsSelected && !allDescendantsSelected;
  }, [selectionMode, selectedValue, value, hasChildren, getDescendants]);

  const contentId = useBaseUiId() ?? '';

  const state: TreeViewItem.State = React.useMemo(
    () => ({
      value,
      level,
      expanded: isExpanded,
      selected: isSelected,
      indeterminate: isIndeterminate,
      disabled,
      hasChildren,
    }),
    [value, level, isExpanded, isSelected, isIndeterminate, disabled, hasChildren],
  );

  const itemContext: TreeViewItemContext = React.useMemo(
    () => ({
      value,
      level,
      expanded: isExpanded,
      selected: isSelected,
      indeterminate: isIndeterminate,
      disabled,
      hasChildren,
      contentId,
      state,
      setHasChildren,
    }),
    [
      value,
      level,
      isExpanded,
      isSelected,
      isIndeterminate,
      disabled,
      hasChildren,
      contentId,
      state,
    ],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: mergedRef,
    props: [
      {
        role: 'treeitem',
        'aria-level': level,
        'aria-expanded': hasChildren ? isExpanded : undefined,
        'aria-selected': selectionMode !== 'none' ? isSelected : undefined,
        'aria-disabled': disabled ? 'true' : undefined,
      },
      elementProps,
    ],
    stateAttributesMapping: itemStateAttributesMapping,
  });

  return <TreeViewItemContext.Provider value={itemContext}>{element}</TreeViewItemContext.Provider>;
});

export interface TreeViewItemState {
  value: string;
  level: number;
  expanded: boolean;
  selected: boolean;
  indeterminate: boolean;
  disabled: boolean;
  hasChildren: boolean;
}

export interface TreeViewItemProps extends BaseUIComponentProps<'div', TreeViewItem.State> {
  /**
   * A unique value that identifies this tree item.
   * This is required and used for expansion and selection.
   */
  value: string;
  /**
   * Whether this item should ignore user interaction.
   * @default false
   */
  disabled?: boolean | undefined;
  /**
   * The index of the item in the list.
   * Used for virtualization to improve performance.
   */
  index?: number | undefined;
}

export namespace TreeViewItem {
  export type State = TreeViewItemState;
  export type Props = TreeViewItemProps;
}
