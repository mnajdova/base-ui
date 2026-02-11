import type { StateAttributesMapping } from '../../utils/getStateAttributesProps';
import type { TreeViewRoot } from './TreeViewRoot';

export const rootStateAttributesMapping: StateAttributesMapping<TreeViewRoot.State> = {
  disabled: (value) => (value ? { 'data-disabled': '' } : null),
  expanded: () => null,
  selected: () => null,
  selectionMode: () => null,
  virtualized: () => null,
};
