import { expect, vi } from 'vitest';
import { screen } from '@mui/internal-test-utils';
import { TreeView } from '@base-ui/react/tree-view';
import { createRenderer, describeConformance } from '#test-utils';

describe('<TreeView.ItemIndicator />', () => {
  const { render } = createRenderer();

  describeConformance(<TreeView.ItemIndicator />, () => ({
    refInstanceof: window.HTMLDivElement,
    render: (node) => {
      return render(
        <TreeView.Root>
          <TreeView.Item value="test">
            <TreeView.ItemContent>{node}</TreeView.ItemContent>
            <TreeView.ItemGroup>
              <TreeView.Item value="child">
                <TreeView.ItemContent>Child</TreeView.ItemContent>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
        </TreeView.Root>,
      );
    },
  }));

  describe('behavior', () => {
    it('toggles expansion when clicked', async () => {
      const { user } = await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator data-testid="indicator" />
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
      const indicator = screen.getByTestId('indicator');

      expect(parent).to.have.attribute('aria-expanded', 'false');

      await user.click(indicator);

      expect(parent).to.have.attribute('aria-expanded', 'true');

      await user.click(indicator);

      expect(parent).to.have.attribute('aria-expanded', 'false');
    });

    it('calls onExpandedChange callback', async () => {
      const handleExpandedChange = vi.fn();

      const { user } = await render(
        <TreeView.Root aria-label="Test tree" onExpandedChange={handleExpandedChange}>
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator data-testid="indicator" />
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

      const indicator = screen.getByTestId('indicator');

      await user.click(indicator);

      expect(handleExpandedChange).toHaveBeenCalledTimes(1);
      expect(handleExpandedChange).toHaveBeenCalledWith(['parent'], expect.anything());
    });

    it('does not trigger selection when clicked', async () => {
      const handleSelectedChange = vi.fn();

      const { user } = await render(
        <TreeView.Root
          aria-label="Test tree"
          selectionMode="single"
          onSelectedChange={handleSelectedChange}
        >
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator data-testid="indicator" />
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

      const indicator = screen.getByTestId('indicator');
      const [parent] = screen.getAllByRole('treeitem');

      await user.click(indicator);

      expect(handleSelectedChange).toHaveBeenCalledTimes(0);
      expect(parent).to.have.attribute('aria-selected', 'false');
    });
  });

  describe('visibility', () => {
    it('is visible when item has children', async () => {
      await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator data-testid="indicator" />
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

      const indicator = screen.getByTestId('indicator');
      expect(indicator).toBeVisible();
    });

    it('is hidden when item has no children', async () => {
      await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="leaf">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator data-testid="indicator" />
              <TreeView.ItemLabel>Leaf</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      expect(screen.queryByTestId('indicator')).to.equal(null);
    });

    it('prop: keepMounted keeps indicator in DOM when no children', async () => {
      await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="leaf">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator keepMounted data-testid="indicator" />
              <TreeView.ItemLabel>Leaf</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const indicator = screen.getByTestId('indicator');
      expect(indicator).not.to.equal(null);
      expect(indicator).to.have.attribute('aria-hidden', 'true');
    });
  });

  describe('data attributes', () => {
    it('sets data-expanded when item is expanded', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" defaultExpanded={['parent']}>
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator data-testid="indicator" />
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

      const indicator = screen.getByTestId('indicator');
      expect(indicator).to.have.attribute('data-expanded');
    });

    it('does not set data-expanded when item is collapsed', async () => {
      await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator data-testid="indicator" />
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

      const indicator = screen.getByTestId('indicator');
      expect(indicator).not.to.have.attribute('data-expanded');
    });
  });
});
