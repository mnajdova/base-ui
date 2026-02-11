'use client';
import * as React from 'react';
import { TreeView } from '@base-ui/react/tree-view';
import styles from './index.module.css';

export default function ExampleTreeView() {
  const [selected, setSelected] = React.useState<string | null>('work');

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Project Files (Single Selection)</h3>
      <TreeView.Root
        defaultExpanded={['src', 'components']}
        selected={selected}
        onSelectedChange={(value) => setSelected(value as string | null)}
        selectionMode="single"
        aria-label="Project file navigator"
        className={styles.root}
      >
        <TreeView.Item value="src">
          <TreeView.ItemContent className={styles.content}>
            <TreeView.ItemIndicator className={styles.indicator}>
              <ChevronRightIcon />
            </TreeView.ItemIndicator>
            <FolderIcon className={styles.folderIcon} />
            <TreeView.ItemLabel className={styles.labelBold}>src</TreeView.ItemLabel>
          </TreeView.ItemContent>
          <TreeView.ItemGroup className={styles.group}>
            <TreeView.Item value="components">
              <TreeView.ItemContent className={styles.content}>
                <TreeView.ItemIndicator className={styles.indicator}>
                  <ChevronRightIcon />
                </TreeView.ItemIndicator>
                <FolderIcon className={styles.folderIcon} />
                <TreeView.ItemLabel className={styles.labelBold}>components</TreeView.ItemLabel>
              </TreeView.ItemContent>
              <TreeView.ItemGroup className={styles.group}>
                <TreeView.Item value="header">
                  <TreeView.ItemContent className={styles.content}>
                    <span className={styles.spacer} />
                    <FileIcon className={styles.fileIcon} />
                    <TreeView.ItemLabel className={styles.label}>Header.tsx</TreeView.ItemLabel>
                  </TreeView.ItemContent>
                </TreeView.Item>
                <TreeView.Item value="footer">
                  <TreeView.ItemContent className={styles.content}>
                    <span className={styles.spacer} />
                    <FileIcon className={styles.fileIcon} />
                    <TreeView.ItemLabel className={styles.label}>Footer.tsx</TreeView.ItemLabel>
                  </TreeView.ItemContent>
                </TreeView.Item>
              </TreeView.ItemGroup>
            </TreeView.Item>
            <TreeView.Item value="utils">
              <TreeView.ItemContent className={styles.content}>
                <TreeView.ItemIndicator className={styles.indicator}>
                  <ChevronRightIcon />
                </TreeView.ItemIndicator>
                <FolderIcon className={styles.folderIcon} />
                <TreeView.ItemLabel className={styles.labelBold}>utils</TreeView.ItemLabel>
              </TreeView.ItemContent>
              <TreeView.ItemGroup className={styles.group}>
                <TreeView.Item value="format">
                  <TreeView.ItemContent className={styles.content}>
                    <span className={styles.spacer} />
                    <FileIcon className={styles.fileIcon} />
                    <TreeView.ItemLabel className={styles.label}>format.ts</TreeView.ItemLabel>
                  </TreeView.ItemContent>
                </TreeView.Item>
              </TreeView.ItemGroup>
            </TreeView.Item>
            <TreeView.Item value="app">
              <TreeView.ItemContent className={styles.content}>
                <span className={styles.spacer} />
                <FileIcon className={styles.fileIcon} />
                <TreeView.ItemLabel className={styles.label}>App.tsx</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
          </TreeView.ItemGroup>
        </TreeView.Item>

        <TreeView.Item value="public">
          <TreeView.ItemContent className={styles.content}>
            <TreeView.ItemIndicator className={styles.indicator}>
              <ChevronRightIcon />
            </TreeView.ItemIndicator>
            <FolderIcon className={styles.folderIcon} />
            <TreeView.ItemLabel className={styles.labelBold}>public</TreeView.ItemLabel>
          </TreeView.ItemContent>
          <TreeView.ItemGroup className={styles.group}>
            <TreeView.Item value="logo">
              <TreeView.ItemContent className={styles.content}>
                <span className={styles.spacer} />
                <FileIcon className={styles.fileIcon} />
                <TreeView.ItemLabel className={styles.label}>logo.svg</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
          </TreeView.ItemGroup>
        </TreeView.Item>

        <TreeView.Item value="work">
          <TreeView.ItemContent className={styles.content}>
            <span className={styles.spacer} />
            <FileIcon className={styles.fileIcon} />
            <TreeView.ItemLabel className={styles.label}>package.json</TreeView.ItemLabel>
          </TreeView.ItemContent>
        </TreeView.Item>
      </TreeView.Root>
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
