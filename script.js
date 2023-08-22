const historyList = document.getElementById('history-list');

  function createHistoryItem(type, data) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    const timestamp = new Date().toLocaleString();

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Deletar';
    deleteButton.addEventListener('click', () => {
      historyItem.remove();
    });

    historyItem.innerHTML = `
      <div>${type} - ${timestamp}</div>
      <div>
        <p>Valor em reais: ${data.valorReais || '-'}</p>
        <p>Preço da moeda: ${data.precoMoeda || '-'}</p>
        <p>Quantidade de moedas: ${data.quantidadeMoedas || '-'}</p>
        <p>Taxa: ${data.taxa || '-'}</p>
        <p>Quantidade de unidades compradas: ${data.quantidadeUnidadesCompradas || '-'}</p>
        <p>Total em reais: ${data.totalReais || '-'}</p>
        <p>Valor final a sacar: ${data.valorFinalSaque || '-'}</p>
      </div>
    `;

    historyItem.appendChild(deleteButton);
    return historyItem;
  }

  function updateCompraCalculations() {
    const valorReais = parseFloat(document.getElementById('valor-reais').value);
    const precoMoeda = parseFloat(document.getElementById('preco-moeda').value);
    const quantidadeMoedas = valorReais / precoMoeda;
    const taxaCompra = parseFloat(document.getElementById('taxa-compra').value);
    const quantidadeUnidadesCompradas = quantidadeMoedas - (quantidadeMoedas * (taxaCompra / 100));

    document.getElementById('quantidade-moedas').textContent = quantidadeMoedas.toFixed(2);
    document.getElementById('quantidade-unidades-compradas').textContent = quantidadeUnidadesCompradas.toFixed(2);
  }

  function updateVendaCalculations() {
    const quantidadeMoedasVenda = parseFloat(document.getElementById('quantidade-moedas-venda').value);
    const precoMoedaVenda = parseFloat(document.getElementById('preco-moeda-venda').value);
    const totalReais = quantidadeMoedasVenda * precoMoedaVenda;
    const taxaVenda = parseFloat(document.getElementById('taxa-venda').value);
    const valorFinalSaque = totalReais - (totalReais * (taxaVenda / 100));

    document.getElementById('total-reais').textContent = totalReais.toFixed(2);
    document.getElementById('valor-final-sacar').textContent = valorFinalSaque.toFixed(2);
  }

  function saveToLocalStorage(type, historyItemData) {
  const savedHistory = JSON.parse(localStorage.getItem('history')) || [];
  const timestamp = new Date().toISOString(); // Usando a data atual como identificador único
  const historyItem = {
    type,
    timestamp,
    data: historyItemData,
  };
  savedHistory.push(historyItem);
  localStorage.setItem('history', JSON.stringify(savedHistory));
}

  function loadHistoryFromLocalStorage() {
    const savedHistory = JSON.parse(localStorage.getItem('history')) || [];
    savedHistory.forEach(item => {
      historyList.appendChild(createHistoryItem(item.type, item.data));
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
  loadHistoryFromLocalStorage();
});

  // Adicionar manipuladores de eventos para atualizar os cálculos em tempo real
  document.getElementById('valor-reais').addEventListener('input', updateCompraCalculations);
  document.getElementById('preco-moeda').addEventListener('input', updateCompraCalculations);
  document.getElementById('taxa-compra').addEventListener('input', updateCompraCalculations);

  document.getElementById('quantidade-moedas-venda').addEventListener('input', updateVendaCalculations);
  document.getElementById('preco-moeda-venda').addEventListener('input', updateVendaCalculations);
  document.getElementById('taxa-venda').addEventListener('input', updateVendaCalculations);


  document.getElementById('salvar-compra').addEventListener('click', () => {
    const valorReais = parseFloat(document.getElementById('valor-reais').value);
    const precoMoeda = parseFloat(document.getElementById('preco-moeda').value);
    const quantidadeMoedas = valorReais / precoMoeda;
    const taxaCompra = parseFloat(document.getElementById('taxa-compra').value);
    const quantidadeUnidadesCompradas = quantidadeMoedas - (quantidadeMoedas * (taxaCompra / 100));

    const historyItemData = {
      valorReais,
      precoMoeda,
      quantidadeMoedas,
      taxa: taxaCompra,
      quantidadeUnidadesCompradas
    };

    historyList.prepend(createHistoryItem('Compra', historyItemData));
  });

  document.getElementById('salvar-venda').addEventListener('click', () => {
    const quantidadeMoedasVenda = parseFloat(document.getElementById('quantidade-moedas-venda').value);
    const precoMoedaVenda = parseFloat(document.getElementById('preco-moeda-venda').value);
    const totalReais = quantidadeMoedasVenda * precoMoedaVenda;
    const taxaVenda = parseFloat(document.getElementById('taxa-venda').value);
    const valorFinalSaque = totalReais - (totalReais * (taxaVenda / 100));

    const historyItemData = {
      quantidadeMoedasVenda,
      precoMoedaVenda,
      totalReais,
      taxa: taxaVenda,
      valorFinalSaque
    };

    historyList.prepend(createHistoryItem('Venda', historyItemData));
  });