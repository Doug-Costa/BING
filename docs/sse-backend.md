# Documentação de Eventos em Tempo Real (SSE) - Bingo

O backend do Bingo disponibiliza um endpoint de **Server-Sent Events (SSE)** para comunicação unidirecional em tempo real. Esta interface é crítica para os painéis de TV de Bingo (Android/Web), terminais POS e clientes jogadores, fornecendo atualizações instantâneas sobre os sorteios, bolas sorteadas, vencedores, jackpots, promoções e proximidade de ganho.

---

## 1. Conexão e Autenticação

O canal SSE é exposto no seguinte endpoint:

```http
GET /bingo/realtime-sse/stream
```

### Parâmetros de Query String

| Parâmetro | Tipo | Descrição |
| :--- | :--- | :--- |
| `pin` | `string` | **Obrigatório para TVs e terminais POS.** Código PIN de 6 dígitos que identifica o terminal de exibição. |
| `token` | `string` | **Obrigatório para Clientes Jogadores.** JWT gerado após o login do player. |
| `roomId` | `string` | *Opcional.* ID da sala de Bingo desejada (caso o PIN/Token possua acesso a múltiplas salas). |

> [!NOTE]
> **Tratamento Defensivo de URL:**
> O servidor trata automaticamente conexões com parâmetros mal formatados originados de alguns clientes Android de TV (ex: `?pin=123456?token=eyJ...`), extraindo o PIN e o Token de forma transparente.

---

## 2. Eventos Iniciais de Conexão (Snapshot)

Assim que a conexão SSE é estabelecida com sucesso, o servidor envia imediatamente dois eventos otimizados para carregar o estado inicial do terminal:

### A. Evento `snapshot`
Fornece o estado atual da sala de bingo ativa gravado no Redis Cache (`bingo:room:<roomId>:state`). O snapshot entrega atomicamente:
- **`thisDraw`**: Informações do sorteio em andamento (ID, ID incremental, data/hora agendada, preço do bilhete e valores dos prêmios de Linha 1, Linha 2 e Bingo).
- **`lineWinners`**: Lista acumulada dos ganhadores de linha durante a rodada atual (ex: quem ganhou a Linha 1, Linha 2 e Bingo, com nome do jogador, cartela e valor do prêmio).
- **Demais coleções ativas**: Sorteios futuros (`nextDraws`), acumuladores (`jackpotInfo`), sorteios em destaque (`hotDraws`), lista de cartelas próximas de ganhar (`topWinners`) e promoções (`promotions`).

> [!NOTE]
> **Gestão do Redis Cache:**
> O estado é criado no Redis quando o sorteio inicia (`draw_start`) e é mantido em memória durante todo o sorteio. Ao finalizar a rodada (`draw_finish` / `draw_end`), a chave no Redis é limpa automaticamente, garantindo que reconexões no intervalo entre sorteios não recebam dados obsoletos.

#### Exemplo de Payload:
```json
{
  "type": "snapshot",
  "data": {
    "type": "snapshot",
    "state": {
      "drawId": "d3b07384-d113-4a1e-a5f1-3be22956cfcd",
      "status": "started",
      "thisDraw": {
        "id": "d3b07384-d113-4a1e-a5f1-3be22956cfcd",
        "incrementalId": 362,
        "roomId": "80b13973-e1b3-4149-9d89-4eb18e91d053",
        "status": "IN_PROGRESS",
        "scheduledAt": "2026-07-30T19:20:00.000Z",
        "ticketPrice": "0.50",
        "prizeLine1": "50.00",
        "prizeLine2": "150.00",
        "prizeLine3": "200.00"
      },
      "balls": [12, 45, 87, 3, 22],
      "lineWinners": [
        {
          "type": "line1",
          "ticketId": "60c61b56-c24d-4636-aa62-c810b7981761",
          "playerName": "bar_tonho",
          "numbers": [[29, 50, 58, 67, 85], [1, 7, 22, 76, 81], [12, 26, 32, 34, 52]],
          "winningLines": [[29, 50, 58, 67, 85]],
          "prizeAmount": 50.00,
          "hasJackpot": false,
          "jackpotAmount": 0
        }
      ],
      "topWinners": [
        {
          "ticketId": "t-10023",
          "playerId": "p-501",
          "linesCompleted": 2,
          "minNumbersLeft": 1,
          "missing": [55]
        }
      ],
      "jackpot": true,
      "triggerBallLimit": 42,
      "jackpotAmount": 6250.50,
      "nextDraws": [],
      "jackpotInfo": {},
      "promotions": []
    }
  }
}
```

