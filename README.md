# Safari das Fotos - Sophia

Sistema de upload e visualização de fotos com tema Safari Infantil.

## Tecnologias

- **Backend**: NestJS
- **Frontend**: React + Vite + Tailwind CSS
- **Banco de dados**: Supabase (Storage + Database)
- **Deploy**: Vercel

---

## Configuração do Supabase

### 1. Criar bucket de Storage

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Storage** > **New bucket**
3. Nome: `photos`
4. Marque **Public bucket**
5. Clique em **Create bucket**

### 2. Criar tabela no Database

1. Vá em **SQL Editor**
2. Execute o seguinte SQL:

```sql
-- Criar tabela de fotos
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS com políticas públicas
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública" ON photos
  FOR SELECT USING (true);

CREATE POLICY "Inserção pública" ON photos
  FOR INSERT WITH CHECK (true);
```

### 3. Obter a Anon Key

1. Vá em **Settings** > **API**
2. Copie a **anon public** key
3. Cole no arquivo `backend/.env`:

```
SUPABASE_URL=https://mmqmixlxesazjiyltswp.supabase.co
SUPABASE_KEY=sua_anon_key_aqui
```

---

## Rodando Localmente

### Backend

```bash
cd backend
npm install
npm run start:dev
```

O backend rodará em `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend rodará em `http://localhost:5173`

---

## Deploy no Vercel

### Backend

1. Crie um novo projeto no Vercel
2. Conecte o repositório
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Adicione as variáveis de ambiente:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

### Frontend

1. Crie outro projeto no Vercel
2. Conecte o mesmo repositório
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Adicione a variável de ambiente:
   - `VITE_API_URL` = URL do backend no Vercel

---

## Estrutura do Projeto

```
sophia_photos/
├── backend/           # API NestJS
│   ├── src/
│   │   ├── photos/   # Módulo de fotos
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── frontend/          # React App
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/photos/upload` | Upload de múltiplas fotos |
| GET | `/photos` | Listar todas as fotos |
