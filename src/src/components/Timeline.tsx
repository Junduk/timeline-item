import * as React from "react";
import { Timeline as VisTimeline } from "vis-timeline/standalone";

import "vis-timeline/standalone/umd/vis-timeline-graph2d.min";
import "vis-timeline/dist/vis-timeline-graph2d.min.css";

export const Timeline = (props: any) => {
  const { items, groups, options } = props;

  const [element, setElement]:any = React.useState(null);
  const [timeline, setTimeline]:any = React.useState(null);

  React.useEffect(() => {
    if (element) {
      const tl:any = new VisTimeline(element, []);
      setTimeline(tl);
      return () => tl.destroy();
    }
  }, [element]);

  React.useEffect(() => {
    timeline?.setGroups(groups);
  }, [timeline, groups]);

  React.useEffect(() => {
    timeline?.setItems(items);
  }, [timeline, items]);

  React.useEffect(() => {
    if (options && timeline) {
      timeline.setOptions(options);
    }
  }, [timeline, options]);

  return <div ref={(r) => setElement(r)} />;
};
