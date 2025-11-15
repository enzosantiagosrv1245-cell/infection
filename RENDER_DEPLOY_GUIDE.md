# Guia de Deploy no Render

## Problema: Render não atualiza o código mesmo após git push

### Solução Rápida (99% dos casos)

#### 1. **Limpar Build Cache no Render**
- Acesse seu serviço no Render (https://dashboard.render.com)
- Clique em **Settings** (canto superior direito)
- Scroll até **Build Cache**
- Clique em **Clear Build Cache**
- Volte à aba **Deploys** e clique em **Deploy Latest Commit** manualmente

#### 2. **Verificar Configuração de Auto-Deploy**
- Em **Settings**, confirme que:
  - **Auto Deploy** está **ON** (ou acionado quando há push)
  - **Repository** aponta para o seu GitHub correto
  - **Branch** está setado para **main** (ou a branch que você usa)
  - **Build Command** é `npm install` (ou deixe vazio se package.json existe)
  - **Start Command** é `npm start` ✓

#### 3. **Força Reconexão Webhook GitHub → Render**
Se Auto Deploy ainda não funciona:
- No Render: **Settings → GitHub → Disconnect**
- Reconecte e selecione o repositório novamente
- GitHub → seu repo → **Settings → Webhooks → Delete** webhook do Render (se existir)
- Volte ao Render e reconecte

#### 4. **Deploy Manual Forçado**
Como último recurso:
```bash
# No seu computador/container:
git push origin main
# (já feito)

# No Render:
# 1. Settings → Clear Build Cache
# 2. Deploys → Deploy Latest Commit (botão azul)
# 3. Aguarde ~5-10 min
```

## Checklist Rápido

- [ ] URL do repositório GitHub está correta no Render?
- [ ] Branch é **main** (ou a branch correta)?
- [ ] Auto Deploy está **ativado** em Settings?
- [ ] Build Cache foi **limpo** recentemente?
- [ ] `package.json` existe no repositório? ✓
- [ ] `npm start` funciona localmente? ✓

## Se ainda não funcionar

### Verificar Logs de Deploy
1. Render Dashboard → seu serviço → **Logs**
2. Procure por erros (vermelho)
3. Se disser `no changes detected` → o webhook não disparou (reconectar GitHub)

### Reiniciar Manualmente
- Render Dashboard → seu serviço
- Canto superior direito → **…** (três pontos)
- Clique em **Restart Service**

### Build falha?
Se logs mostram erro durante build (`npm install` falha):
- Verifique `package.json` — se está com dependências corretas
- Localmente: `rm -rf node_modules && npm install && npm start`
- Se funciona local mas falha no Render → cargo limitado (Render free tem 512MB RAM)

## Variáveis de Ambiente
Se precisa de `.env`:
1. Render Dashboard → seu serviço → **Environment**
2. Adicione manualmente (ex: `PORT=3000`, `NODE_ENV=production`)
3. Deploy vai usar essas variáveis

---

**Próximo passo:** Execute **passo 1 (Clear Build Cache)** e **passo 4 (Deploy Latest Commit)** no Render. Depois aguarde 10 min e verifique.
