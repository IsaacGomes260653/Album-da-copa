# 🏆 Meu Álbum — Copa do Mundo 2026

![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)
![Linguagens](https://img.shields.io/badge/Tecnologias-HTML%20%7C%20CSS%20%7C%20JS-blue)

## 📖 Sobre o Projeto

Organizador digital de figurinhas do álbum da Copa do Mundo 2026, criado para resolver um problema clássico de colecionador: nem sempre dá pra carregar o álbum físico pra conferir o que falta antes de fechar uma troca. Aqui é só abrir o app no celular.

O app segue a **estrutura real do álbum**: **992 figurinhas** — 20 por seleção (48 times), 20 especiais (emblema, mascote, bola oficial, sedes e história das Copas) e a prancha exclusiva de **12 especiais Coca-Cola** — na mesma ordem e numeração do álbum físico: a nº1 de cada seleção é o escudo (brilhante), da 2 à 12 e da 14 à 20 são os jogadores **em ordem de posição** (goleiro → zagueiro → meio-campo → atacante), e a nº13 é a foto oficial da seleção.

> **Nota sobre imagens:** o app usa as **bandeiras reais** das seleções (via [flag-icons](https://github.com/lipis/flag-icons), projeto open-source sob licença MIT) e o código oficial da FIFA (ex.: BRA, ARG, GER), mas não reproduz o brasão das federações nem fotos reais de jogadores — esses materiais são protegidos por direitos autorais/de imagem. O visual (fundo escuro com mistura de cores das nações, cards por seleção) é uma criação própria, não uma cópia do álbum oficial da Panini.

## ✨ Funcionalidades

- **Múltiplos álbuns:** crie um álbum por pessoa (ex. um por filho), com nome próprio, e troque entre eles pelo seletor no topo — cada um guarda seu progresso separado.
- **Controle de acervo:** toque numa figurinha pra marcar como colada; toque de novo pra desmarcar.
- **Gestão de repetidas:** cada figurinha colada ganha um contador (`− N +`) pra registrar quantas cópias extras você tem.
- **Listas para compartilhar:** duas telas — **Repetidas** e **Faltantes** — que juntam automaticamente as figurinhas de todas as seleções e especiais, com botão "copiar lista" (formato `BRA 03 Nome`, pronto pra mandar no WhatsApp).
- **Prévia rápida:** passe o mouse sobre o card de uma seleção na tela inicial pra ver uma miniatura de quais figurinhas já tem, sem precisar abrir a página dela.
- **Busca:** encontre qualquer jogador ou seleção digitando o nome, direto do topo da tela.
- **Progresso:** barra geral animada (X/992), progresso por seleção e contagem de álbuns completos.
- **Sem internet, sem conta:** os dados ficam salvos no seu navegador (`localStorage`) — abre e usa, sem cadastro.

## 🚀 Tecnologias

Projeto 100% estático, sem build e sem dependências externas:
- **HTML5 + CSS3** — visual próprio (fundo escuro, cores vivas por seleção, cards com movimento no hover), com a cor de cada seleção aplicada dinamicamente na sua página.
- **JavaScript (vanilla)** — roteamento por hash (`#/`, `#/team/:id`, `#/trade`), estado multi-álbum em `localStorage`.
- **Dados**: numeração e ordem de cada figurinha (nome, número, tipo) conferidas com o checklist público do álbum oficial 2026, incluindo a prancha Coca-Cola.

## 🏃 Como usar

Basta abrir o `index.html` no navegador — funciona local ou publicado (ex. GitHub Pages), sem servidor nem instalação.

---

# 🏆 My Album — 2026 FIFA World Cup (English)

A digital sticker-album organizer for the 2026 FIFA World Cup, built to solve a classic collector problem: you can't always carry the physical album around to check what you're missing before agreeing to a trade.

The app mirrors the **real album structure**: **992 stickers** — 20 per team (48 teams), 20 specials (emblem, mascot, official ball, host cities, World Cup history) and the exclusive **12-sticker Coca-Cola spread** — in the same order and numbering as the physical album: sticker #1 for each team is the (foil) crest slot, #2–12 and #14–20 are players **ordered by position** (goalkeeper → defender → midfielder → forward), and #13 is the official team photo slot.

> **On imagery:** the app uses **real national flags** (via [flag-icons](https://github.com/lipis/flag-icons), MIT-licensed open source) and official FIFA codes (e.g. BRA, ARG, GER), but does not reproduce federation crests or real player photos — those assets are copyrighted / image-rights protected. The visual style (dark background with a mix of national colors, per-team pages) is an original design, not a copy of the official Panini album.

## ✨ Features

- **Multiple albums:** create one album per person (e.g. one per child), each with its own name, switchable from the top-bar selector — progress is tracked independently per album.
- **Collection tracking:** tap a sticker to mark it as owned; tap again to unmark.
- **Duplicate management:** every owned sticker gets a `− N +` counter for extra copies you have to trade.
- **Shareable lists:** two views — **Duplicates** and **Missing** — that aggregate stickers across every team and special, with a "copy list" button (`BRA 03 Name` format, ready to paste into a chat).
- **Quick preview:** hover a team card on the home screen to see a tiny grid of which stickers you already have, without opening the team page.
- **Search:** find any player or team by name from the top bar.
- **Progress tracking:** animated overall progress bar (X/992), per-team completion, and completed-album count.
- **No account, no internet needed:** data is saved locally in your browser (`localStorage`) — just open and use.

## 🚀 Tech stack

Fully static, no build step, no external dependencies:
- **HTML5 + CSS3** — original design (dark background, vivid per-team colors, hover motion on cards), with each team's colors applied dynamically on its page.
- **JavaScript (vanilla)** — hash-based routing (`#/`, `#/team/:id`, `#/trade`), multi-album state persisted in `localStorage`.
- **Data**: each sticker's number, order, and name cross-checked against the official 2026 album's public checklist, including the Coca-Cola spread.

## 🏃 Running it

Just open `index.html` in a browser — works locally or published (e.g. GitHub Pages), no server or install required.
