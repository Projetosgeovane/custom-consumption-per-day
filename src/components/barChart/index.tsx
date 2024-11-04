import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import moment from "moment-timezone";
import { Box, Button, ButtonGroup } from "@mui/material";

type WidgetProps = {
  data: WidgetData[] | null;
  showTime: string | null;
  userSettings: TUserInformation | null;
  isPerHourUsage: any;
};

export default function EquipmentDetailsWidgetChart({ data, isPerHourUsage }: WidgetProps) {
  const [filterDays, setFilterDays] = useState(15);

  const variableData = useMemo(() => {
    return data?.find((item) => item)?.result || [];
  }, [data]) as any;

  const dailyConsumption = variableData?.filter((item) => item?.variable === "daily_consumption") || [];
  const perHourUsage = variableData?.filter((item) => item?.variable === "perhourusage") || [];

  const mockDataPerHourUsage = perHourUsage.map((item) => {
    const timeMoment = moment(item?.time).tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss");
    return {
      value: item.value,
      time: new Date(timeMoment).getTime(),
    };
  });

  const mockDataDailyConsumption = dailyConsumption.map((item) => {
    const timeMoment = moment(item?.time).format("YYYY-MM-DD HH:mm:ss");
    return {
      value: item.value,
      time: new Date(timeMoment).getTime(),
    };
  });

  // Calcula os limites do eixo X com base no filtro
  const minDate = filterDays
    ? moment().subtract(filterDays, "days").startOf("day").valueOf()
    : Math.min(...[...mockDataPerHourUsage, ...mockDataDailyConsumption].map((item) => item.time)); // Mostra desde o primeiro registro disponível quando "TODO O PERÍODO"
  const maxDate = moment().endOf("day").valueOf();

  const options = {
    chart: {
      type: "bar",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "100%",
        distributed: false,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
        style: {
          fontSize: "12px",
        },
        min: minDate,
        max: maxDate,
      },
      min: minDate,
      max: maxDate,
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy HH:mm",
      },
      y: {
        formatter: (value: number) => `${value}`,
      },
    },
    yaxis: {
      title: {
        text: "Consumo Horário (m³)",
      },
    },
    dataLabels: {
      enabled: false,
      formatter: (value) => (value !== null ? value.toFixed(2) : "0"),
      offsetY: -10,
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  const series = [
    {
      name: isPerHourUsage ? "Consumo horário" : "Consumo horário",
      data: isPerHourUsage
        ? mockDataPerHourUsage.map((item) => ({ x: item.time, y: item.value / 100 }))
        : mockDataDailyConsumption.map((item) => ({ x: item.time, y: item.value / 100 })),
    },
  ];

  // Função para alterar o filtro de dias
  const handleFilterChange = (days) => {
    setFilterDays(days);
  };

  return (
    <Box width="100%" height="400px">
      <Box display="flex" justifyContent="center" mb={1} mt={1}>
        <ButtonGroup variant="outlined" color="primary" sx={{ width: 150 }}>
          <Button onClick={() => handleFilterChange(null)} size="small" sx={{ padding: "4px 8px", fontSize: "0.8rem" }}>
            TODO O PERÍODO
          </Button>
          <Button onClick={() => handleFilterChange(365)} size="small" sx={{ padding: "4px 8px", fontSize: "0.8rem" }}>
            1 ANO
          </Button>
          <Button onClick={() => handleFilterChange(180)} size="small" sx={{ padding: "4px 8px", fontSize: "0.8rem" }}>
            6 MESES
          </Button>
          <Button onClick={() => handleFilterChange(30)} size="small" sx={{ padding: "4px 8px", fontSize: "0.8rem" }}>
            1 MÊS
          </Button>
          <Button onClick={() => handleFilterChange(15)} size="small" sx={{ padding: "4px 8px", fontSize: "0.8rem" }}>
            15 DIAS
          </Button>
        </ButtonGroup>
      </Box>

      <Chart options={options} series={series} type="bar" height="350" />
    </Box>
  );
}
