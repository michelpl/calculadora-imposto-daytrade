// Função para calcular o valor do DARF assumindo apenas Day Trade e com dados extraídos
const Calculate = (notas) => {
    // Agrupamento por mês
    const transacoesPorMes = {};
    notas.forEach((nota) => {
      const {
        data,
        ajusteDayTrade,
        irrfDayTradeProj,
      } = nota;
  
      const mesAno = new Date(data.split("/").reverse().join("-")).toISOString().slice(0, 7); // Formato YYYY-MM
  
      if (!transacoesPorMes[mesAno]) {
        transacoesPorMes[mesAno] = { lucroTotal: 0, irrfTotal: 0 };
      }
  
      transacoesPorMes[mesAno].lucroTotal += ajusteDayTrade;
      transacoesPorMes[mesAno].irrfTotal += irrfDayTradeProj || 0;
    });
  
    // Cálculo do imposto devido
    const darfPorMes = Object.entries(transacoesPorMes).map(([mesAno, valores]) => {
      const imposto = valores.lucroTotal > 0 ? valores.lucroTotal * 0.20 : 0;
  
      // Ajustar pelo IRRF já retido
      const darf = Math.max(0, imposto - valores.irrfTotal);
  
      return {
        mesAno,
        imposto: imposto.toFixed(2),
        irrfTotal: valores.irrfTotal.toFixed(2),
        darf: darf.toFixed(2),
      };
    });
  
    return darfPorMes;
  };

  export { Calculate };
