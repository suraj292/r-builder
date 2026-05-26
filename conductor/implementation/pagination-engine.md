# Pagination Engine Implementation Strategy

The pagination engine is responsible for taking a flat list of blocks and distributing them across A4-sized containers.

## The "Measure & Slice" Algorithm

Since CSS alone cannot handle complex element-level page breaks with precision (especially when splitting a list of items across pages), we use a JavaScript-driven measurement engine.

### 1. The Measurement Container
We maintain a hidden `div` that is exactly `210mm` wide (A4 width). This container is styled with the same font and padding as the real resume canvas.

### 2. Step-by-Step Flow
1. **Queue Update**: Whenever a block's content changes (debounced), trigger `calculatePagination`.
2. **Measure Blocks**:
   - Loop through the `layout` order.
   - Render each block into the hidden container one by one.
   - Use `element.offsetHeight` to get the height of the block.
   - Store these heights in a map: `Record<blockId, height>`.
3. **Partitioning**:
   - Initialize `currentPage = 0`, `currentHeight = 0`, `pages = [[]]`.
   - Iterate through blocks:
     - `blockHeight = measuredHeights[blockId]`.
     - If `currentHeight + blockHeight > PAGE_MAX_HEIGHT`:
       - If the block is **Splittable** (e.g., a list or experience block with many sub-items):
         - Execute `splitBlock(blockId, remainingHeight)` to determine how many sub-items fit.
         - Push the "fitting" part to `pages[currentPage]`.
         - Start `currentPage++`.
         - Push the "remaining" part to `pages[currentPage]`.
       - Else (Atomic block):
         - `currentPage++`.
         - `pages[currentPage] = [blockId]`.
         - `currentHeight = blockHeight`.
     - Else:
       - `pages[currentPage].push(blockId)`.
       - `currentHeight += blockHeight`.
4. **State Sync**: Update the store with the new `pages` array. React will re-render the canvas using this structure.

## Handling the "Jump" (Caret Restoration)
When a user types, the DOM might be destroyed and recreated as blocks move between pages.
- **Solution**: Before re-rendering, save the `selectionStart`, `selectionEnd`, and the `blockId` being edited. After the render cycle (`useEffect`), use the Selection API to restore the caret to the exact position within the newly rendered block.

## Pseudo-code for `splitBlock`
```typescript
function splitBlock(blockId, availableHeight) {
  const block = blocks[blockId];
  if (block.type !== 'list') return { fits: false };
  
  let fitItems = [];
  let remainingItems = [];
  let currentTotal = 0;
  
  for (const item of block.data.items) {
    const itemHeight = measureSubItem(item);
    if (currentTotal + itemHeight < availableHeight) {
      fitItems.push(item);
      currentTotal += itemHeight;
    } else {
      remainingItems.push(item);
    }
  }
  
  return { fitItems, remainingItems };
}
```
