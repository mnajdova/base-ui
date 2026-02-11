'use client';
import { useTreeViewItemContext } from '../item/TreeViewItemContext';
import { useTreeViewRootContext } from '../root/TreeViewRootContext';

/**
 * Public hook for accessing tree item data and methods.
 * Useful for drag-and-drop integrations.
 *
 * @example
 * ```tsx
 * function DraggableTreeItem({ value, children }) {
 *   const item = TreeView.useTreeViewItem();
 *   // Use item.value, item.level, item.expand(), etc.
 * }
 * ```
 */
export function useTreeViewItem() {
  const context = useTreeViewItemContext();
  const rootContext = useTreeViewRootContext();

  return {
    value: context.value,
    level: context.level,
    isExpanded: context.expanded,
    isSelected: context.selected,
    hasChildren: context.hasChildren,
    isDisabled: context.disabled,
    expand: () => rootContext.handleExpandedChange(context.value, true),
    collapse: () => rootContext.handleExpandedChange(context.value, false),
  };
}
