'use client';
import * as React from 'react';
import type { TreeViewRoot } from './TreeViewRoot';
import type { TextDirection } from '../../direction-provider';

export interface FlatTreeItem {
  value: string;
  level: number;
  hasChildren: boolean;
  isExpanded: boolean;
  parentValue: string | null;
  disabled: boolean;
}

export interface TreeViewRootContext {
  // State
  expanded: string[];
  selected: string | string[] | null;
  selectionMode: 'none' | 'single' | 'multiple';
  disabled: boolean;
  loopFocus: boolean;
  virtualized: boolean;

  // Handlers
  handleExpandedChange: (value: string, nextExpanded: boolean) => void;
  handleSelection: (value: string) => void;
  setActiveValue: (value: string | null, reason: 'keyboard' | 'pointer' | 'none') => void;
  getDescendants: (value: string) => string[];

  // Refs for tracking
  itemRefs: React.RefObject<(HTMLElement | null)[]>;
  flatItemsRef: React.RefObject<FlatTreeItem[]>;

  // Config
  direction: TextDirection;
  state: TreeViewRoot.State;
}

export const TreeViewRootContext = React.createContext<TreeViewRootContext | undefined>(undefined);

export function useTreeViewRootContext() {
  const context = React.useContext(TreeViewRootContext);
  if (context === undefined) {
    throw new Error(
      'Base UI: TreeViewRootContext is missing. ' +
        'TreeView parts must be placed within <TreeView.Root>. ' +
        'See https://base-ui.com/react/components/tree-view',
    );
  }
  return context;
}
