

https://seusite.com/afiliado/ID_DO_AFILIADO

https://seusite.com/?affiliate=ID_DO_AFILIADO

## 🔐 Métodos de Autenticação

### A. Login com e‑mail e senha

- **Registro**: `POST /api/auth/player/register`
- **Login**: `POST /api/auth/player/login` → retorna `access_token`, `refresh_token` e dados do player.
- **Refresh**: `POST /api/auth/player/refresh` → envia `refresh_token` e recebe novos tokens.

### B. Login via Telegram (PWA)

Quando o Telegram abre a URL com `?telegramId=...`, o frontend chama `POST /api/auth/telegram-login` com `{ telegramId }` e autentica automaticamente.

### C. Integração Seamless (parceiros)

- **Iniciar sessão**: `POST /seanless/session/launch` (chamado pelo servidor parceiro com assinatura HMAC).
  - Gera `sessionToken` (JWT) e `refreshToken`.
  - Retorna `launchUrl` contendo `?token=...` para redirecionar o jogador.
- **Refresh**: `POST /seanless/session/refresh` – usado pelo frontend para renovar tokens Seamless.
- O frontend, ao receber a URL com `?token=...`, decodifica o JWT e loga automaticamente.

### D. Link de Afiliado

O sistema captura o parâmetro `?affiliate=...` e o associa ao jogador no registro.