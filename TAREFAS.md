










#########################################################

Tela live esta perfeita, cuidado para nao alterar partes indesejadas , ajustes necessarios :


quando exibe premios os premios podem ser divididos quando for colocar no modal uma informação exemplo DIVIDIDO ! piscando 
as regras sao como abaixo 

Aqui está a explicação exata de como a divisão de prêmios (**Split**) e o **Jackpot** funcionam e como essas informações são enviadas via SSE para o Frontend (usando como base exatamente o log `logs/sse-draw-25f7ac9b-af1e-420f-980a-91d34306be1d.json`):

---

### 1. 🤝 Como funciona a Divisão de Prêmio (SPLIT)?

Quando dois ou mais jogadores completam a cartela na **mesma bola** (como aconteceu na bola **7** entre "Matheus Teixeira" e "RafaelCardoso"):

1. **Durante o sorteio (Evento `line_winner`)**:
   - O backend dispara **um evento `line_winner` individual** para cada bilhete vitorioso no mesmo instante.
   - O valor retornado em `prizeAmount` **já vem dividido igualmente** no cálculo do backend:
     ```json
     // Ganhador 1
     {"type":"line_winner","data":{"type":"bingo","playerName":"Matheus Teixeira","prizeAmount":100,"hasJackpot":false,"jackpotAmount":0}}

     // Ganhador 2
     {"type":"line_winner","data":{"type":"bingo","playerName":"RafaelCardoso","prizeAmount":100,"hasJackpot":false,"jackpotAmount":0}}
     ```
     *(O prêmio total do Bingo era R$ 200,00, portanto cada um recebeu R$ 100,00).*

2. **No encerramento do sorteio (Evento `draw_finish`)**:
   - O backend envia o resumo final no array `winners`, onde especifica o prêmio total da linha (`prize`) e a fatia que cada um recebeu (`share`):
     ```json
     {
       "line": 3,
       "prize": 200,
       "winners": [
         { "ticketId": "01fa...", "playerName": "Matheus Teixeira", "share": 100 },
         { "ticketId": "413c...", "playerName": "RafaelCardoso", "share": 100 }
       ]
     }
     ```

---

### 2. 💰 Como funciona quando ganha o JACKPOT?

1. **Antes e durante o sorteio (`draw_start` / `jackpot_trigger_update`)**:
   - O backend envia as regras do Jackpot no início e em atualizações:
     ```json
     {
       "type": "draw_start",
       "data": {
         "jackpot": true,
         "jackpotAmount": 602.36,
         "triggerBallLimit": 60
       }
     }
     ```
   - **Para o Frontend exibir**: O Jackpot só é pago se o **Bingo** for batido em até `triggerBallLimit` bolas (ex: até a bola 60).

2. **Quando alguém bate o Bingo dentro do limite de bolas (`line_winner`)**:
   - Se o Bingo for batido na bola 58 (por exemplo, dentro do limite 60), o evento `line_winner` virá com:
     ```json
     {
       "type": "line_winner",
       "data": {
         "type": "bingo",
         "playerName": "NomeDoGanhador",
         "prizeAmount": 200,
         "hasJackpot": true,
         "jackpotAmount": 602.36
       }
     }
     ```
   - **Se houver Split no Jackpot** (ex: 2 jogadores baterem o Bingo na mesma bola 58):
     - Ambos receberão `hasJackpot: true`.
     - O valor de `jackpotAmount` virá **dividido por 2** para cada um (ex: R$ 301,18 para cada).



### 💡 Resumo para passar ao Frontend:
- **`line_winner`**: Escutar esse evento. Se ele for disparado 2 vezes seguidas na mesma bola, significa que houve Split. O valor em `prizeAmount` já é a fatia calculada que aquele jogador ganhou.
- **`hasJackpot` e `jackpotAmount`**: Se `hasJackpot === true`, o frontend pode acionar uma animação especial de **Acumulado/Jackpot** na tela e exibir o valor adicional do `jackpotAmount`.


sobre o jackpot / acumulado na tela quando janha exibir se ganahar e na tela final tambem mas nao mostrar se nao ganhou hoje no resumo sempre esta aparecendo 
mesmo se nao foi ganho ajustar

#############################################################

tela live verssao mobile nao exibir texto Bingo ao VIVO , para sobrar mais espaço 

a visualização mobile e desktop esta ok algumas telas verticais e ou um pouco mais finas nao esta exibindo o footer ( tablets ) seria legal exibir

#################################################################

n tela live o quadro de ganhadores nao esta tao bem centralizado a iluminacao da esquerda do modal nao esta aparecendo 
tambem quando existe vitoria aparece uma animação de luzes a esquerda seria legal a direita tambem ter uma igual 

#################################################################

referente ao pwa seria interessante quando abrir aparecer um splash screen com mesmas cores do site texto  bingo ao vivo 
nao ter barra de navegação como um app a cor do top do app onde fica wifi etc ser da mesma cor do site , solicitar para instalar


se o acesso for com rota e id afiliado armazenar ( talvez service worker ) o id do afiliadopara que se o usuario nao se registrar imediatamente
outra vez acessar acessar com o id do afiliado , qual seria a rota para acesso com link de afiliado ? 


