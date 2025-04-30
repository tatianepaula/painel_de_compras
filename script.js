
// Script para o Painel de Gestão de Compras
const btnBuscar = document.getElementById('btnBuscar');
btnBuscar.addEventListener('click', function() {
  // Obter valores dos filtros
  const idSolicitacao = document.getElementById('idSolicitacao').value.toLowerCase();
  const centroCusto = document.getElementById('centroCusto').value;
  const natureza = document.getElementById('natureza').value;
  const unidade = document.getElementById('unidade').value;
  const urgencia = document.getElementById('urgencia').value;
  const status = document.getElementById('status').value;
  const tipoCompra = document.getElementById('tipoCompra').value;
  const dataInicio = document.getElementById('dataInicio').value;
  const dataFim = document.getElementById('dataFim').value;
  
  // Filtrar a tabela
  const rows = document.querySelectorAll('#app table tbody tr');
  
  rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const rowId = cells[0].textContent.toLowerCase();
      const rowData = cells[1].textContent;
      const rowDepartamento = cells[2].textContent;
      const rowSolicitante = cells[3].textContent;
      const rowUrgencia = cells[4].querySelector('span').textContent.toLowerCase();
      const rowStatus = cells[5].querySelector('span').textContent.toLowerCase();
      
      // Verificar filtros
      const idMatch = !idSolicitacao || rowId.includes(idSolicitacao);
      const urgenciaMatch = !urgencia || rowUrgencia.includes(urgencia);
      const statusMatch = !status || rowStatus.includes(status);
      
      // Verificar se a data está dentro do intervalo (se filtros de data foram preenchidos)
      let dataMatch = true;
      if (dataInicio && dataFim) {
          const rowDate = new Date(rowData.split('/').reverse().join('-'));
          const startDate = new Date(dataInicio);
          const endDate = new Date(dataFim);
          dataMatch = rowDate >= startDate && rowDate <= endDate;
      }
      
      // Mostrar/ocultar linha baseado nos filtros
      row.style.display = (idMatch && urgenciaMatch && statusMatch && dataMatch) ? '' : 'none';
  });
  
  alert('Filtros aplicados com sucesso!');
});

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização de variáveis globais
    let produtos = [];
    let fornecedores = [];
    let produtoIdCounter = 1;
    let fornecedorIdCounter = 1;
  
    // Referências dos elementos DOM
    const btnAdicionarProduto = document.getElementById('btnAdicionarProduto');
    const btnConfirmarProduto = document.getElementById('btnConfirmarProduto');
    const btnAdicionarFornecedor = document.getElementById('btnAdicionarFornecedor');
    const btnConfirmarFornecedor = document.getElementById('btnConfirmarFornecedor');
    const btnBuscarFornecedor = document.getElementById('buscarFornecedor');
    const btnSalvarSolicitacao = document.getElementById('btnSalvarSolicitacao');
    
    const produtosTableBody = document.getElementById('produtosTableBody');
    const noProdutos = document.getElementById('noProdutos');
    const fornecedoresContainer = document.getElementById('fornecedoresContainer');
    const noFornecedores = document.getElementById('noFornecedores');
    
    // Event Listeners
    
    // Mostrar/esconder campo de justificativa baseado na urgência
    window.toggleJustificativa = function() {
      const urgenciaCompra = document.getElementById('urgenciaCompra');
      const justificativaContainer = document.getElementById('justificativaContainer');
      const justificativa = document.getElementById('justificativa');
      
      if (urgenciaCompra.value === 'alta') {
        justificativaContainer.classList.remove('d-none');
        justificativa.setAttribute('required', 'required');
      } else {
        justificativaContainer.classList.add('d-none');
        justificativa.removeAttribute('required');
      }
    };
    
    // Evento para abrir o modal de adicionar produto
    btnAdicionarProduto.addEventListener('click', function() {
      const adicionarProdutoModal = new bootstrap.Modal(document.getElementById('adicionarProdutoModal'));
      adicionarProdutoModal.show();
    });
    
    // Evento para confirmar adição de produto
    btnConfirmarProduto.addEventListener('click', function() {
      const produtoSelect = document.getElementById('produtoSelect');
      const tipoProduto = document.getElementById('tipoProduto');
      const unidadeProduto = document.getElementById('unidadeProduto');
      const quantidadeProduto = document.getElementById('quantidadeProduto');
      
      // Validação básica
      if (!produtoSelect.value || !tipoProduto.value || !unidadeProduto.value || !quantidadeProduto.value) {
        alert('Por favor, preencha todos os campos.');
        return;
      }
      
      // Criar novo produto
      const novoProduto = {
        id: produtoIdCounter++,
        produtoId: produtoSelect.value,
        nomeProduto: produtoSelect.options[produtoSelect.selectedIndex].text,
        tipo: tipoProduto.value,
        tipoTexto: tipoProduto.options[tipoProduto.selectedIndex].text,
        unidade: unidadeProduto.value,
        quantidade: parseInt(quantidadeProduto.value)
      };
      
      // Adicionar à lista de produtos
      produtos.push(novoProduto);
      
      // Atualizar tabela de produtos
      atualizarTabelaProdutos();
      
      // Resetar formulário e fechar modal
      document.getElementById('adicionarProdutoForm').reset();
      bootstrap.Modal.getInstance(document.getElementById('adicionarProdutoModal')).hide();
    });
    
    // Evento para abrir o modal de adicionar fornecedor
    btnAdicionarFornecedor.addEventListener('click', function() {
      if (produtos.length === 0) {
        alert('Por favor, adicione pelo menos um produto antes de adicionar fornecedores.');
        return;
      }
      
      const adicionarFornecedorModal = new bootstrap.Modal(document.getElementById('adicionarFornecedorModal'));
      adicionarFornecedorModal.show();
    });
    
    // Evento para buscar fornecedor pelo CNPJ
    btnBuscarFornecedor.addEventListener('click', function() {
      const cnpjFornecedor = document.getElementById('cnpjFornecedor').value;
      
      if (!cnpjFornecedor) {
        alert('Por favor, informe o CNPJ do fornecedor.');
        return;
      }
      
      // Simular busca de fornecedor (em uma aplicação real, isso seria uma chamada de API)
      buscarFornecedorAPI(cnpjFornecedor);
    });
    
    // Evento para confirmar adição de fornecedor
    btnConfirmarFornecedor.addEventListener('click', function() {
      const dadosFornecedor = document.getElementById('dadosFornecedor');
      
      if (dadosFornecedor.classList.contains('d-none')) {
        alert('Por favor, busque o fornecedor pelo CNPJ primeiro.');
        return;
      }
      
      // Validação básica dos campos de cotação
      const formaPagamento = document.getElementById('formaPagamento');
      const dataVencimentoCotacao = document.getElementById('dataVencimentoCotacao');
      const prazoEntrega = document.getElementById('prazoEntrega');
      
      if (!formaPagamento.value || !dataVencimentoCotacao.value || !prazoEntrega.value) {
        alert('Por favor, preencha todos os campos obrigatórios da cotação.');
        return;
      }
      
      // Validar que todos os produtos têm valores informados
      const produtosValidos = validarValoresProdutos();
      if (!produtosValidos) {
        alert('Por favor, informe o valor unitário para todos os produtos.');
        return;
      }
      
      // Criar objeto fornecedor
      const novoFornecedor = {
        id: fornecedorIdCounter++,
        cnpj: document.getElementById('cnpjFornecedor').value,
        nomeFantasia: document.getElementById('nomeFantasia').value,
        razaoSocial: document.getElementById('razaoSocial').value,
        endereco: document.getElementById('enderecoFornecedor').value,
        email: document.getElementById('emailFornecedor').value,
        telefone: document.getElementById('telefoneFornecedor').value,
        formaPagamento: formaPagamento.value,
        formaPagamentoTexto: formaPagamento.options[formaPagamento.selectedIndex].text,
        numeroParcelas: parseInt(document.getElementById('numeroParcelas').value),
        valorParcela: document.getElementById('valorParcela').value,
        dataVencimento: dataVencimentoCotacao.value,
        prazoEntrega: parseInt(prazoEntrega.value),
        outrasInformacoes: document.getElementById('outrasInformacoes').value,
        vencedor: document.getElementById('fornecedorVencedor').checked,
        produtos: obterProdutosCotacao(),
        valorTotal: calcularValorTotalCotacao()
      };
      
      // Adicionar à lista de fornecedores
      fornecedores.push(novoFornecedor);
      
      // Atualizar lista de fornecedores
      atualizarListaFornecedores();
      
      // Resetar formulário e fechar modal
      document.getElementById('adicionarFornecedorForm').reset();
      dadosFornecedor.classList.add('d-none');
      bootstrap.Modal.getInstance(document.getElementById('adicionarFornecedorModal')).hide();
    });
    
    // Evento para salvar a solicitação completa
    btnSalvarSolicitacao.addEventListener('click', function() {
      // Validação básica
      if (produtos.length === 0) {
        alert('Por favor, adicione pelo menos um produto à solicitação.');
        return;
      }
      
      if (fornecedores.length === 0) {
        alert('Por favor, adicione pelo menos um fornecedor à solicitação.');
        return;
      }
      
      // Verificar se tem pelo menos um fornecedor vencedor
      const temVencedor = fornecedores.some(fornecedor => fornecedor.vencedor);
      if (!temVencedor) {
        alert('Por favor, selecione pelo menos um fornecedor vencedor.');
        return;
      }
      
      // Validar o formulário principal
      const form = document.getElementById('novaSolicitacaoForm');
      if (!form.checkValidity()) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        form.reportValidity();
        return;
      }
      
      // Em uma aplicação real, aqui você enviaria os dados para o servidor
      // Simulando um envio bem-sucedido
      alert('Solicitação de compra criada com sucesso!');
      
      // Fechar o modal e limpar o formulário
      bootstrap.Modal.getInstance(document.getElementById('novaSolicitacaoModal')).hide();
      form.reset();
      produtos = [];
      fornecedores = [];
      atualizarTabelaProdutos();
      atualizarListaFornecedores();
    });
    
    // Evento para gerenciar as ações das tabelas
    document.addEventListener('click', function(event) {
      // Remover produto
      if (event.target.classList.contains('btn-remover-produto')) {
        const produtoId = parseInt(event.target.dataset.id);
        removerProduto(produtoId);
      }
      
      // Remover fornecedor
      if (event.target.classList.contains('btn-remover-fornecedor')) {
        const fornecedorId = parseInt(event.target.dataset.id);
        removerFornecedor(fornecedorId);
      }
      
      // Assumir tarefa
      if (event.target.classList.contains('btn-assumir') || event.target.parentElement.classList.contains('btn-assumir')) {
        const btn = event.target.classList.contains('btn-assumir') ? event.target : event.target.parentElement;
        const solicitacaoId = btn.dataset.id;
        assumirTarefa(solicitacaoId);
      }
    });
    
    // Evento para atualizar o valor das parcelas e o total da cotação
    document.addEventListener('input', function(event) {
      // Calcula valor total quando um valor unitário é informado
      if (event.target.classList.contains('valor-unitario-input')) {
        const row = event.target.closest('tr');
        const valorUnitario = parseFloat(event.target.value.replace(',', '.')) || 0;
        const quantidade = parseInt(row.dataset.quantidade) || 0;
        const valorTotal = valorUnitario * quantidade;
        
        const valorTotalElement = row.querySelector('.valor-total');
        valorTotalElement.textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
        
        // Atualizar valor total da cotação
        atualizarTotalCotacao();
      }
      
      // Atualiza número de parcelas quando o valor muda
      if (event.target.id === 'numeroParcelas') {
        atualizarValorParcela();
      }
    });
    
    // Funções auxiliares
    
    // Função para atualizar a tabela de produtos
    function atualizarTabelaProdutos() {
      produtosTableBody.innerHTML = '';
      
      if (produtos.length === 0) {
        noProdutos.classList.remove('d-none');
        return;
      }
      
      noProdutos.classList.add('d-none');
      
      produtos.forEach(produto => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${produto.nomeProduto}</td>
          <td>${produto.tipoTexto}</td>
          <td>${produto.unidade}</td>
          <td>${produto.quantidade}</td>
          <td>
            <button type="button" class="btn btn-sm btn-danger btn-remover-produto" data-id="${produto.id}">
              <i class="bi bi-trash"></i>
            </button>
          </td>
        `;
        produtosTableBody.appendChild(row);
      });
      
      // Atualizar produtos em fornecedores já adicionados
      atualizarProdutosFornecedores();
    }
    
    // Função para remover um produto
    function removerProduto(produtoId) {
      produtos = produtos.filter(p => p.id !== produtoId);
      atualizarTabelaProdutos();
    }
    
    // Função para atualizar a lista de fornecedores
    function atualizarListaFornecedores() {
      fornecedoresContainer.innerHTML = '';
      
      if (fornecedores.length === 0) {
        noFornecedores.classList.remove('d-none');
        return;
      }
      
      noFornecedores.classList.add('d-none');
      
      fornecedores.forEach(fornecedor => {
        const card = document.createElement('div');
        card.className = `card mb-3 fornecedor-card ${fornecedor.vencedor ? 'fornecedor-vencedor' : ''}`;
        
        let produtosHTML = '';
        fornecedor.produtos.forEach(p => {
          produtosHTML += `
            <tr>
              <td>${p.nomeProduto}</td>
              <td>${p.quantidade}</td>
              <td>R$ ${p.valorUnitario.toFixed(2).replace('.', ',')}</td>
              <td>R$ ${p.valorTotal.toFixed(2).replace('.', ',')}</td>
            </tr>
          `;
        });
        
        card.innerHTML = `
          <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0">
              ${fornecedor.nomeFantasia}
              ${fornecedor.vencedor ? '<span class="badge bg-success ms-2">Vencedor</span>' : ''}
            </h6>
            <button type="button" class="btn btn-sm btn-danger btn-remover-fornecedor" data-id="${fornecedor.id}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4 mb-2">
                <small class="fw-bold">CNPJ:</small>
                <p>${fornecedor.cnpj}</p>
              </div>
              <div class="col-md-4 mb-2">
                <small class="fw-bold">Forma de Pagamento:</small>
                <p>${fornecedor.formaPagamentoTexto}</p>
              </div>
              <div class="col-md-4 mb-2">
                <small class="fw-bold">Prazo de Entrega:</small>
                <p>${fornecedor.prazoEntrega} dias</p>
              </div>
            </div>
            
            <div class="table-responsive mt-2">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                    <th>Valor Unitário</th>
                    <th>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${produtosHTML}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" class="text-end fw-bold">Valor Total:</td>
                    <td class="fw-bold">R$ ${fornecedor.valorTotal.toFixed(2).replace('.', ',')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        `;
        
        fornecedoresContainer.appendChild(card);
      });
    }
    
    // Função para remover um fornecedor
    function removerFornecedor(fornecedorId) {
      fornecedores = fornecedores.filter(f => f.id !== fornecedorId);
      atualizarListaFornecedores();
    }
    
    // Função para simular busca de fornecedor por API
    function buscarFornecedorAPI(cnpj) {
      // Simulação de resposta de API (em uma aplicação real, isso seria uma chamada AJAX)
      setTimeout(() => {
        // Validação simplificada de CNPJ
        if (cnpj.length < 14) {
          alert('CNPJ inválido.');
          return;
        }
        
        // Dados mockados para demonstração
        const fornecedoresMock = {
          '12.345.678/0001-90': {
            nomeFantasia: 'ABC Tecnologia',
            razaoSocial: 'ABC Tecnologia e Serviços Ltda',
            endereco: 'Rua das Flores, 123 - Centro, São Paulo/SP',
            email: 'contato@abctech.com.br',
            telefone: '(11) 1234-5678'
          },
          '98.765.432/0001-10': {
            nomeFantasia: 'InfoSupply',
            razaoSocial: 'InfoSupply Comércio de Informática Ltda',
            endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo/SP',
            email: 'vendas@infosupply.com.br',
            telefone: '(11) 9876-5432'
          },
          '45.678.901/0001-23': {
            nomeFantasia: 'TechCorp',
            razaoSocial: 'TechCorp Soluções em TI Ltda',
            endereco: 'Av. Brasil, 500 - Jardins, São Paulo/SP',
            email: 'comercial@techcorp.com.br',
            telefone: '(11) 4567-8901'
          }
        };
        
        // Formatar CNPJ para busca
        const cnpjFormatado = cnpj.replace(/[^\d]/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        
        const fornecedorEncontrado = fornecedoresMock[cnpjFormatado] || fornecedoresMock[Object.keys(fornecedoresMock)[0]];
        
        if (fornecedorEncontrado) {
          // Preencher os campos com os dados do fornecedor
          document.getElementById('nomeFantasia').value = fornecedorEncontrado.nomeFantasia;
          document.getElementById('razaoSocial').value = fornecedorEncontrado.razaoSocial;
          document.getElementById('enderecoFornecedor').value = fornecedorEncontrado.endereco;
          document.getElementById('emailFornecedor').value = fornecedorEncontrado.email;
          document.getElementById('telefoneFornecedor').value = fornecedorEncontrado.telefone;
          
          // Exibir seção de dados do fornecedor
          document.getElementById('dadosFornecedor').classList.remove('d-none');
          
          // Atualizar lista de produtos na cotação
          atualizarProdutosCotacao();
        } else {
          alert('Fornecedor não encontrado.');
        }
      }, 500);
    }
    
    // Função para atualizar a tabela de produtos na cotação
    function atualizarProdutosCotacao() {
      const produtosFornecedorTableBody = document.getElementById('produtosFornecedorTableBody');
      produtosFornecedorTableBody.innerHTML = '';
      
      produtos.forEach(produto => {
        const row = document.createElement('tr');
        row.dataset.produtoId = produto.id;
        row.dataset.quantidade = produto.quantidade;
        row.innerHTML = `
          <td>${produto.nomeProduto}</td>
          <td>${produto.tipoTexto}</td>
          <td>${produto.unidade}</td>
          <td>${produto.quantidade}</td>
          <td>
            <input type="text" class="form-control form-control-sm valor-unitario-input" placeholder="0,00">
          </td>
          <td class="valor-total">R$ 0,00</td>
        `;
        produtosFornecedorTableBody.appendChild(row);
      });
    }
    
    // Função para atualizar produtos nos fornecedores já adicionados
    function atualizarProdutosFornecedores() {
      // Em uma implementação completa, você atualizaria os produtos em cada fornecedor
      // Isso é complexo e depende de como você quer tratar alterações na lista de produtos
      // Para manter simples, apenas atualizamos os produtos para novos fornecedores
    }
    
    // Função para obter os produtos com valores para a cotação
    function obterProdutosCotacao() {
      const rows = document.querySelectorAll('#produtosFornecedorTableBody tr');
      const produtosCotacao = [];
      
      rows.forEach(row => {
        const produtoId = parseInt(row.dataset.produtoId);
        const produto = produtos.find(p => p.id === produtoId);
        const valorUnitarioInput = row.querySelector('.valor-unitario-input');
        const valorUnitario = parseFloat(valorUnitarioInput.value.replace(',', '.')) || 0;
        const quantidade = parseInt(row.dataset.quantidade);
        const valorTotal = valorUnitario * quantidade;
        
        produtosCotacao.push({
          ...produto,
          valorUnitario: valorUnitario,
          valorTotal: valorTotal
        });
      });
      
      return produtosCotacao;
    }
    
    // Função para calcular o valor total da cotação
    function calcularValorTotalCotacao() {
      const produtosCotacao = obterProdutosCotacao();
      return produtosCotacao.reduce((total, produto) => total + produto.valorTotal, 0);
    }
    
    // Função para atualizar o total da cotação
    function atualizarTotalCotacao() {
      const valorTotal = calcularValorTotalCotacao();
      document.getElementById('valorTotalCotacao').textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
      
      // Atualizar valor da parcela
      atualizarValorParcela();
    }
    
    // Função para atualizar o valor da parcela
    function atualizarValorParcela() {
      const valorTotal = calcularValorTotalCotacao();
      const numeroParcelas = parseInt(document.getElementById('numeroParcelas').value) || 1;
      const valorParcela = valorTotal / numeroParcelas;
      
      document.getElementById('valorParcela').value = `R$ ${valorParcela.toFixed(2).replace('.', ',')}`;
    }
    
    // Função para validar se todos os produtos têm valores informados
    function validarValoresProdutos() {
      const valorInputs = document.querySelectorAll('.valor-unitario-input');
      let todosValidos = true;
      
      valorInputs.forEach(input => {
        const valor = parseFloat(input.value.replace(',', '.')) || 0;
        if (valor <= 0) {
          todosValidos = false;
        }
      });
      
      return todosValidos;
    }
    
    // Função para assumir tarefa
    function assumirTarefa(solicitacaoId) {
      // Em uma aplicação real, essa função faria uma chamada AJAX para atualizar o status da solicitação
      console.log(`Assumindo tarefa da solicitação ${solicitacaoId}`);
      alert(`Você assumiu a tarefa da solicitação #${solicitacaoId}`);
      
      // Para demonstração, vamos alterar o botão para indicar que a tarefa foi assumida
      const botoes = document.querySelectorAll(`.btn-assumir[data-id="${solicitacaoId}"]`);
      botoes.forEach(botao => {
        botao.classList.remove('btn-primary');
        botao.classList.add('btn-success');
        botao.innerHTML = '<i class="bi bi-check2-all"></i>';
        botao.title = 'Tarefa assumida';
        botao.disabled = true;
      });
    }
  });

  // Adicione este código no final do event listener 'DOMContentLoaded'

// Função de pesquisa na tabela
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function() {
  const searchTerm = normalizeText(this.value);
  const rows = document.querySelectorAll('#app table tbody tr');
  
  rows.forEach(row => {
      let found = false;
      const cells = row.querySelectorAll('td');
      
      cells.forEach(cell => {
          if (normalizeText(cell.textContent).includes(searchTerm)) {
              found = true;
          }
      });
      
      row.style.display = found ? '' : 'none';
  });
});

// Adicione também esta função para melhorar a pesquisa
function normalizeText(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}