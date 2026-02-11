'use client';
import * as React from 'react';
import { TreeView } from '@base-ui/react/tree-view';

export default function ExampleTreeView() {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-medium text-gray-900 mb-2">File Explorer</h3>
      <TreeView.Root
        defaultExpanded={['documents']}
        aria-label="File system navigator"
        className="w-80 rounded-lg border border-gray-200 bg-white p-3 text-sm"
      >
        <TreeView.Item value="documents">
          <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
            <TreeView.ItemIndicator className="flex items-center justify-center w-4 h-4 text-gray-600 transition-transform data-[expanded]:rotate-90">
              <ChevronRightIcon />
            </TreeView.ItemIndicator>
            <FolderIcon className="w-4 h-4 text-blue-500" />
            <TreeView.ItemLabel className="font-medium text-gray-900">Documents</TreeView.ItemLabel>
          </TreeView.ItemContent>
          <TreeView.ItemGroup className="pl-5 data-[ending-style]:hidden">
            <TreeView.Item value="work">
              <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <TreeView.ItemIndicator className="flex items-center justify-center w-4 h-4 text-gray-600 transition-transform data-[expanded]:rotate-90">
                  <ChevronRightIcon />
                </TreeView.ItemIndicator>
                <FolderIcon className="w-4 h-4 text-blue-500" />
                <TreeView.ItemLabel className="font-medium text-gray-900">Work</TreeView.ItemLabel>
              </TreeView.ItemContent>
              <TreeView.ItemGroup className="pl-5 data-[ending-style]:hidden">
                <TreeView.Item value="report">
                  <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                    <span className="w-4" />
                    <FileIcon className="w-4 h-4 text-gray-500" />
                    <TreeView.ItemLabel className="text-gray-900">Report.pdf</TreeView.ItemLabel>
                  </TreeView.ItemContent>
                </TreeView.Item>
                <TreeView.Item value="presentation">
                  <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                    <span className="w-4" />
                    <FileIcon className="w-4 h-4 text-gray-500" />
                    <TreeView.ItemLabel className="text-gray-900">
                      Presentation.pptx
                    </TreeView.ItemLabel>
                  </TreeView.ItemContent>
                </TreeView.Item>
              </TreeView.ItemGroup>
            </TreeView.Item>
            <TreeView.Item value="personal">
              <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <TreeView.ItemIndicator className="flex items-center justify-center w-4 h-4 text-gray-600 transition-transform data-[expanded]:rotate-90">
                  <ChevronRightIcon />
                </TreeView.ItemIndicator>
                <FolderIcon className="w-4 h-4 text-blue-500" />
                <TreeView.ItemLabel className="font-medium text-gray-900">
                  Personal
                </TreeView.ItemLabel>
              </TreeView.ItemContent>
              <TreeView.ItemGroup className="pl-5 data-[ending-style]:hidden">
                <TreeView.Item value="resume">
                  <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                    <span className="w-4" />
                    <FileIcon className="w-4 h-4 text-gray-500" />
                    <TreeView.ItemLabel className="text-gray-900">Resume.docx</TreeView.ItemLabel>
                  </TreeView.ItemContent>
                </TreeView.Item>
              </TreeView.ItemGroup>
            </TreeView.Item>
          </TreeView.ItemGroup>
        </TreeView.Item>

        <TreeView.Item value="downloads">
          <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
            <TreeView.ItemIndicator className="flex items-center justify-center w-4 h-4 text-gray-600 transition-transform data-[expanded]:rotate-90">
              <ChevronRightIcon />
            </TreeView.ItemIndicator>
            <FolderIcon className="w-4 h-4 text-blue-500" />
            <TreeView.ItemLabel className="font-medium text-gray-900">Downloads</TreeView.ItemLabel>
          </TreeView.ItemContent>
          <TreeView.ItemGroup className="pl-5 data-[ending-style]:hidden">
            <TreeView.Item value="image">
              <TreeView.ItemContent className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
                <span className="w-4" />
                <FileIcon className="w-4 h-4 text-gray-500" />
                <TreeView.ItemLabel className="text-gray-900">Image.png</TreeView.ItemLabel>
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
