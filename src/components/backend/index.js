const express = require('express');
const multer = require('multer');
const pool = require('./db');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt'); // ou bcryptjs
const PORT = process.env.PORT || 5000; // Usa a porta do ambiente ou 5000 como padrão

const app = express();
const upload = multer({ dest: 'uploads/' });
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
  try {
    // Verificar se o corpo da requisição está vazio
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Corpo da requisição vazio'
      });
    }

    const { nome, email, senha } = req.body;
    
    // Validação básica dos campos
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    // Verificar se email já existe
    const userExists = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1', 
      [email]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email já cadastrado' 
      });
    }

    // Inserir novo usuário (você deve hash a senha na prática!)
    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha) 
       VALUES ($1, $2, $3) RETURNING id`,
      [nome, email, senha]
    );

    res.json({ 
      success: true, 
      userId: result.rows[0].id 
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    res.status(500).json({
      success: false,
      message: 'Erro no servidor',
      error: err.message
    });
  }
});

app.post('/profile', upload.single('documentPhoto'), async (req, res) => {
  try {
    // Extrair dados do corpo da requisição
    const {
      userId,
      cpf,
      birthDate,
      phone,
      favoriteGame,
      favoriteTeam,
      favoritePlayer,
      yearsFollowingEsports,
      eventsAttended,
      merchPurchases
    } = req.body;

    // Parse dos dados que foram enviados como string JSON
    const address = JSON.parse(req.body.address);
    const socialMedia = JSON.parse(req.body.socialMedia);

    // Processar o caminho do documento se existir
    let documentPath = null;
    if (req.file) {
      documentPath = path.join('documents', `${userId}_${req.file.originalname}`);
      fs.renameSync(req.file.path, documentPath);
    }

    // Inserir todos os dados na tabela
    await pool.query(`
      INSERT INTO fan_profiles (
        user_id, cpf, birth_date, phone,
        address_street, address_number, address_complement, address_zipcode,
        favorite_game, favorite_team, favorite_player, years_following,
        events_attended, merch_purchases,
        twitter, instagram, steam, discord,
        document_path
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    `, [
      userId,
      cpf,
      birthDate,
      phone,
      address.street,    // Dados do endereço
      address.number,
      address.complement,
      address.zipCode,
      favoriteGame,      // Dados de esports
      favoriteTeam,
      favoritePlayer,
      yearsFollowingEsports,
      eventsAttended,
      merchPurchases,
      socialMedia.twitter,  // Redes sociais
      socialMedia.instagram,
      socialMedia.steam,
      socialMedia.discord,
      documentPath       // Documento
    ]);

    res.json({ success: true, userId });
  } catch (err) {
    console.error('Erro ao salvar perfil:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Erro ao salvar perfil',
      error: err.message 
    });
  }
});
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.json({ success: false, message: 'Usuário não encontrado' });
    }

    const user = result.rows[0];

    // Comparar a senha fornecida com a senha armazenada (sem criptografia)
    if (senha !== user.senha) {
      return res.json({ success: false, message: 'Senha incorreta' });
    }

    res.json({ success: true, message: 'Login bem-sucedido', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });

  }
});



app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

