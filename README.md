# 🏆 Meu Álbum — Copa do Mundo 2026

![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)
![Linguagens](https://img.shields.io/badge/Tecnologias-HTML%20%7C%20CSS%20%7C%20JS-blue)

## 📖 Sobre o Projeto

Organizador digital de figurinhas do álbum da Copa do Mundo 2026, criado para resolver um problema clássico de colecionador: nem sempre dá pra carregar o álbum físico pra conferir o que falta antes de fechar uma troca. Aqui é só abrir o app no celular.

O app traz as **48 seleções** e os **1.248 jogadores** da Copa do Mundo FIFA 2026, com número da camisa, posição e nome exatamente como saíram na lista oficial de convocados — organizados por grupo, na mesma lógica de navegação de um álbum de figurinhas.

> **Nota sobre imagens:** o app usa cores da seleção e o código oficial da FIFA (ex.: BRA, ARG, GER) no lugar do brasão da federação e de fotos de jogadores — esses materiais são protegidos por direitos autorais/de imagem e não são reproduzidos aqui.

## ✨ Funcionalidades

- **Controle de acervo:** toque numa figurinha pra marcar como colada; toque de novo pra desmarcar.
- **Gestão de repetidas:** cada figurinha colada ganha um contador (`− N +`) pra registrar quantas cópias extras você tem.
- **Lista de trocas:** tela dedicada que junta automaticamente todas as repetidas de todas as seleções, com botão para copiar a lista (pronta pra mandar no WhatsApp) e organizar a troca com os amigos.
- **Busca:** encontre qualquer jogador ou seleção digitando o nome, direto do topo da tela.
- **Progresso:** barra geral (X/1248), progresso por seleção e contagem de álbuns completos.
- **Filtro por posição:** dentro de cada seleção, filtre por goleiros, zagueiros, meio-campo ou ataque.
- **Sem internet, sem conta:** os dados ficam salvos no seu navegador (`localStorage`) — abre e usa, sem cadastro.

## 🚀 Tecnologias

Projeto 100% estático, sem build e sem dependências externas:
- **HTML5 + CSS3** — visual próprio inspirado em álbum de figurinhas, com a cor de cada seleção aplicada dinamicamente na página do time.
- **JavaScript (vanilla)** — roteamento por hash (`#/`, `#/team/:id`, `#/trade`), estado em `localStorage`.
- **Dados oficiais**: elenco completo dos 48 times (número, posição, nome) extraído da lista de convocados publicada pela FIFA.

## 🏃 Como usar

Basta abrir o `index.html` no navegador — funciona local ou publicado (ex. GitHub Pages), sem servidor nem instalação.

---

# 🏆 My Album — 2026 FIFA World Cup (English)

A digital sticker-album organizer for the 2026 FIFA World Cup, built to solve a classic collector problem: you can't always carry the physical album around to check what you're missing before agreeing to a trade.

The app includes all **48 national teams** and their **1,248 players** from the 2026 World Cup, with each player's official squad number, position, and name exactly as published in FIFA's final squad lists — organized by group, mirroring how a physical sticker album is browsed.

> **On imagery:** the app uses team colors and official FIFA codes (e.g. BRA, ARG, GER) instead of federation crests or player photos — those assets are copyrighted / image-rights protected and are not reproduced here.

## ✨ Features

- **Collection tracking:** tap a sticker to mark it as owned; tap again to unmark.
- **Duplicate management:** every owned sticker gets a `− N +` counter for extra copies you have to trade.
- **Trade list:** a dedicated view that aggregates all your duplicates across every team, with a "copy list" button ready to paste into a chat.
- **Search:** find any player or team by name from the top bar.
- **Progress tracking:** overall progress bar (X/1248), per-team completion, and completed-album count.
- **Position filter:** filter each team's squad by goalkeepers, defenders, midfielders, or forwards.
- **No account, no internet needed:** data is saved locally in your browser (`localStorage`) — just open and use.

## 🚀 Tech stack

Fully static, no build step, no external dependencies:
- **HTML5 + CSS3** — original sticker-album-inspired design, with each team's colors applied dynamically on its page.
- **JavaScript (vanilla)** — hash-based routing (`#/`, `#/team/:id`, `#/trade`), state persisted in `localStorage`.
- **Official data**: full 48-team squads (number, position, name) sourced from FIFA's published final squad lists.

## 🏃 Running it

Just open `index.html` in a browser — works locally or published (e.g. GitHub Pages), no server or install required.
