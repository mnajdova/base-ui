'use client';
import * as React from 'react';
import { TreeView } from '@base-ui/react/tree-view';
import { useVirtualizer } from '@tanstack/react-virtual';
import styles from './index.module.css';

// Generate a large tree structure
function generateTreeData(depth: number, breadth: number, prefix = ''): TreeNode[] {
  if (depth === 0) return [];

  return Array.from({ length: breadth }, (_, i) => ({
    value: `${prefix}node-${i}`,
    label: `${prefix}Node ${i}`,
    children: generateTreeData(depth - 1, breadth, `${prefix}${i}-`),
  }));
}

interface TreeNode {
  value: string;
  label: string;
  children: TreeNode[];
}

export default function ExampleTreeView() {
  // Generate tree with 3 levels and 10 nodes per level = ~1000 nodes
  const treeData = React.useMemo(() => generateTreeData(3, 10), []);

  // Start with first few parent nodes expanded to demonstrate virtualization
  const [expanded, setExpanded] = React.useState<string[]>(() => {
    const initialExpanded: string[] = [];
    // Expand first 3 parent nodes
    for (let i = 0; i < 3; i++) {
      initialExpanded.push(`node-${i}`);
      // Also expand some of their children
      for (let j = 0; j < 2; j++) {
        initialExpanded.push(`${i}-node-${j}`);
      }
    }
    return initialExpanded;
  });
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const treeRootRef = React.useRef<HTMLDivElement>(null);

  // Flatten visible nodes for virtualization
  const flattenedItems = React.useMemo(() => {
    const result: Array<{ node: TreeNode; level: number }> = [];

    function flatten(nodes: TreeNode[], level = 1) {
      nodes.forEach((node) => {
        result.push({ node, level });
        if (expanded.includes(node.value) && node.children.length > 0) {
          flatten(node.children, level + 1);
        }
      });
    }

    flatten(treeData);
    return result;
  }, [treeData, expanded]);

  const virtualizer = useVirtualizer({
    count: flattenedItems.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 36,
    overscan: 10,
  });

  const handleExpandedChange = React.useCallback((newExpanded: string[]) => {
    setExpanded(newExpanded);
  }, []);

  // Handle custom keyboard navigation for virtualized items
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!treeRootRef.current) return;

      // Find currently focused item
      const activeElement = document.activeElement;
      const currentValue = activeElement?.getAttribute('data-value');
      if (!currentValue) return;

      const currentIndex = flattenedItems.findIndex((item) => item.node.value === currentValue);
      if (currentIndex === -1) return;

      const currentItem = flattenedItems[currentIndex];
      let handled = false;

      switch (event.key) {
        case 'ArrowDown':
          if (currentIndex < flattenedItems.length - 1) {
            event.preventDefault();
            const nextValue = flattenedItems[currentIndex + 1].node.value;
            const nextElement = treeRootRef.current.querySelector<HTMLElement>(
              `[data-value="${CSS.escape(nextValue)}"][tabindex]`,
            );
            nextElement?.focus();
            handled = true;
          }
          break;

        case 'ArrowUp':
          if (currentIndex > 0) {
            event.preventDefault();
            const prevValue = flattenedItems[currentIndex - 1].node.value;
            const prevElement = treeRootRef.current.querySelector<HTMLElement>(
              `[data-value="${CSS.escape(prevValue)}"][tabindex]`,
            );
            prevElement?.focus();
            handled = true;
          }
          break;

        case 'Home':
          if (flattenedItems.length > 0) {
            event.preventDefault();
            const firstValue = flattenedItems[0].node.value;
            const firstElement = treeRootRef.current.querySelector<HTMLElement>(
              `[data-value="${CSS.escape(firstValue)}"][tabindex]`,
            );
            firstElement?.focus();
            handled = true;
          }
          break;

        case 'End':
          if (flattenedItems.length > 0) {
            event.preventDefault();
            const lastValue = flattenedItems[flattenedItems.length - 1].node.value;
            const lastElement = treeRootRef.current.querySelector<HTMLElement>(
              `[data-value="${CSS.escape(lastValue)}"][tabindex]`,
            );
            lastElement?.focus();
            handled = true;
          }
          break;

        default:
          break;
      }

      // For handled keys, stop propagation to prevent TreeView's built-in navigation
      if (handled) {
        event.stopPropagation();
      }
    },
    [flattenedItems],
  );

  // Scroll to focused item
  React.useEffect(() => {
    if (!scrollRef.current || !treeRootRef.current) return;

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      const itemValue = target.getAttribute('data-value');
      if (!itemValue) return;

      const index = flattenedItems.findIndex((item) => item.node.value === itemValue);
      if (index !== -1) {
        virtualizer.scrollToIndex(index, { align: 'auto' });
      }
    };

    const treeRoot = treeRootRef.current;
    treeRoot.addEventListener('focusin', handleFocusIn);
    return () => {
      treeRoot.removeEventListener('focusin', handleFocusIn);
    };
  }, [flattenedItems, virtualizer]);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Large Tree (Virtualized)</h3>
      <div className={styles.scrollContainer} ref={scrollRef} onKeyDown={handleKeyDown}>
        <TreeView.Root
          ref={treeRootRef}
          expanded={expanded}
          onExpandedChange={handleExpandedChange}
          aria-label="Virtualized tree"
          className={styles.root}
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const { node, level } = flattenedItems[virtualItem.index];
            const hasChildren = node.children.length > 0;

            return (
              <TreeView.Item
                key={node.value}
                value={node.value}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <TreeView.ItemContent
                  className={styles.content}
                  style={{ paddingLeft: `${(level - 1) * 1.25 + 0.5}rem` }}
                >
                  {hasChildren ? (
                    <TreeView.ItemIndicator className={styles.indicator}>
                      <ChevronRightIcon />
                    </TreeView.ItemIndicator>
                  ) : (
                    <span className={styles.spacer} />
                  )}
                  <TreeView.ItemLabel className={styles.label}>{node.label}</TreeView.ItemLabel>
                </TreeView.ItemContent>
              </TreeView.Item>
            );
          })}
        </TreeView.Root>
      </div>
      <div className={styles.info}>
        {flattenedItems.length} visible items out of ~1000 total nodes
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
