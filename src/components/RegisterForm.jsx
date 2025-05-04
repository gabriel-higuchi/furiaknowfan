import React, { useState } from 'react';
import '../styles/RegisterFormStyle.css';
import { Navigate } from 'react-router-dom';


function RegisterForm() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const [redirect, setRedirect] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (form.senha !== form.confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }
  
    try {
      const payload = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha
      };
  
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar');
      }
      alert("Usuário registrado com sucesso!");
      setRedirect(true);

      // Redirecionar ou limpar o formulário
    } catch (err) {
      console.error('Erro detalhado:', err);
      alert(err.message || "Erro ao registrar. Por favor, tente novamente.");
    }
  };
  if (redirect) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Registro FURIA Fan</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="nome" placeholder="Nome Completo" value={form.nome} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="password" name="senha" placeholder="Senha" value={form.senha} onChange={handleChange} required />
          <input type="password" name="confirmarSenha" placeholder="Confirme a Senha" value={form.confirmarSenha} onChange={handleChange} required />
          <button type="submit">Registrar</button>
        </form>
        <div className="register-footer">
          <p>Já tem uma conta? <a href="/login">Faça login</a></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
