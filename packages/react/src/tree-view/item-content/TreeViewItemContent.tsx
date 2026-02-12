'use client';
import * as React from 'react';
import { BaseUIComponentProps, NativeButtonProps, BaseUIEvent } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { useButton } from '../../use-button';
import { useTreeViewItemContext } from '../item/TreeViewItemContext';
import { useTreeViewRootContext } from '../root/TreeViewRootContext';
import { itemStateAttributesMapping } from '../item/stateAttributesMapping';

/**
 * The clickable/focusable content area of a tree item.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI TreeView](https://base-ui.com/react/components/tree-view)
 */
export const TreeViewItemContent = React.forwardRef(function TreeViewItemContent(
  componentProps: TreeViewItemContent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, nativeButton = false, ...elementProps } = componentProps;

  const { disabled, contentId, state, value, expanded, hasChildren } = useTreeViewItemContext();
  const { handleExpandedChange, handleSelection, selectionMode, flatItemsRef, setActiveValue } =
    useTreeViewRootContext();

  const { getButtonProps, buttonRef } = useButton({
    disabled,
    focusableWhenDisabled: true,
    native: nativeButton,
  });

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }

      // Only handle clicks directly on this element, not on children (like Label)
      if (event.target !== event.currentTarget) {
        return;
      }

      if (selectionMode !== 'none') {
        handleSelection(value);
      }
    },
    [disabled, handleSelection, selectionMode, value],
  );

  const handleKeyDown = React.useCallback(
    (event: BaseUIEvent<React.KeyboardEvent<HTMLDivElement>>) => {
      if (disabled) {
        return;
      }

      const flatItems = flatItemsRef.current;

      switch (event.key) {
        case 'ArrowDown': {
          // Move focus to next visible node
          event.preventDefault();
          event.preventBaseUIHandler?.();
          const currentIndex = flatItems.findIndex((item) => item.value === value);
          if (currentIndex !== -1 && currentIndex < flatItems.length - 1) {
            setActiveValue(flatItems[currentIndex + 1].value, 'keyboard');
          }
          break;
        }

        case 'ArrowUp': {
          // Move focus to previous visible node
          event.preventDefault();
          event.preventBaseUIHandler?.();
          const currentIndex = flatItems.findIndex((item) => item.value === value);
          if (currentIndex > 0) {
            setActiveValue(flatItems[currentIndex - 1].value, 'keyboard');
          }
          break;
        }

        case 'Home': {
          // Move focus to first node
          event.preventDefault();
          event.preventBaseUIHandler?.();
          if (flatItems.length > 0) {
            setActiveValue(flatItems[0].value, 'keyboard');
          }
          break;
        }

        case 'End': {
          // Move focus to last visible node
          event.preventDefault();
          event.preventBaseUIHandler?.();
          if (flatItems.length > 0) {
            setActiveValue(flatItems[flatItems.length - 1].value, 'keyboard');
          }
          break;
        }

        case 'ArrowRight': {
          if (hasChildren) {
            if (!expanded) {
              // Expand collapsed node
              event.preventDefault();
              event.preventBaseUIHandler?.();
              handleExpandedChange(value, true);
            } else {
              // Move to first child
              const currentIndex = flatItems.findIndex((item) => item.value === value);
              if (currentIndex !== -1 && flatItems[currentIndex + 1]?.parentValue === value) {
                event.preventDefault();
                event.preventBaseUIHandler?.();
                setActiveValue(flatItems[currentIndex + 1].value, 'keyboard');
              }
            }
          }
          break;
        }

        case 'ArrowLeft': {
          if (expanded && hasChildren) {
            // Collapse open node
            event.preventDefault();
            event.preventBaseUIHandler?.();
            handleExpandedChange(value, false);
          } else {
            // Move to parent
            const currentItem = flatItems.find((item) => item.value === value);
            if (currentItem?.parentValue) {
              event.preventDefault();
              event.preventBaseUIHandler?.();
              setActiveValue(currentItem.parentValue, 'keyboard');
            }
          }
          break;
        }

        case '*': {
          // Expand all siblings at same level
          event.preventDefault();
          event.preventBaseUIHandler?.();
          const currentItem = flatItems.find((item) => item.value === value);
          if (currentItem) {
            const siblings = flatItems.filter(
              (item) => item.level === currentItem.level && item.hasChildren && !item.isExpanded,
            );
            siblings.forEach((sibling) => {
              handleExpandedChange(sibling.value, true);
            });
          }
          break;
        }

        default:
          break;
      }
    },
    [
      disabled,
      expanded,
      flatItemsRef,
      handleExpandedChange,
      hasChildren,
      setActiveValue,
      value,
    ],
  );

  const element = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, buttonRef],
    props: [
      {
        id: contentId,
        tabIndex: disabled ? -1 : 0,
        'data-value': value,
        onClick: handleClick,
      } as React.HTMLAttributes<HTMLDivElement>,
      elementProps,
      getButtonProps,
      {
        onKeyDown: handleKeyDown,
      },
    ],
    stateAttributesMapping: itemStateAttributesMapping,
  });

  return element;
});

export interface TreeViewItemContentProps
  extends NativeButtonProps, BaseUIComponentProps<'div', TreeViewItemContent.State> {}

export namespace TreeViewItemContent {
  export type Props = TreeViewItemContentProps;
  export type State = import('../item/TreeViewItem').TreeViewItem.State;
}
