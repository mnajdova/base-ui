import { expect, vi } from 'vitest';
import { screen } from '@mui/internal-test-utils';
import { TreeView } from '@base-ui/react/tree-view';
import { createRenderer, describeConformance } from '#test-utils';

describe('<TreeView.ItemLabel />', () => {
  const { render } = createRenderer();

  describeConformance(<TreeView.ItemLabel />, () => ({
    refInstanceof: window.HTMLDivElement,
    render: (node) => {
      return render(
        <TreeView.Root>
          <TreeView.Item value="test">
            <TreeView.ItemContent>{node}</TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );
    },
  }));

  describe('selection behavior', () => {
    it('triggers selection when clicked (single mode)', async () => {
      const handleSelectedChange = vi.fn();

      const { user } = await render(
        <TreeView.Root
          aria-label="Test tree"
          selectionMode="single"
          onSelectedChange={handleSelectedChange}
        >
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const label = screen.getByText('Item 1');
      const [item] = screen.getAllByRole('treeitem');

      expect(item).to.have.attribute('aria-selected', 'false');

      await user.click(label);

      expect(handleSelectedChange).toHaveBeenCalledTimes(1);
      expect(handleSelectedChange).toHaveBeenCalledWith('item1', expect.anything());
      expect(item).to.have.attribute('aria-selected', 'true');
    });

    it('triggers selection when clicked (multiple mode)', async () => {
      const handleSelectedChange = vi.fn();

      const { user } = await render(
        <TreeView.Root
          aria-label="Test tree"
          selectionMode="multiple"
          onSelectedChange={handleSelectedChange}
        >
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
          <TreeView.Item value="item2">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 2</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const label1 = screen.getByText('Item 1');
      const label2 = screen.getByText('Item 2');
      const [item1, item2] = screen.getAllByRole('treeitem');

      await user.click(label1);

      expect(handleSelectedChange).toHaveBeenCalledTimes(1);
      expect(handleSelectedChange).toHaveBeenCalledWith(['item1'], expect.anything());
      expect(item1).to.have.attribute('aria-selected', 'true');
      expect(item2).to.have.attribute('aria-selected', 'false');

      await user.click(label2);

      expect(handleSelectedChange).toHaveBeenCalledTimes(2);
      expect(handleSelectedChange).toHaveBeenLastCalledWith(['item1', 'item2'], expect.anything());
      expect(item1).to.have.attribute('aria-selected', 'true');
      expect(item2).to.have.attribute('aria-selected', 'true');
    });

    it('does not trigger selection when selectionMode is none', async () => {
      const handleSelectedChange = vi.fn();

      const { user } = await render(
        <TreeView.Root
          aria-label="Test tree"
          selectionMode="none"
          onSelectedChange={handleSelectedChange}
        >
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const label = screen.getByText('Item 1');
      const [item] = screen.getAllByRole('treeitem');

      await user.click(label);

      expect(handleSelectedChange).toHaveBeenCalledTimes(0);
      expect(item).not.to.have.attribute('aria-selected');
    });

    it('does not trigger expansion when clicked', async () => {
      const handleExpandedChange = vi.fn();

      const { user } = await render(
        <TreeView.Root aria-label="Test tree" onExpandedChange={handleExpandedChange}>
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

      const label = screen.getByText('Parent');
      const [parent] = screen.getAllByRole('treeitem');

      expect(parent).to.have.attribute('aria-expanded', 'false');

      await user.click(label);

      expect(handleExpandedChange).toHaveBeenCalledTimes(0);
      expect(parent).to.have.attribute('aria-expanded', 'false');
    });
  });

  describe('data attributes', () => {
    it('sets data-selected when item is selected', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" selectionMode="single" defaultSelected="item1">
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemLabel data-testid="label">Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const label = screen.getByTestId('label');
      expect(label).to.have.attribute('data-selected');
    });
  });
});
