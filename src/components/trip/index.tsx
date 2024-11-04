import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";

// Array com dicas de economia
const tips = [
  "Você sabia? Reduzir o uso de água durante o banho ajuda a economizar até 15% na conta de água.",
  "Desligar aparelhos eletrônicos da tomada quando não estiverem em uso pode reduzir o consumo de energia.",
  "Evitar o uso de elevadores para subir apenas um andar economiza energia e ajuda o meio ambiente.",
  "Usar iluminação natural sempre que possível pode reduzir o consumo de eletricidade.",
];

export default function SavingsTip() {
  const [currentTip, setCurrentTip] = useState(0);

  // Atualiza a dica a cada 10 segundos (ou o intervalo que preferir)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: "#e0f7fa",
        borderRadius: "8px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        margin: "16px 0",
        maxWidth: "600px", // Limita a largura do box
        marginLeft: "auto",
        marginRight: "auto", // Centraliza horizontalmente na página
      }}
    >
      <Typography variant="h6" gutterBottom>
        Dica de Economia
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {tips[currentTip]}
      </Typography>
    </Box>
  );
}
