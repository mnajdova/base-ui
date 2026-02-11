import type { StateAttributesMapping } from '../../utils/getStateAttributesProps';
import type { TreeViewItemCheckbox } from './TreeViewItemCheckbox';

export const checkboxStateAttributesMapping: StateAttributesMapping<TreeViewItemCheckbox.State> = {
  value: () => null,
  level: (value) => ({ 'data-level': String(value) }),
  expanded: () => null,
  selected(value): Record<string, string> | null {
    if (value) {
      return { 'data-checked': '' };
    }
    return { 'data-unchecked': '' };
  },
  indeterminate: (value) => (value ? { 'data-indeterminate': '' } : null),
  disabled: (value) => (value ? { 'data-disabled': '' } : null),
  hasChildren: () => null,
};
