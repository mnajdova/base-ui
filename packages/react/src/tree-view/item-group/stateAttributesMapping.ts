import type { StateAttributesMapping } from '../../utils/getStateAttributesProps';
import { transitionStatusMapping } from '../../utils/stateAttributesMapping';
import type { TreeViewItemGroup } from './TreeViewItemGroup';

export const groupStateAttributesMapping: StateAttributesMapping<TreeViewItemGroup.State> = {
  expanded: (value) => (value ? { 'data-expanded': '' } : null),
  level: (value) => ({ 'data-level': String(value) }),
  transitionStatus: transitionStatusMapping.transitionStatus,
};
