'use client';
import * as React from 'react';

export interface TreeViewItemGroupContext {
  /**
   * Track parent item's level
   */
  parentLevel: number;
}

export const TreeViewItemGroupContext = React.createContext<TreeViewItemGroupContext | undefined>(
  undefined,
);

export function useTreeViewItemGroupContext() {
  return React.useContext(TreeViewItemGroupContext);
}