### B. Evento `my_tickets` (DTO Otimizado)
Retorna a lista de cartelas ativas compradas pelo jogador autenticado para a sala atual. Utiliza uma DTO enxuta de alta performance, desprovida de relacionamentos ORM pesados.

#### Exemplo de Payload DTO:
```json
{
  "type": "my_tickets",
  "data": {
    "type": "my_tickets",
    "tickets": [
      {
        "id": "t-10023",
        "incrementalId": 12,
        "drawId": "d3b07384-d113-4a1e-a5f1-3be22956cfcd",
        "roomId": "room-001",
        "status": "PENDING",
        "statuswin": false,
        "totalprize": 0.00,
        "numbers": [
          {
            "numbers": [
              [5, 12, 28, 47, 82],
              [9, 19, 33, 56, 74],
              [1, 15, 41, 62, 90]
            ],
            "value": 2.00,
            "status": "pending"
          }
        ],
        "price": 2.00,
        "wonLine1": false,
        "wonLine2": false,
        "wonLine3": false,
        "wonJackpot": false,
        "createdAt": "2026-07-28T15:10:00.000Z"
      }
    ]
  }
}
```

---

## 3. Eventos em Tempo Real (Pub/Sub)

Durante o ciclo de vida dos sorteios, o servidor publica os seguintes eventos dinamicamente através do canal Redis Pub/Sub:

### `draw_start`
Disparado quando a rodada de sorteio de bolas é iniciada na sala.

```json
{
  "type": "draw_start",
  "data": {
    "drawId": "d3b07384-d113-4a1e-a5f1-3be22956cfcd",
    "roomId": "room-001",
    "scheduledAt": "2026-07-27T18:00:00.000Z",
    "prizeLine1": 100.00,
    "prizeLine2": 250.00,
    "prizeLine3": 1000.00,
    "jackpotAmount": 6250.50,
    "triggerBallLimit": 42
  }
}
```

---

### `new_ball`
Enviado a cada X segundos informando o número sorteado pelo soprador eletrônico/matemático.

```json
{
  "type": "new_ball",
  "data": {
    "number": 45
  }
}
```

---

### `top_winners`
Fornece informações em tempo real de proximidade de vitória de linha ou bingo (cartelas mais próximas de ganhar com 1 ou 2 números restantes).

```json
{
  "type": "top_winners",
  "data": {
    "stage": "bingo",
    "items": [
      {
        "ticketId": "t-10023",
        "playerId": "p-501",
        "playerName": "Marcos Silva",
        "linesCompleted": 2,
        "minNumbersLeft": 1,
        "missing": [55]
      }
    ]
  }
}
```

---

### `line_winner`
Anuncia um ou mais ganhadores de uma linha específica (Linha 1, Linha 2 ou Bingo/Linha 3).

```json
{
  "type": "line_winner",
  "data": {
    "line": 1,
    "winners": [
      {
        "ticketId": "t-10023",
        "playerName": "Marcos Silva",
        "share": 100.00
      }
    ],
    "jackpotWon": false
  }
}
```

---

### `jackpot_trigger_update`
Informa que o limite de bola de ativação do jackpot foi ajustado dinamicamente para o sorteio atual.

```json
{
  "type": "jackpot_trigger_update",
  "data": {
    "drawId": "d3b07384-d113-4a1e-a5f1-3be22956cfcd",
    "jackpotId": "j-fixed-102",
    "triggerBallLimit": 43,
    "jackpotAmount": 6250.50,
    "paid": false
  }
}
```

