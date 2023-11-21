import { useState, useMemo, useEffect } from "react";
import { DataSet } from "vis-data/standalone";
import { Timeline } from "./components/Timeline";
//import moment from "moment";
import './App.css';
import { applyNonLinearTransformation } from "./components/TimelineItem"
//import { generateMockTimelineItems } from "./components/MockTimelineItems"

const App = () => {

  const [sortValue, setSortValue] = useState('None');

  const selectEffect = (event: any) => {
    setSortValue(event.target.value);
  }

  const groups = new DataSet([
    { id: 1, content: "1" },
    { id: 2, content: "2" },
    { id: 3, content: "3" }
  ]);

  //let u = generateMockTimelineItems()
  //console.log(u);

  let items:any;
  useEffect(() => {
    items = [{id: 1, start: 10, end: 21.54, content: 'Event 2 for Pedestrians', gain: 0.85, group: 1},
    {id: 2, start: 20, end: 26.69, content: 'Event 3 for Pedestrians', gain: 0.69, group: 1},
    {id: 3, start: 30, end: 36.9, content: 'Event 4 for Pedestrians', gain: 0.01, group: 1},
    {id: 4, start: 40, end: 49.7, content: 'Event 5 for Pedestrians', gain: 0.64, group: 1},
    {id: 5, start: 50, end: 57.71, content: 'Event 6 for Pedestrians', gain: 0.02, group: 1},
    {id: 6, start: 60, end: 67.37, content: 'Event 7 for Pedestrians', gain: 0.49, group: 1},
    {id: 7, start: 70, end: 81.16, content: 'Event 8 for Pedestrians', gain: 0.51, group: 1},
    {id: 8, start: 80, end: 86.72, content: 'Event 9 for Pedestrians', gain: 0.93, group: 1},
    {id: 9, start: 90, end: 94.21, content: 'Event 10 for Pedestrians', gain: 0.74, group: 1},
    {id: 10, start: 100, end: 103.27, content: 'Event 11 for Pedestrians', gain: 0.01, group: 1},
    {id: 11, start: 10, end: 14.73, content: 'Event 12 for Cars', gain: 0.5, group: 2},
    {id: 12, start: 20, end: 30.13, content: 'Event 13 for Cars', gain: 0.65, group: 2},
    {id: 13, start: 30, end: 40.97, content: 'Event 14 for Cars', gain: 0.11, group: 2},
    {id: 14, start: 40, end: 43.74, content: 'Event 15 for Cars', gain: 0.51, group: 2},
    {id: 15, start: 50, end: 56.07, content: 'Event 16 for Cars', gain: 0.18, group: 2},
    {id: 16, start: 60, end: 71.16, content: 'Event 17 for Cars', gain: 0.72, group: 2},
    {id: 17, start: 70, end: 81.38, content: 'Event 18 for Cars', gain: 0.66, group: 2},
    {id: 18, start: 80, end: 91.72, content: 'Event 19 for Cars', gain: 0.67, group: 2},
    {id: 19, start: 90, end: 95.88, content: 'Event 20 for Cars', gain: 0.71, group: 2},
    {id: 20, start: 100, end: 110.03, content: 'Event 21 for Cars', gain: 0.11, group: 2},
    {id: 21, start: 10, end: 13.8, content: 'Event 22 for Trucks', gain: 0.43, group: 3 },
    {id: 22, start: 20, end: 26.65, content: 'Event 23 for Trucks', gain: 0.43, group: 3},
    {id: 23, start: 30, end: 42.47, content: 'Event 24 for Trucks', gain: 0.35, group: 3},
    {id: 24, start: 40, end: 44.18, content: 'Event 25 for Trucks', gain: 0.42, group: 3},
    {id: 25, start: 50, end: 58.77, content: 'Event 26 for Trucks', gain: 0.55, group: 3},
    {id: 26, start: 60, end: 66.17, content: 'Event 27 for Trucks', gain: 0.94, group: 3},
    {id: 27, start: 70, end: 77.09, content: 'Event 28 for Trucks', gain: 0.86, group: 3},
    {id: 28, start: 80, end: 87.25, content: 'Event 29 for Trucks', gain: 0.7, group: 3},
    {id: 29, start: 90, end: 94.11, content: 'Event 30 for Trucks', gain: 0.25, group: 3},
    {id: 30, start: 100, end: 103.15, content: 'Event 31 for Trucks', gain: 0.11, group: 3}];
  }, []);

  const memo1 = useMemo(() => applyNonLinearTransformation(items, 1), [items]);
  const memo2 = useMemo(() => applyNonLinearTransformation(items, 2), [items]);
  const memo3 = useMemo(() => applyNonLinearTransformation(items, 3), [items]);

  let data: any;
  if(sortValue === 'None'){
    data = items;
  } else if(sortValue === 'Pedestrians'){
    data = memo1;
  } else if(sortValue === 'Cars'){
    data = memo2;
  } else if(sortValue === 'Trucks'){
    data = memo3;
  }

  const options = {
    start: data[0].start,
    end: data[data.length - 1].end,
    timeAxis: { scale: "second" },
    orientation: 'top',
    zoomKey: 'ctrlKey',
    showMajorLabels: true,
    format: {
      majorLabels: {
        millisecond:'HH:mm:ss',
        second:     'HH:mm',
        minute:     ' ',
        hour:       ' ',
        weekday:    ' ',
        day:        ' ',
        week:       ' ',
        month:      ' ',
        year:       ' '
      }
    },
    showMinorLabels: true,
    stack: false,
    /*
    moment: function(date: any) {
      return moment(date).utc();
    }
    */
  };

  data.forEach((
    item: any,
    i: number) => {
    const num = 255 - item.gain * 255;
    const z = Math.round((data[data.length - i - 1].end - data[data.length - i - 1].start));
    data[i].style = `background-color: rgb(255, ${num}, 0); z-index: ${z}; position: 'relative'`
  });

  return (
    <>
      <Timeline groups={groups} items={data} options={options}/>
      <br></br>
      <select id="sort" value={sortValue} className="sort" onChange={selectEffect}>
        <option value="Pedestrians">Pedestrians</option>
        <option value="Cars">Cars</option>
        <option value="Trucks">Trucks</option>
        <option value="None">None</option>
      </select>
    </>
  );
};

export default App;
