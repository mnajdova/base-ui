import { expect } from 'vitest';
import { screen } from '@mui/internal-test-utils';
import { TreeView } from '@base-ui/react/tree-view';
import { createRenderer, describeConformance } from '#test-utils';

describe('<TreeView.Item />', () => {
  const { render } = createRenderer();

  describeConformance(<TreeView.Item value="test" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render: (node) => {
      return render(<TreeView.Root>{node}</TreeView.Root>);
    },
  }));

  describe('ARIA attributes', () => {
    it('renders with role="treeitem"', async () => {
      await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [item] = screen.getAllByRole('treeitem');
      expect(item).to.have.attribute('role', 'treeitem');
    });

    it('sets aria-level to 1 for top-level items', async () => {
      await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [item] = screen.getAllByRole('treeitem');
      expect(item).to.have.attribute('aria-level', '1');
      expect(item).to.have.attribute('data-level', '1');
    });

    it('sets aria-level to 2 for nested items', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" defaultExpanded={['parent']}>
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator />
              <TreeView.ItemLabel>Parent</TreeView.ItemLabel>
            </TreeView.ItemContent>
            <TreeView.ItemGroup>
              <TreeView.Item value="child">
                <TreeView.ItemContent>
                  <TreeView.ItemLabel>Child</TreeView.ItemLabel>
                </TreeView.ItemContent>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [parent, child] = screen.getAllByRole('treeitem');
      expect(parent).to.have.attribute('aria-level', '1');
      expect(child).to.have.attribute('aria-level', '2');
      expect(child).to.have.attribute('data-level', '2');
    });

    it('sets aria-expanded when item has children', async () => {
      await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator />
              <TreeView.ItemLabel>Parent</TreeView.ItemLabel>
            </TreeView.ItemContent>
            <TreeView.ItemGroup>
              <TreeView.Item value="child">
                <TreeView.ItemContent>
                  <TreeView.ItemLabel>Child</TreeView.ItemLabel>
                </TreeView.ItemContent>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [parent] = screen.getAllByRole('treeitem');
      expect(parent).to.have.attribute('aria-expanded', 'false');
    });

    it('does not set aria-expanded when item has no children', async () => {
      await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="leaf">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Leaf</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [leaf] = screen.getAllByRole('treeitem');
      expect(leaf).not.to.have.attribute('aria-expanded');
    });

    it('sets aria-selected when selectionMode is not none', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" selectionMode="single" defaultSelected="item1">
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [item] = screen.getAllByRole('treeitem');
      expect(item).to.have.attribute('aria-selected', 'true');
    });

    it('does not set aria-selected when selectionMode is none', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" selectionMode="none">
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [item] = screen.getAllByRole('treeitem');
      expect(item).not.to.have.attribute('aria-selected');
    });
  });

  describe('prop: disabled', () => {
    it('can disable individual item', async () => {
      await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="item1" disabled>
            <TreeView.ItemContent data-testid="content1">
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
          <TreeView.Item value="item2">
            <TreeView.ItemContent data-testid="content2">
              <TreeView.ItemLabel>Item 2</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [item1, item2] = screen.getAllByRole('treeitem');
      const content1 = screen.getByTestId('content1');
      const content2 = screen.getByTestId('content2');

      expect(item1).to.have.attribute('data-disabled');
      expect(item1).to.have.attribute('aria-disabled', 'true');
      expect(content1).to.have.attribute('data-disabled');

      expect(item2).not.to.have.attribute('data-disabled');
      expect(item2).not.to.have.attribute('aria-disabled');
      expect(content2).not.to.have.attribute('data-disabled');
    });

    it('inherits disabled from root', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" disabled>
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [item] = screen.getAllByRole('treeitem');
      expect(item).to.have.attribute('data-disabled');
      expect(item).to.have.attribute('aria-disabled', 'true');
    });
  });

  describe('data attributes', () => {
    it('sets data-expanded when item is expanded', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" defaultExpanded={['parent']}>
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator />
              <TreeView.ItemLabel>Parent</TreeView.ItemLabel>
            </TreeView.ItemContent>
            <TreeView.ItemGroup>
              <TreeView.Item value="child">
                <TreeView.ItemContent>
                  <TreeView.ItemLabel>Child</TreeView.ItemLabel>
                </TreeView.ItemContent>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [parent] = screen.getAllByRole('treeitem');
      expect(parent).to.have.attribute('data-expanded');
    });

    it('sets data-selected when item is selected', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" selectionMode="single" defaultSelected="item1">
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [item] = screen.getAllByRole('treeitem');
      expect(item).to.have.attribute('data-selected');
    });

    it('sets data-has-children when item has children', async () => {
      await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator />
              <TreeView.ItemLabel>Parent</TreeView.ItemLabel>
            </TreeView.ItemContent>
            <TreeView.ItemGroup>
              <TreeView.Item value="child">
                <TreeView.ItemContent>
                  <TreeView.ItemLabel>Child</TreeView.ItemLabel>
                </TreeView.ItemContent>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [parent] = screen.getAllByRole('treeitem');
      expect(parent).to.have.attribute('data-has-children');
    });
  });

  describe('nested structure', () => {
    it('supports deeply nested items', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" defaultExpanded={['level1', 'level2', 'level3']}>
          <TreeView.Item value="level1">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator />
              <TreeView.ItemLabel>Level 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
            <TreeView.ItemGroup>
              <TreeView.Item value="level2">
                <TreeView.ItemContent>
                  <TreeView.ItemIndicator />
                  <TreeView.ItemLabel>Level 2</TreeView.ItemLabel>
                </TreeView.ItemContent>
                <TreeView.ItemGroup>
                  <TreeView.Item value="level3">
                    <TreeView.ItemContent>
                      <TreeView.ItemIndicator />
                      <TreeView.ItemLabel>Level 3</TreeView.ItemLabel>
                    </TreeView.ItemContent>
                    <TreeView.ItemGroup>
                      <TreeView.Item value="level4">
                        <TreeView.ItemContent>
                          <TreeView.ItemLabel>Level 4</TreeView.ItemLabel>
                        </TreeView.ItemContent>
                      </TreeView.Item>
                    </TreeView.ItemGroup>
                  </TreeView.Item>
                </TreeView.ItemGroup>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [level1, level2, level3, level4] = screen.getAllByRole('treeitem');

      expect(level1).to.have.attribute('aria-level', '1');
      expect(level2).to.have.attribute('aria-level', '2');
      expect(level3).to.have.attribute('aria-level', '3');
      expect(level4).to.have.attribute('aria-level', '4');
    });
  });
});
