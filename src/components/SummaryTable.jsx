import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Typography,
    Paper,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Calculate } from "../functions/Calculate";

const SummaryTable = ({ extractedData, setPdfData }) => {
    const [rows, setRows] = useState([]);
    const [totals, setTotals] = useState([]);

    useEffect(() => {
        const darfPorMes = Calculate(extractedData);

        const updatedRows = extractedData.map((row, index) => ({
            id: index,
            fileName: row.fileName,
            data: row.data,
            valorDosNegocios: row.valorDosNegocios,
            irrf: row.irrf,
            irrfDayTradeProj: row.irrfDayTradeProj,
            taxaOperacional: row.taxaOperacional,
            totalLiquido: row.totalLiquido,
        }));

        const aggregatedTotals = darfPorMes.map((darf, index) => {
            const rowsForMonth = extractedData.filter(row => {
                const mesAnoRow = new Date(row.data.split("/").reverse().join("-")).toISOString().slice(0, 7);
                return mesAnoRow === darf.mesAno;
            });

            const totalBruto = rowsForMonth.reduce((sum, row) => sum + (row.valorDosNegocios || 0), 0);
            const totalLiquido = rowsForMonth.reduce((sum, row) => sum + (row.totalLiquido || 0), 0);

            return {
                id: index,
                mesAno: darf.mesAno,
                totalBruto: totalBruto,
                totalLiquido: totalLiquido,
                darfAPagar: parseFloat(darf.darf),
            };
        });

        setRows(updatedRows);
        setTotals(aggregatedTotals);
    }, [extractedData]);

    const handleDelete = (id) => {
        const updatedData = extractedData.filter((_, index) => index !== id);
        setPdfData(updatedData);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Detalhes das Notas
            </Typography>
            <Paper sx={{ height: 400, width: '100%', mb: 4 }}>
                <DataGrid
                    rows={rows}
                    columns={[
                        { field: 'data', headerName: 'Data', flex: 1 },
                        { field: 'fileName', headerName: 'Nome do arquivo', flex: 1 },
                        { field: 'valorDosNegocios', headerName: 'Valor dos Negócios', flex: 1 },
                        { field: 'irrf', headerName: 'IRRF', flex: 1 },
                        { field: 'irrfDayTradeProj', headerName: 'IRRF Day Trade Proj.', flex: 1 },
                        { field: 'taxaOperacional', headerName: 'Taxa Operacional', flex: 1 },
                        { field: 'totalLiquido', headerName: 'Total Líquido', flex: 1 },
                        {
                            field: 'actions',
                            headerName: 'Ações',
                            flex: 1,
                            renderCell: (params) => (
                                <Button
                                    startIcon={<DeleteIcon />}
                                    color="warning"
                                    variant="outlined"
                                    onClick={() => handleDelete(params.row.id)}
                                >
                                    Deletar
                                </Button>
                            ),
                        },
                    ]}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </Paper>

            <Typography variant="h6" gutterBottom>
                Resumo Mensal
            </Typography>
            <Paper sx={{ height: 300, width: '100%' }}>
                <DataGrid
                    rows={totals}
                    columns={[
                        { field: 'mesAno', headerName: 'Mês/Ano', flex: 1 },
                        { field: 'totalBruto', headerName: 'Total Bruto', flex: 1 },
                        { field: 'totalLiquido', headerName: 'Total Líquido', flex: 1 },
                        { field: 'darfAPagar', headerName: 'DARF a Pagar', flex: 1 },
                    ]}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </Paper>
        </Box>
    );
};

SummaryTable.propTypes = {
    extractedData: PropTypes.array.isRequired,
    setPdfData: PropTypes.func.isRequired,
};

export default SummaryTable;
