import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Importação do PropTypes
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
} from "@mui/material";

const PlanilhaDayTrade = ({ extractedData }) => {
    const [rows, setRows] = useState([]);
    const [totals, setTotals] = useState({
        saldoFinalMes: 0,
        resultadoLiquidoMes: 0,
        rentabilidadeLiquida: 0,
        darfAPagar: 0,
    });

    useEffect(() => {
        const updatedRows = extractedData.map((row, index) => {
            const ganhoLiquido = row.valorDosNegocios + row.totalDeCustosOperacionais;
            const valorNotaCorretagem = ganhoLiquido + row.irrfDayTradeProj + row.impostos;
            const saldoLiquidoTotal =
                (index > 0 ? extractedData[index - 1]?.saldoLiquidoTotal : 0) +
                ganhoLiquido;

            return {
                ...row,
                ganhoLiquido,
                valorNotaCorretagem,
                saldoLiquidoTotal,
            };
        });
        setRows(updatedRows);

        const saldoFinalMes = updatedRows.reduce(
            (acc, row) => acc + row.ganhoLiquido,
            0
        );
        const resultadoLiquidoMes = updatedRows.reduce(
            (acc, row) => acc + row.saldoLiquidoTotal,
            0
        );

        const darfAPagar = saldoFinalMes > 0 ? -saldoFinalMes / 5 : 0;

        setTotals({
            saldoFinalMes,
            resultadoLiquidoMes,
            rentabilidadeLiquida:
                (saldoFinalMes / (extractedData[0]?.capitalInicial || 1)) * 100,
            darfAPagar,
        });
    }, [extractedData]);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h5" gutterBottom>
                Planilha Day Trade - Resumo
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Data</TableCell>
                            <TableCell>Resultado Bruto</TableCell>
                            <TableCell>Custos Totais</TableCell>
                            <TableCell>IR na Fonte</TableCell>
                            <TableCell>ISS</TableCell>
                            <TableCell>Ganho Líquido</TableCell>
                            <TableCell>Valor Nota Corretagem</TableCell>
                            <TableCell>Saldo Líquido Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.data}</TableCell>
                                <TableCell>{row.valorDosNegocios.toFixed(2)}</TableCell>
                                <TableCell>{row.totalDeCustosOperacionais.toFixed(2)}</TableCell>
                                <TableCell>{row.irrfDayTradeProj.toFixed(2)}</TableCell>
                                <TableCell>{row.impostos.toFixed(2)}</TableCell>
                                <TableCell>{row.ganhoLiquido.toFixed(2)}</TableCell>
                                <TableCell>
                                    {row.valorNotaCorretagem.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    {row.saldoLiquidoTotal.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
                    <strong>Rentabilidade Líquida:</strong>{" "}
                    {totals.rentabilidadeLiquida.toFixed(2)}%
                </Typography>
                <Typography>
                    <strong>DARF a Pagar:</strong> R$ {totals.darfAPagar.toFixed(2)}
                </Typography>
            </Box>
        </Box>
    );
};

// Definição de PropTypes para validação das propriedades
PlanilhaDayTrade.propTypes = {
    extractedData: PropTypes.arrayOf(
        PropTypes.shape({
            data: PropTypes.string.isRequired,
            valorDosNegocios: PropTypes.number.isRequired,
            totalDeCustosOperacionais: PropTypes.number.isRequired,
            irrfDayTradeProj: PropTypes.number.isRequired,
            impostos: PropTypes.number.isRequired,
            capitalInicial: PropTypes.number,
            saldoLiquidoTotal: PropTypes.any
        })
    ).isRequired,
};


export default PlanilhaDayTrade;
