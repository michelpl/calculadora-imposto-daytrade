function extractTableData(text) {
    console.log(text);
    const regex =
        /Data pregão\s+(\d{2}\/\d{2}\/\d{4}).*Valor dos negócios\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+.*Taxas BM&F \(emol\+f\.gar\)\s+(\d+\.*\d*,\d+)\|\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+\|.*Total de custos operacionais\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+\|\s+(\d+\.*\d*,\d+)\s+\|.*(\d+\.*\d*,\d+)\s+.*Total líquido da nota\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\s+(\d+\.*\d*,\d+)\|\s+(\d+\.*\d*,\d+)\s+\| .*(\d*\.*\d+,\d{2})\s\|.*\s+(\d*\.*\d+,\d{2})\s/g;
    
    const matches = [...text.matchAll(regex)];

    return matches.map((match) => ({
        data: match[1],
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

export { extractTableData };
