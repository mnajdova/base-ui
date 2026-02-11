'use client';
import { useTreeViewRootContext } from '../root/TreeViewRootContext';

/**
 * Hook to access the flattened list of visible tree items.
 * Used for virtualization with libraries like TanStack Virtual.
 *
 * @example
 * ```tsx
 * const flatItems = TreeView.useTreeViewFlatItems();
 * const virtualizer = useVirtualizer({
 *   count: flatItems.length,
 *   // ...
 * });
 * ```
 */
export function useTreeViewFlatItems() {
  const { flatItemsRef } = useTreeViewRootContext();
  return flatItemsRef.current;
}
