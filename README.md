# 🏆 Meu Álbum — Copa do Mundo 2026

![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)
![Linguagens](https://img.shields.io/badge/Tecnologias-HTML%20%7C%20CSS%20%7C%20JS-blue)

## 📖 Sobre o Projeto

Organizador digital de figurinhas do álbum da Copa do Mundo 2026, criado para resolver um problema clássico de colecionador: nem sempre dá pra carregar o álbum físico pra conferir o que falta antes de fechar uma troca. Aqui é só abrir o app no celular.

O app segue a **estrutura real do álbum**: **980 figurinhas** — 20 por seleção (48 times) mais 20 especiais — na mesma ordem e numeração de um álbum físico: a nº1 de cada seleção é o escudo (brilhante), da 2 à 12 e da 14 à 20 são os jogadores **em ordem de posição** (goleiro → zagueiro → meio-campo → atacante), e a nº13 é a foto oficial da seleção. As especiais trazem emblema, mascote, bola oficial, sedes e a história das Copas anteriores.

> **Nota sobre imagens:** o app usa cores da seleção e o código oficial da FIFA (ex.: BRA, ARG, GER) no lugar do brasão da federação e de fotos reais — esses materiais são protegidos por direitos autorais/de imagem e não são reproduzidos aqui. O visual (estilo "brutalista", bordas grossas e cards colados na página) é uma criação própria, não uma cópia do álbum oficial da Panini.

## ✨ Funcionalidades

- **Controle de acervo:** toque numa figurinha pra marcar como colada; toque de novo pra desmarcar.
- **Gestão de repetidas:** cada figurinha colada ganha um contador (`− N +`) pra registrar quantas cópias extras você tem.
- **Lista de trocas:** tela dedicada que junta automaticamente todas as repetidas — das seleções e das especiais — com botão para copiar a lista (pronta pra mandar no WhatsApp) e organizar a troca com os amigos.
- **Busca:** encontre qualquer jogador ou seleção digitando o nome, direto do topo da tela.
- **Progresso:** barra geral (X/980), progresso por seleção e contagem de álbuns completos.
- **Sem internet, sem conta:** os dados ficam salvos no seu navegador (`localStorage`) — abre e usa, sem cadastro.

## 🚀 Tecnologias

Projeto 100% estático, sem build e sem dependências externas:
- **HTML5 + CSS3** — visual próprio ("neo-brutalista": bordas grossas, sombra sólida, cards levemente rotacionados), com a cor de cada seleção aplicada dinamicamente na sua página.
- **JavaScript (vanilla)** — roteamento por hash (`#/`, `#/team/:id`, `#/trade`), estado em `localStorage`.
- **Dados**: numeração e ordem de cada figurinha (nome, número, tipo) conferidas com o checklist público do álbum oficial 2026.

## 🏃 Como usar

Basta abrir o `index.html` no navegador — funciona local ou publicado (ex. GitHub Pages), sem servidor nem instalação.

---

# 🏆 My Album — 2026 FIFA World Cup (English)

A digital sticker-album organizer for the 2026 FIFA World Cup, built to solve a classic collector problem: you can't always carry the physical album around to check what you're missing before agreeing to a trade.

The app mirrors the **real album structure**: **980 stickers** — 20 per team (48 teams) plus 20 specials — in the same order and numbering as the physical album: sticker #1 for each team is the (foil) crest slot, #2–12 and #14–20 are players **ordered by position** (goalkeeper → defender → midfielder → forward), and #13 is the official team photo slot. The specials cover the emblem, mascot, official ball, host cities, and past World Cup history.

> **On imagery:** the app uses team colors and official FIFA codes (e.g. BRA, ARG, GER) instead of federation crests or real photos — those assets are copyrighted / image-rights protected and are not reproduced here. The visual style (thick borders, hard shadows, stickers "stuck" on the page) is an original design, not a copy of the official Panini album.

## ✨ Features

- **Collection tracking:** tap a sticker to mark it as owned; tap again to unmark.
- **Duplicate management:** every owned sticker gets a `− N +` counter for extra copies you have to trade.
- **Trade list:** a dedicated view that aggregates all your duplicates — from teams and specials alike — with a "copy list" button ready to paste into a chat.
- **Search:** find any player or team by name from the top bar.
- **Progress tracking:** overall progress bar (X/980), per-team completion, and completed-album count.
- **No account, no internet needed:** data is saved locally in your browser (`localStorage`) — just open and use.

## 🚀 Tech stack

Fully static, no build step, no external dependencies:
- **HTML5 + CSS3** — original "neo-brutalist" design (thick borders, hard shadows, slightly rotated cards), with each team's colors applied dynamically on its page.
- **JavaScript (vanilla)** — hash-based routing (`#/`, `#/team/:id`, `#/trade`), state persisted in `localStorage`.
- **Data**: each sticker's number, order, and name cross-checked against the official 2026 album's public checklist.

## 🏃 Running it

Just open `index.html` in a browser — works locally or published (e.g. GitHub Pages), no server or install required.
