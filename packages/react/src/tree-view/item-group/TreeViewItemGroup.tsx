'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { BaseUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { useTransitionStatus } from '../../utils/useTransitionStatus';
import { useTreeViewItemContext } from '../item/TreeViewItemContext';
import { TreeViewItemGroupContext } from './TreeViewItemGroupContext';
import { groupStateAttributesMapping } from './stateAttributesMapping';

/**
 * A container for nested tree items.
 * Renders a `<div>` element with role="group".
 *
 * Documentation: [Base UI TreeView](https://base-ui.com/react/components/tree-view)
 */
export const TreeViewItemGroup = React.forwardRef(function TreeViewItemGroup(
  componentProps: TreeViewItemGroup.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    keepMounted = false,
    hiddenUntilFound = false,
    ...elementProps
  } = componentProps;

  const { level, expanded, setHasChildren } = useTreeViewItemContext();

  const { mounted, transitionStatus } = useTransitionStatus(expanded, keepMounted);

  // Notify parent Item that it has children
  useIsoLayoutEffect(() => {
    setHasChildren(true);
    return () => {
      setHasChildren(false);
    };
  }, [setHasChildren]);

  const state: TreeViewItemGroup.State = React.useMemo(
    () => ({
      expanded,
      level: level + 1,
      transitionStatus,
    }),
    [expanded, level, transitionStatus],
  );

  const groupContext: TreeViewItemGroupContext = React.useMemo(
    () => ({
      parentLevel: level,
    }),
    [level],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: [
      {
        role: 'group',
        hidden:
          hiddenUntilFound && !expanded && keepMounted ? 'until-found' : !expanded && keepMounted,
      } as React.HTMLAttributes<HTMLDivElement>,
      elementProps,
    ],
    stateAttributesMapping: groupStateAttributesMapping,
  });

  if (!mounted) {
    return null;
  }

  return (
    <TreeViewItemGroupContext.Provider value={groupContext}>
      {element}
    </TreeViewItemGroupContext.Provider>
  );
});

export interface TreeViewItemGroupState {
  expanded: boolean;
  level: number;
  transitionStatus: import('../../utils/useTransitionStatus').TransitionStatus;
}

export interface TreeViewItemGroupProps extends BaseUIComponentProps<
  'div',
  TreeViewItemGroup.State
> {
  /**
   * Whether to keep the element in the DOM while the item is collapsed.
   * @default false
   */
  keepMounted?: boolean | undefined;
  /**
   * Allows the browser's built-in page search to find and expand collapsed items.
   *
   * Overrides the `keepMounted` prop and uses `hidden="until-found"`
   * to hide the element without removing it from the DOM.
   * @default false
   */
  hiddenUntilFound?: boolean | undefined;
}

export namespace TreeViewItemGroup {
  export type State = TreeViewItemGroupState;
  export type Props = TreeViewItemGroupProps;
}