---

### `jackpot_delayed`
Enviado quando o jackpot acumula para o próximo sorteio, incrementando o limite de ativação.

```json
{
  "type": "jackpot_delayed",
  "data": {
    "drawId": "d3b07384-d113-4a1e-a5f1-3be22956cfcd",
    "jackpotId": "j-fixed-102",
    "newTriggerLimit": 44,
    "jackpotAmount": 6300.00
  }
}
```

---

### `jackpot_paid`
Anuncia que o prêmio de Jackpot foi ganho e pago aos jogadores.

```json
{
  "type": "jackpot_paid",
  "data": {
    "drawId": "d3b07384-d113-4a1e-a5f1-3be22956cfcd",
    "jackpotId": "j-fixed-102",
    "triggerBallLimit": 44,
    "jackpotAmount": 6300.00,
    "winners": [
      {
        "ticketId": "t-10023",
        "playerId": "p-501",
        "affiliateId": "aff-09",
        "share": 6300.00
      }
    ]
  }
}
```

---

### `draw_finish`
Evento unificado de encerramento do sorteio. Transmite o sumário de ganhadores e prêmios finais da rodada, acompanhado da lista atualizada dos próximos 10 sorteios agendados da sala para que as TVs/Clientes façam a transição sem novas chamadas REST.

```json
{
  "type": "draw_finish",
  "data": {
    "drawId": "d3b07384-d113-4a1e-a5f1-3be22956cfcd",
    "winners": [
      {
        "line": 1,
        "ticketId": "t-10023",
        "playerName": "Marcos Silva",
        "prize": 100.00
      },
      {
        "line": 3,
        "ticketId": "t-10023",
        "playerName": "Marcos Silva",
        "prize": 1000.00
      }
    ],
    "nextDraws": [
      {
        "id": "next-draw-99",
        "scheduledAt": "2026-07-27T18:15:00.000Z",
        "scheduledAtFormatted": "2026-07-27 15:15:00",
        "ticketPrice": 2.00,
        "prizeLine1": 100.00,
        "prizeLine2": 200.00,
        "prizeLine3": 800.00
      }
    ]
  }
}
```

---

### `draw_cancel`
Informa o cancelamento prematuro do sorteio atual por intervenção administrativa.

```json
{
  "type": "draw_cancel",
  "data": {
    "drawId": "d3b07384-d113-4a1e-a5f1-3be22956cfcd"
  }
}
```

---

### `next_draws`
Atualiza a lista de sorteios agendados a serem exibidos em modo de espera/espera de tela.

```json
{
  "type": "next_draws",
  "data": {
    "draws": [
      {
        "id": "next-draw-99",
        "scheduledAt": "2026-07-27T18:15:00.000Z",
        "prizeLine1": 100.00,
        "prizeLine2": 200.00,
        "prizeLine3": 800.00,
        "room": {
          "name": "Sala Ouro 1"
        }
      }
    ]
  }
}
```

---

### `jackpot_info`
Atualiza os acumuladores em tempo real para exibição nas telas de TV.

```json
{
  "type": "jackpot_info",
  "data": {
    "activeToday": true,
    "id": "j-fixed-102",
    "name": "Jackpot Fixo da Sorte",
    "type": "FIXO",
    "currentAmount": 1250.50,
    "baseAmount": 5000.00,
    "triggerBallLimit": 44,
    "triggerBallChoice": 40,
    "triggerBallLimitForce": 50,
    "triggerBallLimitMin": 30
  }
}
```

---

### `hot_draws`
Lista de sorteios especiais de alta atratividade configurados para promoção nas telas de espera.

```json
{
  "type": "hot_draws",
  "data": {
    "draws": [
      {
        "id": "special-draw-10",
        "scheduledAt": "2026-07-27T20:00:00.000Z",
        "prizeLine1": 500.00,
        "prizeLine2": 1000.00,
        "prizeLine3": 5000.00
      }
    ]
  }
}
```