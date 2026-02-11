import type { StateAttributesMapping } from '../../utils/getStateAttributesProps';
import type { TreeViewItem } from './TreeViewItem';

export const itemStateAttributesMapping: StateAttributesMapping<TreeViewItem.State> = {
  value: () => null,
  level: (value) => ({ 'data-level': String(value) }),
  expanded: (value) => (value ? { 'data-expanded': '' } : null),
  selected: (value) => (value ? { 'data-selected': '' } : null),
  indeterminate: (value) => (value ? { 'data-indeterminate': '' } : null),
  disabled: (value) => (value ? { 'data-disabled': '' } : null),
  hasChildren: (value) => (value ? { 'data-has-children': '' } : null),
};
