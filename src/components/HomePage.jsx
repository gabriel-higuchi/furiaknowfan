import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate para navegação
import '../styles/HomePageStyle.css';

function HomePage() {
  const navigate = useNavigate(); // Hook de navegação

  // Função que será chamada quando o botão for clicado
  const handleNavigateToRegister = () => {
    navigate('/register'); // Navega para a página de registro
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="title">Bem-vindo ao FURIA Fan</h1>
        <p className="subtitle">Conecte-se com sua paixão pelo eSports.</p>
        <p className="description">
          Junte-se à nossa comunidade e acompanhe as últimas novidades, estatísticas e muito mais.
        </p>
        <button className="cta-button" onClick={handleNavigateToRegister}>
          Criar Conta
        </button>
        <p className="login-subtitle">
          Já tem uma conta? <a href="/login" className="login-link">Faça login</a>
        </p>
      </div>
    </div>
  );
}

export default HomePage;
