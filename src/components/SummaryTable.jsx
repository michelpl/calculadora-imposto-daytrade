import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    Box,
    Typography,
    Paper,
    Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const SummaryTable = ({ extractedData, setPdfData }) => {
    const [rows, setRows] = useState([]);
    const [totals, setTotals] = useState({
        saldoFinalMes: 0,
        resultadoLiquidoMes: 0,
        rentabilidadeLiquida: 0,
        darfAPagar: 0,
    });

    useEffect(() => {
        let runningSaldoLiquidoTotal = 0;

        const updatedRows = extractedData.map((row, index) => {
            const ganhoLiquido = row.valorDosNegocios + row.totalDeCustosOperacionais;
            const valorNotaCorretagem = ganhoLiquido + row.irrfDayTradeProj + row.impostos;
            runningSaldoLiquidoTotal += ganhoLiquido;

            return {
                id: row.id || index,
                data: row.data,
                valorDosNegocios: row.valorDosNegocios.toFixed(2),
                totalDeCustosOperacionais: row.totalDeCustosOperacionais.toFixed(2),
                irrfDayTradeProj: row.irrfDayTradeProj.toFixed(2),
                impostos: row.impostos.toFixed(2),
                ganhoLiquido: ganhoLiquido.toFixed(2),
                valorNotaCorretagem: valorNotaCorretagem.toFixed(2),
                saldoLiquidoTotal: runningSaldoLiquidoTotal.toFixed(2),
            };
        });

        setRows(updatedRows);

        const saldoFinalMes = updatedRows.reduce((acc, row) => acc + parseFloat(row.ganhoLiquido), 0);
        const resultadoLiquidoMes = updatedRows.reduce(
            (acc, row) => acc + parseFloat(row.saldoLiquidoTotal),
            0
        );

        const darfAPagar = saldoFinalMes > 0 ? saldoFinalMes * 0.2 : 0;

        setTotals({
            saldoFinalMes,
            resultadoLiquidoMes,
            rentabilidadeLiquida:
                (saldoFinalMes / (extractedData[0]?.capitalInicial || 1)) * 100,
            darfAPagar,
        });
    }, [extractedData]);

    const handleDelete = (id) => {
        const updatedData = extractedData.filter((row) => row.id !== id);
        setPdfData(updatedData);
    };

    const columns = [
        { field: "data", headerName: "Data" },
        { field: "valorDosNegocios", headerName: "Resultado Bruto", minWidth: 150 },
        { field: "totalDeCustosOperacionais", headerName: "Custos Totais", minWidth: 150  },
        { field: "irrfDayTradeProj", headerName: "IR na Fonte" },
        { field: "impostos", headerName: "ISS" },
        { field: "ganhoLiquido", headerName: "Ganho Líquido", minWidth: 150  },
        { field: "valorNotaCorretagem", headerName: "Valor Nota Corretagem", minWidth: 200 },
        { field: "saldoLiquidoTotal", headerName: "Saldo Líquido Total", minWidth: 150 },
        {
            field: "actions",
            headerName: "Ações",
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(params.row.id)}
                >
                    Deletar
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ padding: "4px" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={100}
            />

            <Box mt={4}>
                <Typography>
                    <strong>Saldo Final Líquido do Mês:</strong> R${" "}
                    {totals.saldoFinalMes.toFixed(2)}
                </Typography>
                <Typography>
                    <strong>Resultado Líquido do Mês:</strong> R${" "}
                    {totals.resultadoLiquidoMes.toFixed(2)}
                </Typography>
                <Typography>
                    <strong>Rentabilidade Líquida:</strong> {totals.rentabilidadeLiquida.toFixed(2)}%
                </Typography>
                <Typography>
                    <strong>DARF a Pagar:</strong> R$ {totals.darfAPagar.toFixed(2)}
                </Typography>
            </Box>
        </Box>
    );
};

SummaryTable.propTypes = {
    extractedData: PropTypes.arrayOf(
        PropTypes.shape({
            data: PropTypes.string.isRequired,
            valorDosNegocios: PropTypes.number.isRequired,
            totalDeCustosOperacionais: PropTypes.number.isRequired,
            irrfDayTradeProj: PropTypes.number.isRequired,
            impostos: PropTypes.number.isRequired,
            capitalInicial: PropTypes.number,
            id: PropTypes.string.isRequired,
        })
    ).isRequired,
    setPdfData: PropTypes.func.isRequired,
};

export default SummaryTable;
