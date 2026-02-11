import { expect } from 'vitest';
import { screen } from '@mui/internal-test-utils';
import { TreeView } from '@base-ui/react/tree-view';
import { createRenderer, describeConformance, isJSDOM } from '#test-utils';

describe('<TreeView.ItemGroup />', () => {
  const { render } = createRenderer();

  describeConformance(<TreeView.ItemGroup />, () => ({
    refInstanceof: window.HTMLDivElement,
    render: (node) => {
      return render(
        <TreeView.Root defaultExpanded={['parent']}>
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator />
            </TreeView.ItemContent>
            {node}
          </TreeView.Item>
        </TreeView.Root>,
      );
    },
  }));

  describe('ARIA attributes', () => {
    it('renders with role="group"', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" defaultExpanded={['parent']}>
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator />
              <TreeView.ItemLabel>Parent</TreeView.ItemLabel>
            </TreeView.ItemContent>
            <TreeView.ItemGroup data-testid="group">
              <TreeView.Item value="child">
                <TreeView.ItemContent>
                  <TreeView.ItemLabel>Child</TreeView.ItemLabel>
                </TreeView.ItemContent>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const group = screen.getByTestId('group');
      expect(group).to.have.attribute('role', 'group');
    });
  });

  describe('expand/collapse behavior', () => {
    it.skipIf(isJSDOM)('shows children when expanded', async () => {
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

      expect(screen.queryByText('Child')).to.equal(null);

      const indicator = screen.getByTestId('indicator');
      await user.click(indicator);

      expect(screen.queryByText('Child')).not.to.equal(null);
      expect(screen.queryByText('Child')).toBeVisible();
    });

    it('hides children when collapsed', async () => {
      await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator />
              <TreeView.ItemLabel>Parent</TreeView.ItemLabel>
            </TreeView.ItemContent>
            <TreeView.ItemGroup data-testid="group">
              <TreeView.Item value="child">
                <TreeView.ItemContent>
                  <TreeView.ItemLabel>Child</TreeView.ItemLabel>
                </TreeView.ItemContent>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
        </TreeView.Root>,
      );

      expect(screen.queryByText('Child')).to.equal(null);
    });

    it('prop: keepMounted keeps children in DOM when collapsed', async () => {
      await render(
        <TreeView.Root aria-label="Test tree">
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator />
              <TreeView.ItemLabel>Parent</TreeView.ItemLabel>
            </TreeView.ItemContent>
            <TreeView.ItemGroup keepMounted>
              <TreeView.Item value="child">
                <TreeView.ItemContent>
                  <TreeView.ItemLabel>Child</TreeView.ItemLabel>
                </TreeView.ItemContent>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const [, child] = screen.getAllByRole('treeitem');
      expect(child).not.to.equal(null);
    });
  });

  describe('level tracking', () => {
    it('increases level for nested items', async () => {
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

  describe('data attributes', () => {
    it('sets data-expanded when parent is expanded', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" defaultExpanded={['parent']}>
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator />
              <TreeView.ItemLabel>Parent</TreeView.ItemLabel>
            </TreeView.ItemContent>
            <TreeView.ItemGroup data-testid="group">
              <TreeView.Item value="child">
                <TreeView.ItemContent>
                  <TreeView.ItemLabel>Child</TreeView.ItemLabel>
                </TreeView.ItemContent>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const group = screen.getByTestId('group');
      expect(group).to.have.attribute('data-expanded');
    });

    it('does not set data-expanded when parent is collapsed', async () => {
      const { user } = await render(
        <TreeView.Root aria-label="Test tree" defaultExpanded={['parent']}>
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator data-testid="indicator" />
              <TreeView.ItemLabel>Parent</TreeView.ItemLabel>
            </TreeView.ItemContent>
            <TreeView.ItemGroup keepMounted data-testid="group">
              <TreeView.Item value="child">
                <TreeView.ItemContent>
                  <TreeView.ItemLabel>Child</TreeView.ItemLabel>
                </TreeView.ItemContent>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
        </TreeView.Root>,
      );

      // First verify the group is expanded
      const group = screen.getByTestId('group');
      expect(group).to.have.attribute('data-expanded');

      // Then collapse the parent
      const indicator = screen.getByTestId('indicator');
      await user.click(indicator);

      // Group should still be in DOM (because of keepMounted) but not have data-expanded
      expect(screen.getByTestId('group')).not.to.have.attribute('data-expanded');
    });

    it('sets data-level attribute', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" defaultExpanded={['parent']}>
          <TreeView.Item value="parent">
            <TreeView.ItemContent>
              <TreeView.ItemIndicator />
              <TreeView.ItemLabel>Parent</TreeView.ItemLabel>
            </TreeView.ItemContent>
            <TreeView.ItemGroup data-testid="group">
              <TreeView.Item value="child">
                <TreeView.ItemContent>
                  <TreeView.ItemLabel>Child</TreeView.ItemLabel>
                </TreeView.ItemContent>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const group = screen.getByTestId('group');
      expect(group).to.have.attribute('data-level', '2');
    });
  });
});
