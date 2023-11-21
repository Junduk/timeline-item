interface TimelineItem {
  id: number
  start: number
  end: number
  content: string
  //gain: number
  group: string
}

const transformGroupItems = (
  items: TimelineItem[],
  groupName: string
) => {
  
  // Step 1: Filter out the items from the selected group and sort them by gain
  const filteredAndSortedItems = items
      .filter((item) => item.group === groupName)
      //.sort((a, b) => b.gain - a.gain)
  // Step 2: Reposition the selected group items based on the sorted order

  let currentStart = items[0].start// This assumes the timeline starts at 0
  const repositionedItems = filteredAndSortedItems.map((item: any) => {
      const newItem = {
          ...item,
          start: currentStart,
          end: currentStart + (item.end - item.start),// Preserving the original duration
      }
      currentStart = newItem.end// Update currentStart to the end of the current item
      return newItem
  })
  // Step 3: Return the new array with adjusted items
  return repositionedItems
}

const adjustOverlappingItems = (
  transformedGroupItems: TimelineItem[], // Items from the selected group after repositioning
  otherItems: TimelineItem[] // Items from the other groups
) => {
  let adjustedItems: TimelineItem[] = []

  otherItems.forEach((item) => {
      // Find all selected group items that overlap with the current non-selected group item
      const overlappingSelectedItems = transformedGroupItems.filter(
          (selectedItem) => doItemsOverlap(item, selectedItem)
      )

      if (overlappingSelectedItems.length > 0) {
          // If there are overlaps, adjust the current item accordingly
          // Note: The adjustItem function should be modified to only return overlapping segments
          const adjustedSegments = adjustItem(item, overlappingSelectedItems)
          adjustedItems = adjustedItems.concat(adjustedSegments)
      }
      // Non-overlapping items or parts of items are discarded and not added to adjustedItems
  })

  return adjustedItems
}

const doItemsOverlap = (item1: TimelineItem, item2: TimelineItem) => {
  // Two items overlap if the start of one is between the start and end of the other
  return item1.start < item2.end && item1.end > item2.start
}

const adjustItem = (
  overlappingItem: TimelineItem,
  selectedGroupItems: TimelineItem[]
) => {
  // Ensure the selected group items are sorted by their start time
  const sortedSelectedItems = selectedGroupItems.sort(
      (a, b) => a.start - b.start
  )

  const adjustedItems: TimelineItem[] = []

  sortedSelectedItems.forEach((selectedItem) => {
      if (doItemsOverlap(overlappingItem, selectedItem)) {
          // Only add the overlapping segment to adjustedItems
          const overlapStart = Math.max(
              overlappingItem.start,
              selectedItem.start
          )
          const overlapEnd = Math.min(overlappingItem.end, selectedItem.end)

          adjustedItems.push({
              ...overlappingItem,
              start: overlapStart,
              end: overlapEnd,
          })
      }
  })

  return adjustedItems
}

export const applyNonLinearTransformation = (
  items: TimelineItem[],
  groupName: string
) => {
  // Transform the selected group

  let items1 = items.map(item => item);
  const transformedGroupItems = transformGroupItems(items1, groupName)
  // Get the items not in the selected group
  const otherItems = items1.filter((item) => item.group !== groupName)

  // Adjust the other items based on the transformed group items
  const adjustedOtherItems = adjustOverlappingItems(
      transformedGroupItems,
      otherItems
  )
  
  let index = transformedGroupItems[transformedGroupItems.length - 1].id + 1;
  for(let i = 0; i < adjustedOtherItems.length; i++){
    adjustedOtherItems[i].id = index;
    index++;
  }
  
  // Combine the transformed and adjusted items
  return [...transformedGroupItems, ...adjustedOtherItems]
}