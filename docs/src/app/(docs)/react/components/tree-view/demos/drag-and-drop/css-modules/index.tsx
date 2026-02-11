'use client';
import * as React from 'react';
import { TreeView } from '@base-ui/react/tree-view';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import styles from './index.module.css';

interface TreeNode {
  value: string;
  label: string;
  children: TreeNode[];
}

export default function ExampleTreeView() {
  const [treeData, setTreeData] = React.useState<TreeNode[]>([
    {
      value: 'project',
      label: 'Project',
      children: [
        {
          value: 'src',
          label: 'src',
          children: [
            { value: 'index.ts', label: 'index.ts', children: [] },
            { value: 'App.tsx', label: 'App.tsx', children: [] },
          ],
        },
        {
          value: 'docs',
          label: 'docs',
          children: [{ value: 'README.md', label: 'README.md', children: [] }],
        },
      ],
    },
  ]);

  const [expanded, setExpanded] = React.useState<string[]>(['project', 'src', 'docs']);

  const handleDrop = React.useCallback((sourceValue: string, targetValue: string) => {
    setTreeData((prev) => {
      // Create a deep copy
      const newData = JSON.parse(JSON.stringify(prev)) as TreeNode[];

      // Find and remove source node
      let sourceNode: TreeNode | null = null;
      function findAndRemove(nodes: TreeNode[], parent?: TreeNode[]): boolean {
        for (let i = 0; i < nodes.length; i += 1) {
          if (nodes[i].value === sourceValue) {
            sourceNode = nodes[i];
            nodes.splice(i, 1);
            return true;
          }
          if (findAndRemove(nodes[i].children, nodes)) {
            return true;
          }
        }
        return false;
      }

      findAndRemove(newData);
      if (!sourceNode) return prev;

      // Find target node and add as child
      function findAndAdd(nodes: TreeNode[]): boolean {
        for (const node of nodes) {
          if (node.value === targetValue) {
            node.children.push(sourceNode!);
            return true;
          }
          if (findAndAdd(node.children)) {
            return true;
          }
        }
        return false;
      }

      if (!findAndAdd(newData)) {
        return prev;
      }

      return newData;
    });
  }, []);

  function renderTree(nodes: TreeNode[], level = 1): React.ReactNode {
    return nodes.map((node) => (
      <DraggableTreeItem key={node.value} node={node} level={level} onDrop={handleDrop}>
        {node.children.length > 0 && (
          <TreeView.ItemGroup className={styles.group}>
            {renderTree(node.children, level + 1)}
          </TreeView.ItemGroup>
        )}
      </DraggableTreeItem>
    ));
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Drag and Drop Files</h3>
      <TreeView.Root
        expanded={expanded}
        onExpandedChange={setExpanded}
        aria-label="Drag and drop tree"
        className={styles.root}
      >
        {renderTree(treeData)}
      </TreeView.Root>
      <div className={styles.hint}>Try dragging files into folders</div>
    </div>
  );
}

interface DraggableTreeItemProps {
  node: TreeNode;
  level: number;
  onDrop: (sourceValue: string, targetValue: string) => void;
  children?: React.ReactNode;
}

function DraggableTreeItem({ node, children, onDrop }: DraggableTreeItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isOver, setIsOver] = React.useState(false);
  const hasChildren = node.children.length > 0;

  React.useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    return combine(
      draggable({
        element,
        getInitialData: () => ({ value: node.value }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          // Can't drop on itself
          return source.data.value !== node.value;
        },
        onDragEnter: () => setIsOver(true),
        onDragLeave: () => setIsOver(false),
        onDrop: ({ source }) => {
          setIsOver(false);
          const sourceValue = source.data.value as string;
          if (sourceValue && sourceValue !== node.value && hasChildren) {
            onDrop(sourceValue, node.value);
          }
        },
      }),
    );
  }, [node.value, hasChildren, onDrop]);

  return (
    <TreeView.Item ref={ref} value={node.value}>
      <TreeView.ItemContent
        ref={contentRef}
        className={`${styles.content} ${isDragging ? styles.dragging : ''} ${isOver && hasChildren ? styles.over : ''}`}
      >
        {hasChildren ? (
          <>
            <TreeView.ItemIndicator className={styles.indicator}>
              <ChevronRightIcon />
            </TreeView.ItemIndicator>
            <FolderIcon className={styles.folderIcon} />
          </>
        ) : (
          <>
            <span className={styles.spacer} />
            <FileIcon className={styles.fileIcon} />
          </>
        )}
        <TreeView.ItemLabel className={styles.label}>{node.label}</TreeView.ItemLabel>
      </TreeView.ItemContent>
      {children}
    </TreeView.Item>
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

function FolderIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path d="M3.5 2A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 12.5 4H8.621a1 1 0 0 1-.707-.293L6.5 2.293A1 1 0 0 0 5.793 2H3.5Z" />
    </svg>
  );
}

function FileIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm1 5.75A.75.75 0 0 1 5.75 7h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 5 7.75Zm0 2.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
