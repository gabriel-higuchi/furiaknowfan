import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // importação
import '../styles/LoginFormStyle.css';

function LoginForm() {
  const navigate = useNavigate(); // hook para navegação
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();
    if (data.success) {
      // Redirecionar para a rota desejada
      navigate('/profile', { state: { profileData: data.profile } });
    } else {
      console.log(senha);
      alert("Credenciais inválidas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login FURIA Fan</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>
        <div className="login-footer">
          <p>Não tem uma conta? <a href="/register">Cadastre-se</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
