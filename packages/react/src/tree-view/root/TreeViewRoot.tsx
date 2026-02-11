'use client';
import * as React from 'react';
import { useControlled } from '@base-ui/utils/useControlled';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { BaseUIComponentProps } from '../../utils/types';
import { CompositeList } from '../../composite/list/CompositeList';
import { useDirection } from '../../direction-provider/DirectionContext';
import { TreeViewRootContext, type FlatTreeItem } from './TreeViewRootContext';
import { useRenderElement } from '../../utils/useRenderElement';
import {
  createChangeEventDetails,
  createGenericEventDetails,
  type BaseUIChangeEventDetails,
  type BaseUIGenericEventDetails,
} from '../../utils/createBaseUIEventDetails';
import { REASONS } from '../../utils/reasons';
import { rootStateAttributesMapping } from './stateAttributesMapping';

/**
 * Groups all parts of the tree view.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI TreeView](https://base-ui.com/react/components/tree-view)
 */
export const TreeViewRoot = React.forwardRef(function TreeViewRoot(
  componentProps: TreeViewRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    render,
    className,
    disabled = false,
    loopFocus = true,
    selectionMode = 'none',
    virtualized = false,
    expanded: expandedProp,
    defaultExpanded: defaultExpandedProp,
    onExpandedChange: onExpandedChangeProp,
    selected: selectedProp,
    defaultSelected: defaultSelectedProp,
    onSelectedChange: onSelectedChangeProp,
    onItemHighlighted: onItemHighlightedProp,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...elementProps
  } = componentProps;

  const direction = useDirection();

  // Expanded state
  const [expanded, setExpanded] = useControlled({
    controlled: expandedProp,
    default: defaultExpandedProp ?? [],
    name: 'TreeView',
    state: 'expanded',
  });

  // Expanded change handler
  const onExpandedChange = useStableCallback(onExpandedChangeProp);

  // Default selected to appropriate type based on selectionMode
  const getDefaultSelected = () => {
    if (defaultSelectedProp !== undefined) {
      return defaultSelectedProp;
    }
    return selectionMode === 'multiple' ? [] : null;
  };

  // Selected state
  const [selected, setSelected] = useControlled({
    controlled: selectedProp,
    default: getDefaultSelected(),
    name: 'TreeView',
    state: 'selected',
  });

  const onSelectedChange = useStableCallback(onSelectedChangeProp);
  const onItemHighlighted = useStableCallback(onItemHighlightedProp);

  // Refs
  const itemRefs = React.useRef<(HTMLElement | null)[]>([]);
  const flatItemsRef = React.useRef<FlatTreeItem[]>([]);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  // Handlers
  const handleExpandedChange = useStableCallback((value: string, nextExpanded: boolean) => {
    const details = createChangeEventDetails(REASONS.none);

    const nextExpandedArray = nextExpanded
      ? [...expanded, value]
      : expanded.filter((v) => v !== value);

    onExpandedChange?.(nextExpandedArray, details);

    if (details.isCanceled) {
      return;
    }

    setExpanded(nextExpandedArray);
  });

  // Helper function to get all descendant values of an item
  const getDescendants = useStableCallback((itemValue: string): string[] => {
    if (!rootRef.current) {
      return [];
    }

    const descendants: string[] = [];

    // Find the tree item element by its value
    const itemElement = rootRef.current.querySelector<HTMLElement>(
      `[role="treeitem"] [data-value="${CSS.escape(itemValue)}"]`,
    );

    if (!itemElement) {
      return descendants;
    }

    // Find the parent treeitem element
    const treeItem = itemElement.closest('[role="treeitem"]');
    if (!treeItem) {
      return descendants;
    }

    // Find the item group (children container)
    const group = treeItem.querySelector('[role="group"]');
    if (!group) {
      return descendants;
    }

    // Get all descendant treeitems (recursively)
    const descendantTreeItems = group.querySelectorAll('[role="treeitem"]');
    descendantTreeItems.forEach((descendantItem) => {
      const contentElement = descendantItem.querySelector<HTMLElement>('[data-value]');
      if (contentElement) {
        const value = contentElement.getAttribute('data-value');
        if (value) {
          descendants.push(value);
        }
      }
    });

    return descendants;
  });

  const handleSelection = useStableCallback((value: string) => {
    if (selectionMode === 'none') {
      return;
    }

    const details = createChangeEventDetails(REASONS.none);

    if (selectionMode === 'single') {
      const nextSelected = selected === value ? null : value;
      onSelectedChange?.(nextSelected, details);

      if (details.isCanceled) {
        return;
      }

      setSelected(nextSelected);
    } else if (selectionMode === 'multiple') {
      let selectedArray: string[];
      if (Array.isArray(selected)) {
        selectedArray = selected;
      } else if (selected) {
        selectedArray = [selected];
      } else {
        selectedArray = [];
      }

      // Check if the item has children
      const descendants = getDescendants(value);
      const hasChildren = descendants.length > 0;

      if (hasChildren) {
        // Parent item selection: handle hierarchical selection
        const allValues = [value, ...descendants];
        const selectedDescendants = descendants.filter((v) => selectedArray.includes(v));
        const isParentSelected = selectedArray.includes(value);
        const allSelected = isParentSelected && selectedDescendants.length === descendants.length;

        let nextSelected: string[];

        if (allSelected) {
          // All selected: deselect all (parent + descendants)
          nextSelected = selectedArray.filter((v) => !allValues.includes(v));
        } else {
          // None or some selected: select all (parent + descendants)
          const newSelections = allValues.filter((v) => !selectedArray.includes(v));
          nextSelected = [...selectedArray, ...newSelections];
        }

        onSelectedChange?.(nextSelected, details);

        if (details.isCanceled) {
          return;
        }

        setSelected(nextSelected);
      } else {
        // Leaf item: toggle selection
        const isSelected = selectedArray.includes(value);
        const nextSelected = isSelected
          ? selectedArray.filter((v) => v !== value)
          : [...selectedArray, value];

        onSelectedChange?.(nextSelected, details);

        if (details.isCanceled) {
          return;
        }

        setSelected(nextSelected);
      }
    }
  });

  const setActiveValue = useStableCallback(
    (value: string | null, reason: 'keyboard' | 'pointer' | 'none') => {
      const details = createGenericEventDetails(reason);
      onItemHighlighted?.(value ?? undefined, details);

      if (value && rootRef.current) {
        // Find the ItemContent element with the matching data-value attribute
        const targetElement = rootRef.current.querySelector<HTMLElement>(
          `[data-value="${CSS.escape(value)}"][tabindex]`,
        );

        if (targetElement) {
          targetElement.focus();
        }
      }
    },
  );

  // Build flat items array from the DOM whenever expansion changes
  React.useEffect(() => {
    if (!rootRef.current) {
      return;
    }

    const flatItems: FlatTreeItem[] = [];
    const treeItems = rootRef.current.querySelectorAll('[role="treeitem"]');

    treeItems.forEach((item) => {
      // Check if this item is visible (all parent items are expanded)
      let isVisible = true;
      let currentElement: Element | null = item.parentElement;

      while (currentElement && currentElement !== rootRef.current) {
        // Check if we're inside a collapsed group
        if (currentElement.getAttribute('role') === 'group') {
          // Find the parent treeitem
          const parentTreeItem = currentElement.parentElement?.closest('[role="treeitem"]');
          if (parentTreeItem) {
            const parentExpanded = parentTreeItem.getAttribute('aria-expanded');
            if (parentExpanded === 'false') {
              isVisible = false;
              break;
            }
          }
        }
        currentElement = currentElement.parentElement;
      }

      if (!isVisible) {
        return;
      }

      const content = item.querySelector<HTMLElement>('[data-value][tabindex]');
      if (content) {
        const value = content.getAttribute('data-value');
        const level = parseInt(item.getAttribute('aria-level') || '1', 10);
        const ariaExpanded = item.getAttribute('aria-expanded');
        const hasChildren = ariaExpanded !== null;
        const isExpanded = ariaExpanded === 'true';

        // Find parent by checking previous items at a lower level
        let parentValue: string | null = null;
        for (let i = flatItems.length - 1; i >= 0; i -= 1) {
          if (flatItems[i].level === level - 1) {
            parentValue = flatItems[i].value;
            break;
          }
        }

        if (value) {
          flatItems.push({
            value,
            level,
            hasChildren,
            isExpanded,
            parentValue,
            disabled: item.hasAttribute('aria-disabled'),
          });
        }
      }
    });

    flatItemsRef.current = flatItems;
  }, [expanded]);

  const state: TreeViewRoot.State = React.useMemo(
    () => ({
      expanded,
      selected,
      selectionMode,
      disabled,
      virtualized,
    }),
    [expanded, selected, selectionMode, disabled, virtualized],
  );

  const contextValue: TreeViewRootContext = React.useMemo(
    () => ({
      expanded,
      selected,
      selectionMode,
      disabled,
      loopFocus,
      virtualized,
      handleExpandedChange,
      handleSelection,
      setActiveValue,
      getDescendants,
      itemRefs,
      flatItemsRef,
      direction,
      state,
    }),
    [
      expanded,
      selected,
      selectionMode,
      disabled,
      loopFocus,
      virtualized,
      handleExpandedChange,
      handleSelection,
      setActiveValue,
      getDescendants,
      direction,
      state,
    ],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, rootRef],
    props: [
      {
        dir: direction,
        role: 'tree',
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
        'aria-multiselectable': selectionMode === 'multiple' ? 'true' : undefined,
      },
      elementProps,
    ],
    stateAttributesMapping: rootStateAttributesMapping,
  });

  const content = virtualized ? (
    element
  ) : (
    <CompositeList elementsRef={itemRefs}>{element}</CompositeList>
  );

  return (
    <TreeViewRootContext.Provider value={contextValue}>{content}</TreeViewRootContext.Provider>
  );
});

