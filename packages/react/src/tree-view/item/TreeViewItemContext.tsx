'use client';
import * as React from 'react';
import type { TreeViewItem } from './TreeViewItem';

export interface TreeViewItemContext {
  value: string;
  level: number;
  expanded: boolean;
  selected: boolean;
  indeterminate: boolean;
  disabled: boolean;
  hasChildren: boolean;
  contentId: string;
  state: TreeViewItem.State;

  // Internal
  setHasChildren: (hasChildren: boolean) => void;
}

export const TreeViewItemContext = React.createContext<TreeViewItemContext | undefined>(undefined);

export function useTreeViewItemContext() {
  const context = React.useContext(TreeViewItemContext);
  if (context === undefined) {
    throw new Error(
      'Base UI: TreeViewItemContext is missing. ' +
        'TreeView.ItemContent, TreeView.ItemLabel, TreeView.ItemIndicator, and TreeView.ItemCheckbox ' +
        'must be placed within <TreeView.Item>. ' +
        'See https://base-ui.com/react/components/tree-view',
    );
  }
  return context;
}
