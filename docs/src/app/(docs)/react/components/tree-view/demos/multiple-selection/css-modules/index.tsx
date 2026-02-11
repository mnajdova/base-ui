'use client';
import * as React from 'react';
import { TreeView } from '@base-ui/react/tree-view';
import styles from './index.module.css';

export default function ExampleTreeView() {
  const [selected, setSelected] = React.useState<string[]>(['react', 'vue']);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Technologies (Multiple Selection)</h3>
      <TreeView.Root
        defaultExpanded={['frameworks', 'backend']}
        selected={selected}
        onSelectedChange={(value) => setSelected(value as string[])}
        selectionMode="multiple"
        aria-label="Technology stack selector"
        className={styles.root}
      >
        <TreeView.Item value="frameworks">
          <TreeView.ItemContent className={styles.content}>
            <TreeView.ItemIndicator className={styles.indicator}>
              <ChevronRightIcon />
            </TreeView.ItemIndicator>
            <FolderIcon className={styles.folderIcon} />
            <TreeView.ItemLabel className={styles.labelBold}>
              Frontend Frameworks
            </TreeView.ItemLabel>
          </TreeView.ItemContent>
          <TreeView.ItemGroup className={styles.group}>
            <TreeView.Item value="react">
              <TreeView.ItemContent className={styles.content}>
                <span className={styles.spacer} />
                <TreeView.ItemCheckbox className={styles.checkbox} />
                <TreeView.ItemLabel className={styles.label}>React</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
            <TreeView.Item value="vue">
              <TreeView.ItemContent className={styles.content}>
                <span className={styles.spacer} />
                <TreeView.ItemCheckbox className={styles.checkbox} />
                <TreeView.ItemLabel className={styles.label}>Vue</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
            <TreeView.Item value="angular">
              <TreeView.ItemContent className={styles.content}>
                <span className={styles.spacer} />
                <TreeView.ItemCheckbox className={styles.checkbox} />
                <TreeView.ItemLabel className={styles.label}>Angular</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
            <TreeView.Item value="svelte">
              <TreeView.ItemContent className={styles.content}>
                <span className={styles.spacer} />
                <TreeView.ItemCheckbox className={styles.checkbox} />
                <TreeView.ItemLabel className={styles.label}>Svelte</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
          </TreeView.ItemGroup>
        </TreeView.Item>

        <TreeView.Item value="backend">
          <TreeView.ItemContent className={styles.content}>
            <TreeView.ItemIndicator className={styles.indicator}>
              <ChevronRightIcon />
            </TreeView.ItemIndicator>
            <FolderIcon className={styles.folderIcon} />
            <TreeView.ItemLabel className={styles.labelBold}>Backend</TreeView.ItemLabel>
          </TreeView.ItemContent>
          <TreeView.ItemGroup className={styles.group}>
            <TreeView.Item value="nodejs">
              <TreeView.ItemContent className={styles.content}>
                <span className={styles.spacer} />
                <TreeView.ItemCheckbox className={styles.checkbox} />
                <TreeView.ItemLabel className={styles.label}>Node.js</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
            <TreeView.Item value="python">
              <TreeView.ItemContent className={styles.content}>
                <span className={styles.spacer} />
                <TreeView.ItemCheckbox className={styles.checkbox} />
                <TreeView.ItemLabel className={styles.label}>Python</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
            <TreeView.Item value="java">
              <TreeView.ItemContent className={styles.content}>
                <span className={styles.spacer} />
                <TreeView.ItemCheckbox className={styles.checkbox} />
                <TreeView.ItemLabel className={styles.label}>Java</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
          </TreeView.ItemGroup>
        </TreeView.Item>

        <TreeView.Item value="database">
          <TreeView.ItemContent className={styles.content}>
            <TreeView.ItemIndicator className={styles.indicator}>
              <ChevronRightIcon />
            </TreeView.ItemIndicator>
            <FolderIcon className={styles.folderIcon} />
            <TreeView.ItemLabel className={styles.labelBold}>Databases</TreeView.ItemLabel>
          </TreeView.ItemContent>
          <TreeView.ItemGroup className={styles.group}>
            <TreeView.Item value="postgresql">
              <TreeView.ItemContent className={styles.content}>
                <span className={styles.spacer} />
                <TreeView.ItemCheckbox className={styles.checkbox} />
                <TreeView.ItemLabel className={styles.label}>PostgreSQL</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
            <TreeView.Item value="mongodb">
              <TreeView.ItemContent className={styles.content}>
                <span className={styles.spacer} />
                <TreeView.ItemCheckbox className={styles.checkbox} />
                <TreeView.ItemLabel className={styles.label}>MongoDB</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
          </TreeView.ItemGroup>
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
