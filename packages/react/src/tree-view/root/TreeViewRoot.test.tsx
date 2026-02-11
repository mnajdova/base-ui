import { expect, vi } from 'vitest';
import { screen } from '@mui/internal-test-utils';
import { TreeView } from '@base-ui/react/tree-view';
import { createRenderer, describeConformance, isJSDOM } from '#test-utils';

describe('<TreeView.Root />', () => {
  const { render } = createRenderer();

  describeConformance(<TreeView.Root />, () => ({
    refInstanceof: window.HTMLDivElement,
    render,
  }));

  describe('ARIA attributes', () => {
    it('renders with role="tree"', async () => {
      await render(<TreeView.Root aria-label="Test tree" />);

      const tree = screen.getByRole('tree');
      expect(tree).to.have.attribute('aria-label', 'Test tree');
    });

    it('supports aria-labelledby', async () => {
      await render(
        <div>
          <h3 id="tree-label">My Tree</h3>
          <TreeView.Root aria-labelledby="tree-label" />
        </div>,
      );

      const tree = screen.getByRole('tree');
      expect(tree).to.have.attribute('aria-labelledby', 'tree-label');
    });

    it('sets aria-multiselectable when selectionMode is multiple', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" selectionMode="multiple">
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const tree = screen.getByRole('tree');
      expect(tree).to.have.attribute('aria-multiselectable', 'true');
    });

    it('does not set aria-multiselectable when selectionMode is single', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" selectionMode="single">
          <TreeView.Item value="item1">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const tree = screen.getByRole('tree');
      expect(tree).not.to.have.attribute('aria-multiselectable');
    });
  });

  describe('uncontrolled expansion', () => {
    it('expands and collapses items', async () => {
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
      expect(screen.queryByText('Child')).to.equal(null);

      await user.click(indicator);

      expect(parent).to.have.attribute('aria-expanded', 'true');
      expect(screen.queryByText('Child')).not.to.equal(null);

      await user.click(indicator);

      expect(parent).to.have.attribute('aria-expanded', 'false');
    });

    it('prop: defaultExpanded', async () => {
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

      expect(parent).to.have.attribute('aria-expanded', 'true');
      expect(screen.queryByText('Child')).not.to.equal(null);
    });
  });

  describe('controlled expansion', () => {
    it('controlled expanded state', async () => {
      const { setProps } = await render(
        <TreeView.Root aria-label="Test tree" expanded={[]}>
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
      expect(screen.queryByText('Child')).to.equal(null);

      await setProps({ expanded: ['parent'] });

      expect(parent).to.have.attribute('aria-expanded', 'true');
      expect(screen.queryByText('Child')).not.to.equal(null);

      await setProps({ expanded: [] });

      expect(parent).to.have.attribute('aria-expanded', 'false');
    });

    it('prop: onExpandedChange', async () => {
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

      expect(handleExpandedChange).toHaveBeenCalledTimes(0);

      await user.click(indicator);

      expect(handleExpandedChange).toHaveBeenCalledTimes(1);
      expect(handleExpandedChange).toHaveBeenCalledWith(['parent'], expect.anything());

      await user.click(indicator);

      expect(handleExpandedChange).toHaveBeenCalledTimes(2);
      expect(handleExpandedChange).toHaveBeenLastCalledWith([], expect.anything());
    });
  });

  describe('selection', () => {
    describe('selectionMode: none', () => {
      it('does not allow selection', async () => {
        const { user } = await render(
          <TreeView.Root aria-label="Test tree" selectionMode="none">
            <TreeView.Item value="item1">
              <TreeView.ItemContent>
                <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
          </TreeView.Root>,
        );

        const [item] = screen.getAllByRole('treeitem');
        const label = screen.getByText('Item 1');

        expect(item).not.to.have.attribute('aria-selected');

        await user.click(label);

        expect(item).not.to.have.attribute('aria-selected');
      });
    });

    describe('selectionMode: single', () => {
      it('allows selecting one item at a time', async () => {
        const { user } = await render(
          <TreeView.Root aria-label="Test tree" selectionMode="single">
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

        const [item1, item2] = screen.getAllByRole('treeitem');
        const label1 = screen.getByText('Item 1');
        const label2 = screen.getByText('Item 2');

        expect(item1).to.have.attribute('aria-selected', 'false');
        expect(item2).to.have.attribute('aria-selected', 'false');

        await user.click(label1);

        expect(item1).to.have.attribute('aria-selected', 'true');
        expect(item1).to.have.attribute('data-selected');
        expect(item2).to.have.attribute('aria-selected', 'false');

        await user.click(label2);

        expect(item1).to.have.attribute('aria-selected', 'false');
        expect(item1).not.to.have.attribute('data-selected');
        expect(item2).to.have.attribute('aria-selected', 'true');
        expect(item2).to.have.attribute('data-selected');
      });

      it('prop: defaultSelected', async () => {
        await render(
          <TreeView.Root aria-label="Test tree" selectionMode="single" defaultSelected="item1">
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

        const [item1, item2] = screen.getAllByRole('treeitem');

        expect(item1).to.have.attribute('aria-selected', 'true');
        expect(item2).to.have.attribute('aria-selected', 'false');
      });

      it('prop: onSelectedChange', async () => {
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

        expect(handleSelectedChange).toHaveBeenCalledTimes(0);

        await user.click(label);

        expect(handleSelectedChange).toHaveBeenCalledTimes(1);
        expect(handleSelectedChange).toHaveBeenCalledWith('item1', expect.anything());
      });
    });

    describe('selectionMode: multiple', () => {
      it('allows selecting multiple items', async () => {
        const { user } = await render(
          <TreeView.Root aria-label="Test tree" selectionMode="multiple">
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

        const [item1, item2] = screen.getAllByRole('treeitem');
        const label1 = screen.getByText('Item 1');
        const label2 = screen.getByText('Item 2');

        expect(item1).to.have.attribute('aria-selected', 'false');
        expect(item2).to.have.attribute('aria-selected', 'false');

        await user.click(label1);

        expect(item1).to.have.attribute('aria-selected', 'true');
        expect(item2).to.have.attribute('aria-selected', 'false');

        await user.click(label2);

        expect(item1).to.have.attribute('aria-selected', 'true');
        expect(item2).to.have.attribute('aria-selected', 'true');

        await user.click(label1);

        expect(item1).to.have.attribute('aria-selected', 'false');
        expect(item2).to.have.attribute('aria-selected', 'true');
      });

      it('prop: defaultSelected with array', async () => {
        await render(
          <TreeView.Root
            aria-label="Test tree"
            selectionMode="multiple"
            defaultSelected={['item1', 'item2']}
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
            <TreeView.Item value="item3">
              <TreeView.ItemContent>
                <TreeView.ItemLabel>Item 3</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
          </TreeView.Root>,
        );

        const [item1, item2, item3] = screen.getAllByRole('treeitem');

        expect(item1).to.have.attribute('aria-selected', 'true');
        expect(item2).to.have.attribute('aria-selected', 'true');
        expect(item3).to.have.attribute('aria-selected', 'false');
      });

      it('hierarchical selection: selects all descendants when parent is clicked', async () => {
        const { user } = await render(
          <TreeView.Root
            aria-label="Test tree"
            selectionMode="multiple"
            defaultExpanded={['parent']}
          >
            <TreeView.Item value="parent">
              <TreeView.ItemContent>
                <TreeView.ItemLabel>Parent</TreeView.ItemLabel>
              </TreeView.ItemContent>
              <TreeView.ItemGroup>
                <TreeView.Item value="child1">
                  <TreeView.ItemContent>
                    <TreeView.ItemLabel>Child 1</TreeView.ItemLabel>
                  </TreeView.ItemContent>
                </TreeView.Item>
                <TreeView.Item value="child2">
                  <TreeView.ItemContent>
                    <TreeView.ItemLabel>Child 2</TreeView.ItemLabel>
                  </TreeView.ItemContent>
                </TreeView.Item>
              </TreeView.ItemGroup>
            </TreeView.Item>
          </TreeView.Root>,
        );

        const [parent, child1, child2] = screen.getAllByRole('treeitem');
        const parentLabel = screen.getByText('Parent');

        // Initially nothing is selected
        expect(parent).to.have.attribute('aria-selected', 'false');
        expect(child1).to.have.attribute('aria-selected', 'false');
        expect(child2).to.have.attribute('aria-selected', 'false');

        // Click parent to select all
        await user.click(parentLabel);

        // All should be selected
        expect(parent).to.have.attribute('aria-selected', 'true');
        expect(child1).to.have.attribute('aria-selected', 'true');
        expect(child2).to.have.attribute('aria-selected', 'true');

        // Click parent again to deselect all
        await user.click(parentLabel);

        // All should be deselected
        expect(parent).to.have.attribute('aria-selected', 'false');
        expect(child1).to.have.attribute('aria-selected', 'false');
        expect(child2).to.have.attribute('aria-selected', 'false');
      });

      it('hierarchical selection: shows indeterminate state for partial selection', async () => {
        const { user } = await render(
          <TreeView.Root
            aria-label="Test tree"
            selectionMode="multiple"
            defaultExpanded={['parent']}
          >
            <TreeView.Item value="parent">
              <TreeView.ItemContent>
                <TreeView.ItemCheckbox data-testid="parent-checkbox" />
                <TreeView.ItemLabel>Parent</TreeView.ItemLabel>
              </TreeView.ItemContent>
              <TreeView.ItemGroup>
                <TreeView.Item value="child1">
                  <TreeView.ItemContent>
                    <TreeView.ItemCheckbox />
                    <TreeView.ItemLabel>Child 1</TreeView.ItemLabel>
                  </TreeView.ItemContent>
                </TreeView.Item>
                <TreeView.Item value="child2">
                  <TreeView.ItemContent>
                    <TreeView.ItemCheckbox />
                    <TreeView.ItemLabel>Child 2</TreeView.ItemLabel>
                  </TreeView.ItemContent>
                </TreeView.Item>
              </TreeView.ItemGroup>
            </TreeView.Item>
          </TreeView.Root>,
        );

        const child1Label = screen.getByText('Child 1');
        const parentCheckbox = screen.getByTestId('parent-checkbox');
        const [parent] = screen.getAllByRole('treeitem');

        // Initially parent is not indeterminate
        expect(parent).not.to.have.attribute('data-indeterminate');
        expect(parentCheckbox).to.have.attribute('aria-checked', 'false');

        // Select one child
        await user.click(child1Label);

        // Parent should show indeterminate state
        expect(parent).to.have.attribute('data-indeterminate');
        expect(parentCheckbox).to.have.attribute('aria-checked', 'mixed');
      });
    });

    describe('controlled selection', () => {
      it('single selection', async () => {
        const { setProps } = await render(
          <TreeView.Root aria-label="Test tree" selectionMode="single" selected={null}>
            <TreeView.Item value="item1">
              <TreeView.ItemContent>
                <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
          </TreeView.Root>,
        );

        const [item] = screen.getAllByRole('treeitem');

        expect(item).to.have.attribute('aria-selected', 'false');

        await setProps({ selected: 'item1' });

        expect(item).to.have.attribute('aria-selected', 'true');

        await setProps({ selected: null });

        expect(item).to.have.attribute('aria-selected', 'false');
      });

      it('multiple selection', async () => {
        const { setProps } = await render(
          <TreeView.Root aria-label="Test tree" selectionMode="multiple" selected={[]}>
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

        const [item1, item2] = screen.getAllByRole('treeitem');

        expect(item1).to.have.attribute('aria-selected', 'false');
        expect(item2).to.have.attribute('aria-selected', 'false');

        await setProps({ selected: ['item1'] });

        expect(item1).to.have.attribute('aria-selected', 'true');
        expect(item2).to.have.attribute('aria-selected', 'false');

        await setProps({ selected: ['item1', 'item2'] });

        expect(item1).to.have.attribute('aria-selected', 'true');
        expect(item2).to.have.attribute('aria-selected', 'true');
      });
    });
  });

  describe('prop: disabled', () => {
    it('disables the entire tree', async () => {
      await render(
        <TreeView.Root aria-label="Test tree" disabled>
          <TreeView.Item value="item1">
            <TreeView.ItemContent data-testid="content">
              <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const tree = screen.getByRole('tree');
      const [item] = screen.getAllByRole('treeitem');
      const content = screen.getByTestId('content');

      expect(tree).to.have.attribute('data-disabled');
      expect(item).to.have.attribute('data-disabled');
      expect(content).to.have.attribute('data-disabled');
    });
  });

  describe.skipIf(isJSDOM)('keyboard navigation', () => {
    it('ArrowDown moves focus to next visible item', async () => {
      const { user } = await render(
        <TreeView.Root aria-label="Test tree">
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

      const items = screen.getAllByRole('treeitem');
      const focusable1 = items[0].querySelector<HTMLElement>('[tabindex="0"]');
      const focusable2 = items[1].querySelector<HTMLElement>('[tabindex="0"]');

      await user.keyboard('[Tab]');
      expect(focusable1).toHaveFocus();

      await user.keyboard('[ArrowDown]');
      expect(focusable2).toHaveFocus();
    });

    it('ArrowUp moves focus to previous visible item', async () => {
      const { user } = await render(
        <TreeView.Root aria-label="Test tree">
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

      const items = screen.getAllByRole('treeitem');
      const focusable1 = items[0].querySelector<HTMLElement>('[tabindex="0"]');
      const focusable2 = items[1].querySelector<HTMLElement>('[tabindex="0"]');

      await user.keyboard('[Tab]');
      expect(focusable1).toHaveFocus();

      await user.keyboard('[ArrowDown]');
      expect(focusable2).toHaveFocus();

      await user.keyboard('[ArrowUp]');
      expect(focusable1).toHaveFocus();
    });

    it('ArrowDown skips collapsed children', async () => {
      const { user } = await render(
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
          <TreeView.Item value="sibling">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Sibling</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const items = screen.getAllByRole('treeitem');
      const parentFocusable = items[0].querySelector<HTMLElement>('[tabindex="0"]');
      const siblingFocusable = items[2].querySelector<HTMLElement>('[tabindex="0"]');

      await user.keyboard('[Tab]');
      expect(parentFocusable).toHaveFocus();

      // ArrowDown should skip the collapsed child and go to sibling
      await user.keyboard('[ArrowDown]');
      expect(siblingFocusable).toHaveFocus();
    });

    it('ArrowDown navigates through expanded children', async () => {
      const { user } = await render(
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
          <TreeView.Item value="sibling">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Sibling</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const items = screen.getAllByRole('treeitem');
      const parentFocusable = items[0].querySelector<HTMLElement>('[tabindex="0"]');
      const childFocusable = items[1].querySelector<HTMLElement>('[tabindex="0"]');
      const siblingFocusable = items[2].querySelector<HTMLElement>('[tabindex="0"]');

      await user.keyboard('[Tab]');
      expect(parentFocusable).toHaveFocus();

      await user.keyboard('[ArrowDown]');
      expect(childFocusable).toHaveFocus();

      await user.keyboard('[ArrowDown]');
      expect(siblingFocusable).toHaveFocus();
    });

    it('ArrowUp skips collapsed children', async () => {
      const { user } = await render(
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
          <TreeView.Item value="sibling">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Sibling</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const items = screen.getAllByRole('treeitem');
      const parentFocusable = items[0].querySelector<HTMLElement>('[tabindex="0"]');
      const siblingFocusable = items[2].querySelector<HTMLElement>('[tabindex="0"]');

      await user.keyboard('[Tab]');
      await user.keyboard('[ArrowDown]');
      expect(siblingFocusable).toHaveFocus();

      // ArrowUp should skip the collapsed child and go to parent
      await user.keyboard('[ArrowUp]');
      expect(parentFocusable).toHaveFocus();
    });

    it('ArrowDown works with deeply nested collapsed items', async () => {
      const { user } = await render(
        <TreeView.Root aria-label="Test tree">
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
                      <TreeView.ItemLabel>Level 3</TreeView.ItemLabel>
                    </TreeView.ItemContent>
                  </TreeView.Item>
                </TreeView.ItemGroup>
              </TreeView.Item>
            </TreeView.ItemGroup>
          </TreeView.Item>
          <TreeView.Item value="sibling">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Sibling</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const items = screen.getAllByRole('treeitem');
      const level1Focusable = items[0].querySelector<HTMLElement>('[tabindex="0"]');
      const siblingFocusable = items[3].querySelector<HTMLElement>('[tabindex="0"]');

      await user.keyboard('[Tab]');
      expect(level1Focusable).toHaveFocus();

      // ArrowDown should skip all collapsed nested children
      await user.keyboard('[ArrowDown]');
      expect(siblingFocusable).toHaveFocus();
    });

    it('Home moves focus to first item', async () => {
      const { user } = await render(
        <TreeView.Root aria-label="Test tree">
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
          <TreeView.Item value="item3">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 3</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const items = screen.getAllByRole('treeitem');
      const focusable1 = items[0].querySelector<HTMLElement>('[tabindex="0"]');
      const focusable3 = items[2].querySelector<HTMLElement>('[tabindex="0"]');

      await user.keyboard('[Tab]');
      await user.keyboard('[ArrowDown]');
      await user.keyboard('[ArrowDown]');
      expect(focusable3).toHaveFocus();

      await user.keyboard('[Home]');
      expect(focusable1).toHaveFocus();
    });

    it('End moves focus to last visible item', async () => {
      const { user } = await render(
        <TreeView.Root aria-label="Test tree">
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
          <TreeView.Item value="item3">
            <TreeView.ItemContent>
              <TreeView.ItemLabel>Item 3</TreeView.ItemLabel>
            </TreeView.ItemContent>
          </TreeView.Item>
        </TreeView.Root>,
      );

      const items = screen.getAllByRole('treeitem');
      const focusable1 = items[0].querySelector<HTMLElement>('[tabindex="0"]');
      const focusable3 = items[2].querySelector<HTMLElement>('[tabindex="0"]');

      await user.keyboard('[Tab]');
      expect(focusable1).toHaveFocus();

      await user.keyboard('[End]');
      expect(focusable3).toHaveFocus();
    });

    it('ArrowRight expands collapsed node', async () => {
      const { user } = await render(
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
      const parentFocusable = parent.querySelector<HTMLElement>('[tabindex="0"]');

      await user.keyboard('[Tab]');
      expect(parentFocusable).toHaveFocus();
      expect(parent).to.have.attribute('aria-expanded', 'false');

      await user.keyboard('[ArrowRight]');

      expect(parent).to.have.attribute('aria-expanded', 'true');
      expect(screen.queryByText('Child')).not.to.equal(null);
    });

    it('ArrowLeft collapses expanded node', async () => {
      const { user } = await render(
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
      const parentFocusable = parent.querySelector<HTMLElement>('[tabindex="0"]');

      await user.keyboard('[Tab]');
      expect(parentFocusable).toHaveFocus();
      expect(parent).to.have.attribute('aria-expanded', 'true');

      await user.keyboard('[ArrowLeft]');

      expect(parent).to.have.attribute('aria-expanded', 'false');
    });

    ['Enter', 'Space'].forEach((key) => {
      it(`${key} selects item when selectionMode is single`, async () => {
        const { user } = await render(
          <TreeView.Root aria-label="Test tree" selectionMode="single">
            <TreeView.Item value="item1">
              <TreeView.ItemContent>
                <TreeView.ItemLabel>Item 1</TreeView.ItemLabel>
              </TreeView.ItemContent>
            </TreeView.Item>
          </TreeView.Root>,
        );

        const [item] = screen.getAllByRole('treeitem');

        await user.keyboard('[Tab]');
        expect(item).to.have.attribute('aria-selected', 'false');

        await user.keyboard(`[${key}]`);

        expect(item).to.have.attribute('aria-selected', 'true');
      });
    });
  });
});
