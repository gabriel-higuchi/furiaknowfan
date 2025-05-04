import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [documento, setDocumento] = useState('');
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  // Função para validar CPF
  const validarDocumento = async (documento) => {
    const token = '175176095szndKZukvF316275128';  // Substitua pela chave da sua conta

    try {
      // Remove caracteres não numéricos (pontos, traços)
      const cpfFormatado = documento.replace(/\D/g, '');

      if (cpfFormatado.length !== 11) {
        setErro('CPF inválido. Certifique-se de que tenha 11 dígitos.');
        return;
      }

      // Consulta o CPF na API
      const response = await axios.get(`https://www.receitaws.com.br/v1/cpf/${cpfFormatado}?token=${token}`);
      
      // Verifica se o retorno da API foi bem-sucedido
      if (response.data && response.data.status === 'OK') {
        setResultado(response.data);
        setErro('');
      } else {
        setResultado(null);
        setErro('CPF não encontrado ou inválido.');
      }
    } catch (err) {
      setResultado(null);
      setErro('Erro ao validar o documento.');
    }
  };

  // Função para tratar o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    if (documento) {
      validarDocumento(documento);
    }
  };

  return (
    <div>
      <h1>Validação de CPF</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={documento}
          onChange={(e) => setDocumento(e.target.value)}
          placeholder="Digite o CPF"
        />
        <button type="submit">Validar</button>
      </form>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {resultado && (
        <div>
          <h3>Resultado da Validação:</h3>
          <pre>{JSON.stringify(resultado, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
