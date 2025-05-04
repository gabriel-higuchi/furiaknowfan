import React, { useState, useEffect } from 'react';
import '../styles/ProfilePageStyle.css';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
  const navigate = useNavigate();
  // Dados pessoais
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    zipCode: ''
  });
  
  // Informações de esports
  const [favoriteGame, setFavoriteGame] = useState('');
  const [favoriteTeam, setFavoriteTeam] = useState('');
  const [favoritePlayer, setFavoritePlayer] = useState('');
  const [yearsFollowingEsports, setYearsFollowingEsports] = useState('');
  const [eventsAttended, setEventsAttended] = useState('');
  const [merchPurchases, setMerchPurchases] = useState('');
  
  // Documentos
  const [idPhoto, setIdPhoto] = useState(null);
  const [idPhotoPreview, setIdPhotoPreview] = useState('');
  
  // Redes sociais
  const [socialMedia, setSocialMedia] = useState({
    twitter: '',
    instagram: '',
    steam: '',
    discord: ''
  });

  // Estado do modal e validações
  const [showAdditionalInfoModal, setShowAdditionalInfoModal] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [cpfStatus, setCpfStatus] = useState(null);

  // Cálculo da completude do perfil
  useEffect(() => {
    const fieldsToCheck = [
      { value: cpf, required: true },
      { value: birthDate, required: true },
      { value: phone, required: true },
      { value: address.street, required: true },
      { value: address.number, required: true },
      { value: address.zipCode, required: true },
      { value: favoriteGame, required: true },
      { value: favoriteTeam, required: true },
      { value: favoritePlayer, required: false },
      { value: yearsFollowingEsports, required: true },
      { value: eventsAttended, required: false },
      { value: merchPurchases, required: false },
      { value: idPhoto, required: true },
      { value: socialMedia.twitter || socialMedia.instagram, required: true },
      { value: socialMedia.steam || socialMedia.discord, required: false }
    ];

    const totalRequiredFields = 10; // Atualizado com os campos obrigatórios
    let completedRequiredFields = 0;
    
    const totalOptionalFields = 5; // Atualizado com os campos opcionais
    let completedOptionalFields = 0;

    fieldsToCheck.forEach(field => {
      if (field.value && field.required) {
        completedRequiredFields++;
      } else if (field.value && !field.required) {
        completedOptionalFields++;
      }
    });

    const completionPercentage = Math.round(
      ((completedRequiredFields / totalRequiredFields) * 0.7 + 
       (completedOptionalFields / totalOptionalFields) * 0.3) * 100
    );

    setProfileCompletion(Math.min(100, completionPercentage));
  }, [cpf, birthDate, phone, address, favoriteGame, favoriteTeam, favoritePlayer, 
      yearsFollowingEsports, eventsAttended, merchPurchases, idPhoto, socialMedia]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setSocialMedia(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Por favor, faça login primeiro");
      return;
    }
  
    // Criar FormData para enviar arquivos e dados
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('cpf', cpf);
    formData.append('birthDate', birthDate);
    formData.append('phone', phone);
    
    // Endereço como objeto JSON stringify
    formData.append('address', JSON.stringify({
      street: address.street,
      number: address.number,
      complement: address.complement,
      zipCode: address.zipCode
    }));
    
    // Dados de esports
    formData.append('favoriteGame', favoriteGame);
    formData.append('favoriteTeam', favoriteTeam);
    formData.append('favoritePlayer', favoritePlayer);
    formData.append('yearsFollowingEsports', yearsFollowingEsports);
    formData.append('eventsAttended', eventsAttended);
    formData.append('merchPurchases', merchPurchases);
    
    // Redes sociais como objeto JSON stringify
    formData.append('socialMedia', JSON.stringify({
      twitter: socialMedia.twitter,
      instagram: socialMedia.instagram,
      steam: socialMedia.steam,
      discord: socialMedia.discord
    }));
    
    // Foto do documento (se existir)
    if (idPhoto) {
      formData.append('documentPhoto', idPhoto);
    }
  
    try {
      const response = await fetch('http://localhost:5000/profile', {
        method: 'POST',
        body: formData
      });
  
      const data = await response.json();
      
      if (response.ok) {
        navigate('/chat-analysis', {
          state: {
            profileData: {
              favoriteGame,
              favoriteTeam,
              favoritePlayer,
              yearsFollowingEsports
            }
          }
        });
      } else {
        alert("Erro ao salvar perfil: " + (data.message || "Erro desconhecido"));
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro ao conectar com o servidor");
    }
  };
  const verificarCPF = () => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      setCpfStatus('CPF inválido. Deve conter 11 dígitos.');
      return;
    }

    const todosDigitosIguais = /^(\d)\1{10}$/.test(cpfLimpo);
    if (todosDigitosIguais) {
      setCpfStatus('CPF inválido. Dígitos repetidos.');
      return;
    }

    const calcDigito = (base) => {
      let soma = 0;
      for (let i = 0; i < base.length; i++) {
        soma += parseInt(base[i]) * (base.length + 1 - i);
      }
      let resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    const digito1 = calcDigito(cpfLimpo.slice(0, 9));
    const digito2 = calcDigito(cpfLimpo.slice(0, 9) + digito1);

    if (
      parseInt(cpfLimpo[9]) === digito1 &&
      parseInt(cpfLimpo[10]) === digito2
    ) {
      setCpfStatus('CPF válido!');
    } else {
      setCpfStatus('CPF inválido.');
    }
  };
  const getCompletionBarClass = () => {
    if (profileCompletion < 30) return 'low';
    if (profileCompletion < 70) return 'medium';
    return 'high';
  };

    
    // Criar linha de valores (escapando aspas e quebras de linha

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Meu Perfil de Fã de Esports</h1>
        <div className="completion-bar-container">
          <div className="completion-bar">
            <div 
              className={`completion-fill ${getCompletionBarClass()}`}
              style={{ width: `${profileCompletion}%` }}
              aria-valuenow={profileCompletion}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <span className="completion-text">{profileCompletion}% completo</span>
          <div className="completion-tooltip">
            {profileCompletion < 30 && "Comece a preencher seu perfil para ganhar benefícios!"}
            {profileCompletion >= 30 && profileCompletion < 70 && "Continue, você está no caminho certo!"}
            {profileCompletion >= 70 && profileCompletion < 100 && "Perfil quase completo!"}
            {profileCompletion === 100 && "Perfil completo! Ótimo trabalho!"}
          </div>
        </div>
      </div>

      <div className="profile-content">
        <form onSubmit={handleSubmit}>
          <section className="profile-section">
            <h2>Informações Pessoais</h2>
            <div className="form-group">
              <label>CPF</label>
              <div className="cpf-verification">
                <input 
                  type="text" 
                  value={cpf} 
                  onChange={(e) => setCpf(e.target.value)} 
                  required 
                  placeholder="000.000.000-00"
                />
                <button type="button" onClick={verificarCPF} className="verify-button">Verificar</button>
              </div>
              {cpfStatus && <p className={`cpf-status ${cpfStatus.includes('válido') ? 'valid' : 'invalid'}`}>{cpfStatus}</p>}
            </div>
            <div className="form-group">
              <label>Data de Nascimento</label>
              <input 
                type="date" 
                value={birthDate} 
                onChange={(e) => setBirthDate(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Telefone/Celular</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="form-group">
              <label>Rua</label>
              <input 
                type="text" 
                value={address.street} 
                onChange={(e) => setAddress({ ...address, street: e.target.value })} 
                required 
                placeholder="Nome da rua"
              />
            </div>

            <div className="form-group">
              <label>Número</label>
              <input 
                type="text" 
                value={address.number} 
                onChange={(e) => setAddress({ ...address, number: e.target.value })} 
                required 
                placeholder="Número do imóvel"
              />
            </div>

            <div className="form-group">
              <label>Complemento</label>
              <input 
                type="text" 
                value={address.complement} 
                onChange={(e) => setAddress({ ...address, complement: e.target.value })} 
                placeholder="Ex: Apto 101"
              />
            </div>

            <div className="form-group">
              <label>CEP</label>
              <input 
                type="text" 
                value={address.zipCode} 
                onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} 
                required 
                placeholder="CEP"
              />
            </div>
          </section>

          <section className="profile-section">
            <h2>Meu Perfil de Fã</h2>
            <div className="form-group">
              <label>Jogo Preferido</label>
              <select 
                value={favoriteGame} 
                onChange={(e) => setFavoriteGame(e.target.value)}
                required
              >
                <option value="">Selecione seu jogo favorito</option>
                <option value="CS2">Counter-Strike: Global Offensive</option>
                <option value="LOL">League of Legends</option>
                <option value="DOTA2">Dota 2</option>
                <option value="VALORANT">Valorant</option>
                <option value="FORTNITE">Fortnite</option>
                <option value="RAINBOW6">Rainbow Six Siege</option>
                <option value="FIFA">FIFA/EA Sports FC</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>
            <div className="form-group">
              <label>Equipe que Torce</label>
              <input 
                type="text" 
                value={favoriteTeam} 
                onChange={(e) => setFavoriteTeam(e.target.value)} 
                required 
                placeholder="Ex: FURIA, LOUD, paiN Gaming"
              />
            </div>
            <div className="form-group">
              <label>Jogador Favorito</label>
              <input 
                type="text" 
                value={favoritePlayer} 
                onChange={(e) => setFavoritePlayer(e.target.value)} 
                placeholder="Ex: Fallen, Taco, KSCERATO"
              />
            </div>
            <div className="form-group">
              <label>Há quantos anos acompanha esports?</label>
              <input 
                type="number" 
                value={yearsFollowingEsports} 
                onChange={(e) => setYearsFollowingEsports(e.target.value)} 
                min="0" 
                max="50"
                required
              />
            </div>
            <div className="form-group">
              <label>Eventos que Participou (último ano)</label>
              <textarea 
                value={eventsAttended} 
                onChange={(e) => setEventsAttended(e.target.value)} 
                placeholder="Liste os eventos de esports que você participou no último ano" 
              />
            </div>
            <div className="form-group">
              <label>Compras de Produtos/Merchandising (último ano)</label>
              <textarea 
                value={merchPurchases} 
                onChange={(e) => setMerchPurchases(e.target.value)} 
                placeholder="Descreva produtos relacionados a esports que você comprou no último ano" 
              />
            </div>
          </section>

          <section className="profile-section">
            <h2>Redes Sociais e Perfis</h2>
            <div className="form-group">
              <label>Twitter (X)</label>
              <input 
                type="text" 
                name="twitter" 
                value={socialMedia.twitter} 
                onChange={handleSocialMediaChange} 
                placeholder="@seuuser" 
              />
            </div>
            <div className="form-group">
              <label>Instagram</label>
              <input 
                type="text" 
                name="instagram" 
                value={socialMedia.instagram} 
                onChange={handleSocialMediaChange} 
                placeholder="@seuuser" 
              />
            </div>
            <div className="form-group">
              <label>Steam</label>
              <input 
                type="text" 
                name="steam" 
                value={socialMedia.steam} 
                onChange={handleSocialMediaChange} 
                placeholder="URL do seu perfil Steam" 
              />
            </div>
            <div className="form-group">
              <label>Discord</label>
              <input 
                type="text" 
                name="discord" 
                value={socialMedia.discord} 
                onChange={handleSocialMediaChange} 
                placeholder="usuário#0000" 
              />
            </div>
          </section>

          <section className="profile-section">
            <h2>Verificação de Identidade</h2>
            <div className="form-group">
              <label>Foto do Documento (RG ou CNH)</label>
              <div className="file-upload">
                {idPhotoPreview ? (
                  <div className="id-preview">
                    <img src={idPhotoPreview} alt="Preview do documento" />
                    <button 
                      type="button" 
                      onClick={() => {
                        setIdPhoto(null);
                        setIdPhotoPreview('');
                      }}
                      className="change-photo-button"
                    >
                      Trocar Imagem
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="file-upload-label">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        required 
                      />
                      <span className="file-upload-button">Selecionar Arquivo</span>
                    </label>
                    <p className="file-upload-hint">Envie uma foto legível do seu documento de identificação</p>
                  </>
                )}
              </div>
            </div>
          </section>

          <button type="submit" className="save-button">
          Salvar Perfil e Ir para o Chat
          </button>
        </form>
      </div>
      

      {showAdditionalInfoModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Complete seu perfil de fã!</h2>
            <p>
              Para oferecermos a melhor experiência e conteúdos exclusivos, precisamos 
              conhecer melhor seus interesses no mundo de esports.
            </p>
            <ul>
              <li>Informe seus jogos e times favoritos</li>
              <li>Compartilhe sua experiência com esports</li>
              <li>Vincule suas redes sociais para personalizarmos seu conteúdo</li>
              <li>Envie uma foto do seu documento para verificação</li>
            </ul>
            <p>
              Perfis completos recebem benefícios exclusivos como:
              <br />
              - Descontos em ingressos e produtos
              <br />
              - Acesso antecipado a conteúdos
              <br />
              - Participação em sorteios exclusivos
            </p>
            <button 
              onClick={() => setShowAdditionalInfoModal(false)}
              className="modal-close"
            >
              Entendi, vou completar agora!
            </button>
          </div>
        </div>
      )}

      {profileCompletion < 70 && (
        <button 
          onClick={() => setShowAdditionalInfoModal(true)}
          className="floating-help-button"
        >
          Complete seu perfil!
        </button>
      )}
    </div>
  );
}

export default ProfilePage;