import { Box } from "@mui/material";

import "./Widget.css";
import EquipmentDetailsWidgetChart from "./components/barChart";
import SavingsTip from "./components/trip";

type WidgetProps = {
  /**
   * Widget's data resolved from the API according to the widget's configuration.
   *
   * Will be `null` while loading or if somehow the communication with Admin/RUN has failed.
   */
  data: WidgetData[] | null;
  /**
   * Widget's parameter object.
   *
   * Will be `null` while loading or if somehow the communication with Admin/RUN has failed.
   */
  showTime: string | null;
  /**
   * Widget's parameter object.
   *
   * Will be `null` while loading or if somehow the communication with Admin/RUN has failed.
   */
  userSettings: TUserInformation | null;

  /**
   * Widget's parameter object.
   *
   * Will be `null` while loading or if somehow the communication with Admin/RUN has failed.
   */
  isPerHourUsage: any;
};

function Widget(props: WidgetProps) {
  const { data, showTime, userSettings, isPerHourUsage } = props;

  if (isPerHourUsage) {
    return (
      <Box width={"100%"} height="300px">
        <EquipmentDetailsWidgetChart data={data} isPerHourUsage={isPerHourUsage} />
      </Box>
    );
  } else {
    return (
      <Box width={"100%"} height="300px">
        <SavingsTip />
      </Box>
    );
  }
}

export { Widget };
export type { WidgetProps };
