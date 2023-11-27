interface TimelineItem {
  id: number
  start: number
  end: number
  content: string
  gain: number
  group: number
}

const doItemsOverlap = (item1: TimelineItem, item2: TimelineItem) => {
  return item1.start < item2.end && item1.end > item2.start
}

const adjustItem = (
  overlappingItem: TimelineItem,
  selectedGroupItems: TimelineItem[]) => {
  const sortedSelectedItems = selectedGroupItems.sort(
      (a, b) => a.start - b.start
  )
  const adjustedItems: TimelineItem[] = []

  sortedSelectedItems.forEach((selectedItem) => {
      if (doItemsOverlap(overlappingItem, selectedItem)) {
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

const joinMainItems = (
  main: TimelineItem[],
  reference: TimelineItem[]) => {

  const distance :any = [];
  let currentStart = main[0].start
  const repositionedItems = main.map((item: any) => {
      const newItem = {
          ...item,
          start: currentStart,
          end: currentStart + (item.end - item.start),
      }
      currentStart = newItem.end
      distance.push(reference[reference.indexOf(item)].start - newItem.start);
      return newItem
  })
  return [repositionedItems, distance];
}

const moveOtherItems = (
  mainItems: TimelineItem[],
  otherItems: TimelineItem[],
  distance: any[]) => {
  const idList = mainItems.map((item) => item.id);
  const adjustedItems: TimelineItem[] = []
  otherItems.forEach((item) => {
    const overlappingSelectedItems = mainItems.filter(
      (selectedItem) => doItemsOverlap(item, selectedItem))

    if (overlappingSelectedItems.length > 0) {
      const adjustedSegments = adjustItem(item, overlappingSelectedItems)

      adjustedSegments.forEach((segment, i) => {
        segment.start -= distance[idList.indexOf(overlappingSelectedItems[0 + i].id)];
        segment.end -= distance[idList.indexOf(overlappingSelectedItems[0 + i].id)];
      });

      adjustedItems.push(...adjustedSegments);
    }
  })
  return adjustedItems;
}

export const applyNonLinearTransformation = (
  items: TimelineItem[],
  groupName: number) => {
  const mainItems = items
  .filter((item) => item.group === groupName)
  .sort((a, b) => b.gain - a.gain)

  const mainReferenceItems = items
    .filter((item) => item.group === groupName)

  const otherItems = items
    .filter((item) => item.group !==  groupName)

  const [joinedMainItems, distance] = joinMainItems(mainItems, mainReferenceItems);

  const adjustedOtherItems = moveOtherItems(mainItems, otherItems, distance);
  
  let arrayOfItems = [...joinedMainItems, ...adjustedOtherItems].map((item, i) => ({
    ...item,
    id: i,
  })).sort((a, b) => (a.end - a.start) - (b.end - b.start));

  return arrayOfItems;
}