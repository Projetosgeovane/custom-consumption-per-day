import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import moment from "moment-timezone";
import { Box, Button } from "@mui/material";

type WidgetProps = {
  data: WidgetData[] | null;
  showTime: string | null;
  userSettings: TUserInformation | null;
  isPerHourUsage: any;
};

export default function EquipmentDetailsWidgetChart({ data, isPerHourUsage }: WidgetProps) {
  const [filterMonths, setFilterMonths] = useState(1); // Define o filtro inicial para 1 mês

  const variableData = useMemo(() => {
    return data?.find((item) => item)?.result || [];
  }, [data]) as any;

  const dailyConsumption = variableData?.filter((item) => item?.variable === "daily_consumption") || [];
  const perHourUsage = variableData?.filter((item) => item?.variable === "perhourusage") || [];

  const mockDataPerHourUsage = perHourUsage.map((item) => {
    const timeMoment = moment(item?.time).tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss");
    return {
      value: item.value,
      time: new Date(timeMoment).getTime(), // Convertido para timestamp
    };
  });

  const mockDataDailyConsumption = dailyConsumption.map((item) => {
    const timeMoment = moment(item?.time).format("YYYY-MM-DD HH:mm:ss");
    return {
      value: item.value,
      time: new Date(timeMoment).getTime(), // Convertido para timestamp
    };
  });

  // Calcula os limites do eixo X com base no filtro
  const minDate = moment().subtract(filterMonths, "months").startOf("day").valueOf();
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
      type: "datetime", // Necessário para reconhecer as datas corretamente
      labels: {
        datetimeUTC: false,
        style: {
          fontSize: "12px",
        },
      },
      // min: minDate, // Define o limite mínimo para um mês atrás
      // max: maxDate,
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy HH:mm", // Formatação para a tooltip
      },
      y: {
        formatter: (value: number) => `${value}`, // Formatação para os valores
      },
    },
    yaxis: {
      title: {
        text: "Usage",
      },
      min: -1,
    },
    dataLabels: {
      enabled: false,
      formatter: (value) => (value !== null ? value.toFixed(2) : "0"), // Força exibição do zero
      offsetY: -10,
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  const series = [
    {
      name: isPerHourUsage ? "perhourusage" : "daily_consumption",
      data: isPerHourUsage
        ? mockDataPerHourUsage.map((item) => ({ x: item.time, y: item.value / 100 }))
        : mockDataDailyConsumption.map((item) => ({ x: item.time, y: item.value / 100 })), // Formato para datetime no eixo X
    },
  ];

  // Função para alterar o filtro de meses
  const handleFilterChange = (months) => {
    setFilterMonths(months);
  };

  return (
    <Box width="100%" height="400px">
      {/* <Box display="flex" justifyContent="center" mb={2}>
        <Button variant="contained" onClick={() => handleFilterChange(1)}>
          Último Mês
        </Button>
        <Button variant="contained" onClick={() => handleFilterChange(3)} style={{ marginLeft: "10px" }}>
          Últimos 3 Meses
        </Button>
        <Button variant="contained" onClick={() => handleFilterChange(6)} style={{ marginLeft: "10px" }}>
          Últimos 6 Meses
        </Button>
      </Box> */}

      <Chart options={options} series={series} type="bar" height="350" />
    </Box>
  );
}
