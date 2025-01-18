import { useState } from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PlanilhaDayTrade from "./PlanilhaDayTrade.jsx";
import pdfToText from "react-pdftotext"; // Assumindo que pdfToText está instalado e funcionando

function extractTableData(text) {
    console.log(text);
    const regex =
        /(\d{2}\/\d{2}\/\d{4}).*Valor dos negócios\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+.*Taxas BM&F \(emol\+f\.gar\)\s+(\d+\.*\d*,\d+)\|\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+\|.*Total de custos operacionais\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+\|\s+(\d+\.*\d*,\d+)\s+\|.*(\d+\.*\d*,\d+)\s+.*Total líquido da nota\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\|\s+(\d+\.*\d*,\d+)\s+\| C\s+(\d+\.*\d+,*\d*)\s+\| C\s+(\d+\.*\d*,\d+)\s+/g;

    const matches = [...text.matchAll(regex)];
    return matches.map((match) => ({
        data: parseFloat(match[1].replace(",", ".")),
        valorDisponivel: parseFloat(match[2].replace(",", ".")),
        compraDisponivel: parseFloat(match[3].replace(",", ".")),
        vendaOpcoes: parseFloat(match[4].replace(",", ".")),
        compraOpcoes: parseFloat(match[5].replace(",", ".")),
        valorDosNegocios: parseFloat(match[6].replace(",", ".")),
        irrf: parseFloat(match[7].replace(",", ".")),
        irrfDayTradeProj: parseFloat(match[8].replace(",", ".")),
        taxaOperacional: parseFloat(match[9].replace(",", ".")),
        taxaRegistroBMEF: parseFloat(match[10].replace(",", ".")),
        taxaxBMEFEmolFGar: parseFloat(match[11].replace(",", ".")),
        outrosCustos: parseFloat(match[12].replace(",", ".")),
        impostos: parseFloat(match[13].replace(",", ".")),
        ajusteDePosicao: parseFloat(match[14].replace(",", ".")),
        ajusteDayTrade: parseFloat(match[15].replace(",", ".")),
        totalDeCustosOperacionais: parseFloat(match[16].replace(",", ".")),
        outros: parseFloat(match[17].replace(",", ".")),
        irrfOperacional: parseFloat(match[18].replace(",", ".")),
        totalContaInvestimento: parseFloat(match[19].replace(",", ".")),
        totalContaNormal: parseFloat(match[20].replace(",", ".")),
        totalLiquido: parseFloat(match[21].replace(",", ".")),
        totalLiquidoDaNota: parseFloat(match[22].replace(",", ".")),
    }));
}

const PdfUpload = () => {
    const [pdfData, setPdfData] = useState([]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            try {
                const text = await pdfToText(file);
                const data = extractTableData(text);
                setPdfData(data);
            } catch (error) {
                console.error("Failed to extract text from PDF", error);
                alert("Erro ao extrair texto do PDF. Tente novamente.");
            }
        } else {
            alert("Por favor, selecione um arquivo PDF válido.");
        }
    };

    return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Upload do PDF para Cálculo do DARF
            </Typography>
            <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
            >
                Upload PDF
                <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleFileUpload}
                />
            </Button>
            {pdfData.length > 0 && (
                <PlanilhaDayTrade extractedData={pdfData} />
            )}
        </Box>
    );
};

export default PdfUpload;
