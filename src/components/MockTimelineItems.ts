interface TimelineItem {
  id: number;
  start: number;
  end: number;
  content: string;
  gain: number;
  group: 'Pedestrians' | 'Cars' | 'Trucks';
}

export const generateMockTimelineItems = (): TimelineItem[] => {
  const timelineItems: TimelineItem[] = [];
  const groups: ('Pedestrians' | 'Cars' | 'Trucks')[] = ['Pedestrians', 'Cars', 'Trucks'];

  let idCounter = 1;

  for (const group of groups) {
    for (let i = 1; i <= 10; i++) {
      const startTime = i * 10;
      const endTime = startTime + 3 + (Math.round(Math.random() * 1000)) / 100;
      const gain = Math.round(Math.random() * 100) / 100; // random gain between 0 and 1

      timelineItems.push({
        id: idCounter++,
        start: startTime,
        end: endTime,
        content: `Event ${idCounter} for ${group}`,
        gain: gain,
        group: group,
      });
    }
  }

  return timelineItems;
};