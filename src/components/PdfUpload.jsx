import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SummaryTable from "./SummaryTable.jsx";
import pdfToText from "react-pdftotext";
import { extractTableData } from "../brokerModels/clear.jsx";

const PdfUpload = () => {
    const [pdfData, setPdfData] = useState([]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("pdfData")) || [];
        setPdfData(storedData);
    }, []);

    useEffect(() => {
        localStorage.setItem("pdfData", JSON.stringify(pdfData));
    }, [pdfData]);

    const handleFileUpload = async (event) => {
        const files = Array.from(event.target.files);
        const newData = [];

        for (const file of files) {
            if (file.type === "application/pdf") {

                const isDuplicate = pdfData.some((row) => row.fileName === file.name);

                if (isDuplicate) {
                    alert(`Arquivo duplicado detectado: ${file.name}`);
                    continue;
                }

                try {
                    const text = await pdfToText(file);
                    const data = extractTableData(text).map((row) => ({
                        ...row,
                        fileName: file.name,
                        id: `${file.name}-${row.data}`,
                    }));

                    if (data.length === 0) {
                        alert(`Arquivo fora do padrão para a corretora selecionada. Nome do arquivo: ${file.name}`);
                        continue;
                    }

                    newData.push(...data);
                } catch (error) {
                    console.error(`Erro ao processar o arquivo ${file.name}:`, error);
                    alert(`Erro ao processar o arquivo: ${file.name}`);
                }
            } else {
                alert(`Arquivo inválido: ${file.name}. Apenas PDFs são suportados.`);
            }
        }

        setPdfData((prevData) => [...prevData, ...newData]);
    };

    return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
            >
                Upload PDFs
                <input
                    type="file"
                    accept="application/pdf"
                    hidden
                    multiple
                    onChange={handleFileUpload}
                />
            </Button>

            {pdfData.length > 0 && (
                <SummaryTable
                    extractedData={pdfData}
                    setPdfData={setPdfData}
                />
            )}
        </Box>
    );
};

export default PdfUpload;
