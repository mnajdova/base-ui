'use client';
import * as React from 'react';
import { TreeView } from '@base-ui/react/tree-view';

export default function ExampleTreeView() {
  const [selected, setSelected] = React.useState<string[]>(['react', 'vue']);

  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Technologies (Multiple Selection)</h3>
      <TreeView.Root
        defaultExpanded={['frameworks', 'backend']}
        selected={selected}
        onSelectedChange={(value) => setSelected(value as string[])}
        selectionMode="multiple"
        aria-label="Technology stack selector"
        className="w-80 rounded-lg border border-gray-200 bg-white p-3 text-sm"
      >
        <TreeView.Item value="frameworks">
          <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
            <TreeView.ItemIndicator className="flex items-center justify-center w-4 h-4 text-gray-600 transition-transform data-[expanded]:rotate-90">
              <ChevronRightIcon />
            </TreeView.ItemIndicator>
            <FolderIcon className="w-4 h-4 text-blue-500" />
            <TreeView.ItemLabel className="font-medium text-gray-900">
              Frontend Frameworks
            </TreeView.ItemLabel>
          </TreeView.ItemContent>
          <TreeView.ItemGroup className="pl-5 data-[ending-style]:hidden">
            <TreeView.Item value="react">
              <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <span className="w-4" />
                <TreeView.ItemCheckbox className="flex items-center justify-center w-4 h-4 border-[1.5px] border-gray-400 rounded bg-white cursor-pointer data-[checked]:bg-blue-600 data-[checked]:border-blue-600 data-[checked]:before:content-[''] data-[checked]:before:w-2 data-[checked]:before:h-2 data-[checked]:before:bg-[url('data:image/svg+xml,%3csvg_viewBox=%270_0_16_16%27_fill=%27white%27_xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath_d=%27M12.207_4.793a1_1_0_010_1.414l-5_5a1_1_0_01-1.414_0l-2-2a1_1_0_011.414-1.414L6.5_9.086l4.293-4.293a1_1_0_011.414_0z%27/%3e%3c/svg%3e')] data-[checked]:before:bg-[length:100%_100%] data-[checked]:before:bg-center data-[checked]:before:bg-no-repeat" />
                <TreeView.ItemLabel className="text-gray-900">React</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
            <TreeView.Item value="vue">
              <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <span className="w-4" />
                <TreeView.ItemCheckbox className="flex items-center justify-center w-4 h-4 border-[1.5px] border-gray-400 rounded bg-white cursor-pointer data-[checked]:bg-blue-600 data-[checked]:border-blue-600 data-[checked]:before:content-[''] data-[checked]:before:w-2 data-[checked]:before:h-2 data-[checked]:before:bg-[url('data:image/svg+xml,%3csvg_viewBox=%270_0_16_16%27_fill=%27white%27_xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath_d=%27M12.207_4.793a1_1_0_010_1.414l-5_5a1_1_0_01-1.414_0l-2-2a1_1_0_011.414-1.414L6.5_9.086l4.293-4.293a1_1_0_011.414_0z%27/%3e%3c/svg%3e')] data-[checked]:before:bg-[length:100%_100%] data-[checked]:before:bg-center data-[checked]:before:bg-no-repeat" />
                <TreeView.ItemLabel className="text-gray-900">Vue</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
            <TreeView.Item value="angular">
              <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <span className="w-4" />
                <TreeView.ItemCheckbox className="flex items-center justify-center w-4 h-4 border-[1.5px] border-gray-400 rounded bg-white cursor-pointer data-[checked]:bg-blue-600 data-[checked]:border-blue-600 data-[checked]:before:content-[''] data-[checked]:before:w-2 data-[checked]:before:h-2 data-[checked]:before:bg-[url('data:image/svg+xml,%3csvg_viewBox=%270_0_16_16%27_fill=%27white%27_xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath_d=%27M12.207_4.793a1_1_0_010_1.414l-5_5a1_1_0_01-1.414_0l-2-2a1_1_0_011.414-1.414L6.5_9.086l4.293-4.293a1_1_0_011.414_0z%27/%3e%3c/svg%3e')] data-[checked]:before:bg-[length:100%_100%] data-[checked]:before:bg-center data-[checked]:before:bg-no-repeat" />
                <TreeView.ItemLabel className="text-gray-900">Angular</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
            <TreeView.Item value="svelte">
              <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <span className="w-4" />
                <TreeView.ItemCheckbox className="flex items-center justify-center w-4 h-4 border-[1.5px] border-gray-400 rounded bg-white cursor-pointer data-[checked]:bg-blue-600 data-[checked]:border-blue-600 data-[checked]:before:content-[''] data-[checked]:before:w-2 data-[checked]:before:h-2 data-[checked]:before:bg-[url('data:image/svg+xml,%3csvg_viewBox=%270_0_16_16%27_fill=%27white%27_xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath_d=%27M12.207_4.793a1_1_0_010_1.414l-5_5a1_1_0_01-1.414_0l-2-2a1_1_0_011.414-1.414L6.5_9.086l4.293-4.293a1_1_0_011.414_0z%27/%3e%3c/svg%3e')] data-[checked]:before:bg-[length:100%_100%] data-[checked]:before:bg-center data-[checked]:before:bg-no-repeat" />
                <TreeView.ItemLabel className="text-gray-900">Svelte</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
          </TreeView.ItemGroup>
        </TreeView.Item>

        <TreeView.Item value="backend">
          <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
            <TreeView.ItemIndicator className="flex items-center justify-center w-4 h-4 text-gray-600 transition-transform data-[expanded]:rotate-90">
              <ChevronRightIcon />
            </TreeView.ItemIndicator>
            <FolderIcon className="w-4 h-4 text-blue-500" />
            <TreeView.ItemLabel className="font-medium text-gray-900">Backend</TreeView.ItemLabel>
          </TreeView.ItemContent>
          <TreeView.ItemGroup className="pl-5 data-[ending-style]:hidden">
            <TreeView.Item value="nodejs">
              <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <span className="w-4" />
                <TreeView.ItemCheckbox className="flex items-center justify-center w-4 h-4 border-[1.5px] border-gray-400 rounded bg-white cursor-pointer data-[checked]:bg-blue-600 data-[checked]:border-blue-600 data-[checked]:before:content-[''] data-[checked]:before:w-2 data-[checked]:before:h-2 data-[checked]:before:bg-[url('data:image/svg+xml,%3csvg_viewBox=%270_0_16_16%27_fill=%27white%27_xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath_d=%27M12.207_4.793a1_1_0_010_1.414l-5_5a1_1_0_01-1.414_0l-2-2a1_1_0_011.414-1.414L6.5_9.086l4.293-4.293a1_1_0_011.414_0z%27/%3e%3c/svg%3e')] data-[checked]:before:bg-[length:100%_100%] data-[checked]:before:bg-center data-[checked]:before:bg-no-repeat" />
                <TreeView.ItemLabel className="text-gray-900">Node.js</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
            <TreeView.Item value="python">
              <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <span className="w-4" />
                <TreeView.ItemCheckbox className="flex items-center justify-center w-4 h-4 border-[1.5px] border-gray-400 rounded bg-white cursor-pointer data-[checked]:bg-blue-600 data-[checked]:border-blue-600 data-[checked]:before:content-[''] data-[checked]:before:w-2 data-[checked]:before:h-2 data-[checked]:before:bg-[url('data:image/svg+xml,%3csvg_viewBox=%270_0_16_16%27_fill=%27white%27_xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath_d=%27M12.207_4.793a1_1_0_010_1.414l-5_5a1_1_0_01-1.414_0l-2-2a1_1_0_011.414-1.414L6.5_9.086l4.293-4.293a1_1_0_011.414_0z%27/%3e%3c/svg%3e')] data-[checked]:before:bg-[length:100%_100%] data-[checked]:before:bg-center data-[checked]:before:bg-no-repeat" />
                <TreeView.ItemLabel className="text-gray-900">Python</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
            <TreeView.Item value="java">
              <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <span className="w-4" />
                <TreeView.ItemCheckbox className="flex items-center justify-center w-4 h-4 border-[1.5px] border-gray-400 rounded bg-white cursor-pointer data-[checked]:bg-blue-600 data-[checked]:border-blue-600 data-[checked]:before:content-[''] data-[checked]:before:w-2 data-[checked]:before:h-2 data-[checked]:before:bg-[url('data:image/svg+xml,%3csvg_viewBox=%270_0_16_16%27_fill=%27white%27_xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath_d=%27M12.207_4.793a1_1_0_010_1.414l-5_5a1_1_0_01-1.414_0l-2-2a1_1_0_011.414-1.414L6.5_9.086l4.293-4.293a1_1_0_011.414_0z%27/%3e%3c/svg%3e')] data-[checked]:before:bg-[length:100%_100%] data-[checked]:before:bg-center data-[checked]:before:bg-no-repeat" />
                <TreeView.ItemLabel className="text-gray-900">Java</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
          </TreeView.ItemGroup>
        </TreeView.Item>

        <TreeView.Item value="database">
          <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
            <TreeView.ItemIndicator className="flex items-center justify-center w-4 h-4 text-gray-600 transition-transform data-[expanded]:rotate-90">
              <ChevronRightIcon />
            </TreeView.ItemIndicator>
            <FolderIcon className="w-4 h-4 text-blue-500" />
            <TreeView.ItemLabel className="font-medium text-gray-900">Databases</TreeView.ItemLabel>
          </TreeView.ItemContent>
          <TreeView.ItemGroup className="pl-5 data-[ending-style]:hidden">
            <TreeView.Item value="postgresql">
              <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <span className="w-4" />
                <TreeView.ItemCheckbox className="flex items-center justify-center w-4 h-4 border-[1.5px] border-gray-400 rounded bg-white cursor-pointer data-[checked]:bg-blue-600 data-[checked]:border-blue-600 data-[checked]:before:content-[''] data-[checked]:before:w-2 data-[checked]:before:h-2 data-[checked]:before:bg-[url('data:image/svg+xml,%3csvg_viewBox=%270_0_16_16%27_fill=%27white%27_xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath_d=%27M12.207_4.793a1_1_0_010_1.414l-5_5a1_1_0_01-1.414_0l-2-2a1_1_0_011.414-1.414L6.5_9.086l4.293-4.293a1_1_0_011.414_0z%27/%3e%3c/svg%3e')] data-[checked]:before:bg-[length:100%_100%] data-[checked]:before:bg-center data-[checked]:before:bg-no-repeat" />
                <TreeView.ItemLabel className="text-gray-900">PostgreSQL</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
            <TreeView.Item value="mongodb">
              <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <span className="w-4" />
                <TreeView.ItemCheckbox className="flex items-center justify-center w-4 h-4 border-[1.5px] border-gray-400 rounded bg-white cursor-pointer data-[checked]:bg-blue-600 data-[checked]:border-blue-600 data-[checked]:before:content-[''] data-[checked]:before:w-2 data-[checked]:before:h-2 data-[checked]:before:bg-[url('data:image/svg+xml,%3csvg_viewBox=%270_0_16_16%27_fill=%27white%27_xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath_d=%27M12.207_4.793a1_1_0_010_1.414l-5_5a1_1_0_01-1.414_0l-2-2a1_1_0_011.414-1.414L6.5_9.086l4.293-4.293a1_1_0_011.414_0z%27/%3e%3c/svg%3e')] data-[checked]:before:bg-[length:100%_100%] data-[checked]:before:bg-center data-[checked]:before:bg-no-repeat" />
                <TreeView.ItemLabel className="text-gray-900">MongoDB</TreeView.ItemLabel>
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="size-4"
    >
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
