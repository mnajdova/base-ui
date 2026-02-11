import { expect, vi } from 'vitest';
import { screen } from '@mui/internal-test-utils';
import { TreeView } from '@base-ui/react/tree-view';
import { createRenderer, describeConformance } from '#test-utils';

describe('<TreeView.ItemCheckbox />', () => {
  const { render } = createRenderer();

  describeConformance(
    <TreeView.Root selectionMode="multiple">
      <TreeView.Item value="test">
        <TreeView.ItemContent>
          <TreeView.ItemCheckbox />
        </TreeView.ItemContent>
      </TreeView.Item>
    </TreeView.Root>,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render: (node) => {
        return render(node);
      },
    }),
  );

  describe('ARIA attributes', () => {
    it('renders with role="checkbox"', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" selectionMode="multiple">
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemCheckbox data-testid="checkbox" />
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).to.have.attribute('role', 'checkbox');
    });

    it('sets aria-checked="false" when not selected', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" selectionMode="multiple">
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemCheckbox data-testid="checkbox" />
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).to.have.attribute('aria-checked', 'false');
    });

    it('sets aria-checked="true" when selected', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" selectionMode="multiple" defaultSelected={['item1']}>
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemCheckbox data-testid="checkbox" />
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).to.have.attribute('aria-checked', 'true');
    });

    it('sets aria-disabled when item is disabled', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" selectionMode="multiple">
          <TreeView.Item value="item1" disabled>
            <TreeView.ItemContent>
              <TreeView.ItemCheckbox data-testid="checkbox" />
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).to.have.attribute('aria-disabled', 'true');
    });
  });

  describe('selection behavior', () => {
    it('toggles selection when clicked', async () => {
      const handleSelectedChange = vi.fn();

      const { user } = await render(
        <TreeView.Root
          aria-label="Test tree"
          selectionMode="multiple"
          onSelectedChange={handleSelectedChange}
        >
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemCheckbox data-testid="checkbox" />
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const checkbox = screen.getByTestId('checkbox');
      const [item] = screen.getAllByRole('treeitem');

      expect(checkbox).to.have.attribute('aria-checked', 'false');
      expect(item).to.have.attribute('aria-selected', 'false');

      await user.click(checkbox);

      expect(handleSelectedChange).toHaveBeenCalledTimes(1);
      expect(handleSelectedChange).toHaveBeenCalledWith(['item1'], expect.anything());
      expect(checkbox).to.have.attribute('aria-checked', 'true');
      expect(item).to.have.attribute('aria-selected', 'true');

      await user.click(checkbox);

      expect(handleSelectedChange).toHaveBeenCalledTimes(2);
      expect(handleSelectedChange).toHaveBeenLastCalledWith([], expect.anything());
      expect(checkbox).to.have.attribute('aria-checked', 'false');
      expect(item).to.have.attribute('aria-selected', 'false');
    });

    it('works with multiple selection', async () => {
      const { user } = await render(
        <TreeView.Root aria-label="Test tree" selectionMode="multiple">
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemCheckbox data-testid="checkbox1" />
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
          <TreeView.Item value="item2">
            <TreeView.ItemContent>
              <TreeView.ItemCheckbox data-testid="checkbox2" />
              <TreeView.ItemLabel>Item 2</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const checkbox1 = screen.getByTestId('checkbox1');
      const checkbox2 = screen.getByTestId('checkbox2');
      const [item1, item2] = screen.getAllByRole('treeitem');

      await user.click(checkbox1);

      expect(checkbox1).to.have.attribute('aria-checked', 'true');
      expect(item1).to.have.attribute('aria-selected', 'true');
      expect(checkbox2).to.have.attribute('aria-checked', 'false');
      expect(item2).to.have.attribute('aria-selected', 'false');

      await user.click(checkbox2);

      expect(checkbox1).to.have.attribute('aria-checked', 'true');
      expect(item1).to.have.attribute('aria-selected', 'true');
      expect(checkbox2).to.have.attribute('aria-checked', 'true');
      expect(item2).to.have.attribute('aria-selected', 'true');
    });

    it('does not trigger expansion when clicked', async () => {
      const handleExpandedChange = vi.fn();

      const { user } = await render(
        <TreeView.Root
          aria-label="Test tree"
          selectionMode="multiple"
          onExpandedChange={handleExpandedChange}
        >
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator />
              <TreeView.ItemCheckbox data-testid="checkbox" />
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

      const checkbox = screen.getByTestId('checkbox');
      const [parent] = screen.getAllByRole('treeitem');

      expect(parent).to.have.attribute('aria-expanded', 'false');

      await user.click(checkbox);

      expect(handleExpandedChange).toHaveBeenCalledTimes(0);
      expect(parent).to.have.attribute('aria-expanded', 'false');
    });
  });

  describe('data attributes', () => {
    it('sets data-checked when selected', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" selectionMode="multiple" defaultSelected={['item1']}>
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemCheckbox data-testid="checkbox" />
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).to.have.attribute('data-checked');
    });

    it('sets data-unchecked when not selected', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" selectionMode="multiple">
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemCheckbox data-testid="checkbox" />
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const checkbox = screen.getByTestId('checkbox');
      expect(checkbox).to.have.attribute('data-unchecked');
    });
  });
});