export type TreeViewValue = string[];
export type TreeViewSelected = string | string[] | null;

export interface TreeViewRootState {
  expanded: TreeViewValue;
  selected: TreeViewSelected;
  selectionMode: 'none' | 'single' | 'multiple';
  disabled: boolean;
  virtualized: boolean;
}

export type TreeViewRootChangeEventReason = typeof REASONS.none;
export type TreeViewRootChangeEventDetails =
  BaseUIChangeEventDetails<TreeViewRootChangeEventReason>;

export type TreeViewRootHighlightEventReason = 'keyboard' | 'pointer' | 'none';
export type TreeViewRootHighlightEventDetails =
  BaseUIGenericEventDetails<TreeViewRootHighlightEventReason>;

export interface TreeViewRootProps extends BaseUIComponentProps<'div', TreeViewRoot.State> {
  /**
   * The controlled value of the items that should be expanded.
   */
  expanded?: TreeViewValue | undefined;
  /**
   * The default value of the items that should be expanded (uncontrolled).
   */
  defaultExpanded?: TreeViewValue | undefined;
  /**
   * Callback invoked when an item's expansion state changes.
   */
  onExpandedChange?:
    | ((expanded: TreeViewValue, details: TreeViewRootChangeEventDetails) => void)
    | undefined;
  /**
   * The controlled selected value(s).
   * - For single selection: string | null
   * - For multiple selection: string[]
   */
  selected?: TreeViewSelected | undefined;
  /**
   * The default selected value(s) (uncontrolled).
   * - For single selection: string | null
   * - For multiple selection: string[]
   */
  defaultSelected?: TreeViewSelected | undefined;
  /**
   * Callback invoked when selection changes.
   */
  onSelectedChange?:
    | ((selected: TreeViewSelected, details: TreeViewRootChangeEventDetails) => void)
    | undefined;
  /**
   * The selection mode.
   * @default 'none'
   */
  selectionMode?: 'none' | 'single' | 'multiple' | undefined;
  /**
   * Whether the tree is disabled.
   * @default false
   */
  disabled?: boolean | undefined;
  /**
   * Whether focus should loop from last to first item and vice versa.
   * @default true
   */
  loopFocus?: boolean | undefined;
  /**
   * Whether the tree is virtualized.
   * When true, you should use explicit index props on items.
   * @default false
   */
  virtualized?: boolean | undefined;
  /**
   * Callback invoked when an item is highlighted (for virtualization scroll management).
   */
  onItemHighlighted?:
    | ((value: string | undefined, details: TreeViewRootHighlightEventDetails) => void)
    | undefined;
  /**
   * The accessible label for the tree.
   */
  'aria-label'?: string | undefined;
  /**
   * The id of the element that labels the tree.
   */
  'aria-labelledby'?: string | undefined;
}

export namespace TreeViewRoot {
  export interface State extends TreeViewRootState {}
  export interface Props extends TreeViewRootProps {}
  export type ChangeEventReason = TreeViewRootChangeEventReason;
  export type ChangeEventDetails = TreeViewRootChangeEventDetails;
  export type HighlightEventReason = TreeViewRootHighlightEventReason;
  export type HighlightEventDetails = TreeViewRootHighlightEventDetails;
}
