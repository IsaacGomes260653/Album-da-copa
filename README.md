<p align="center">
  <picture>
    <source media="(max-width: 767px)" srcset="https://raw.githubusercontent.com/IsaacGomes260653/Album-da-copa/main/.github/banner-mobile.svg">
    <img src="https://raw.githubusercontent.com/IsaacGomes260653/Album-da-copa/main/.github/banner.svg" alt="Meu Álbum da Copa, projeto pessoal no ar no GitHub Pages: as 992 figurinhas da Copa 2026 na ordem do álbum, com repetidas, faltantes e listas para a troca">
  </picture>
</p>

<p align="center">
  <b>Álbum digital das figurinhas da Copa do Mundo 2026: marque o que já colou, conte as repetidas e copie a lista do que falta antes de trocar.</b><br>
  Para quem coleciona o álbum e não quer levar o livro para cada troca, e para quem estuda JavaScript sem framework.<br>
  <a href="https://isaacgomes260653.github.io/Album-da-copa/"><b>Abrir o álbum</b></a> · sem cadastro: o progresso fica salvo no próprio navegador
</p>

<p align="center">
  <a href="https://github.com/IsaacGomes260653/Album-da-copa/actions/workflows/pages/pages-build-deployment"><img alt="Status da publicação no GitHub Pages" src="https://img.shields.io/github/actions/workflow/status/IsaacGomes260653/Album-da-copa/pages%2Fpages-build-deployment?branch=main&style=flat-square&label=GitHub%20Pages&color=122039&labelColor=0b1324"></a>
  <a href="LICENSE"><img alt="Licença MIT" src="https://img.shields.io/github/license/IsaacGomes260653/Album-da-copa?style=flat-square&label=licen%C3%A7a&color=122039&labelColor=0b1324"></a>
  <a href="https://github.com/IsaacGomes260653/Album-da-copa/commits/main"><img alt="Data do último commit" src="https://img.shields.io/github/last-commit/IsaacGomes260653/Album-da-copa?style=flat-square&label=%C3%BAltimo%20commit&color=122039&labelColor=0b1324"></a>
  <img alt="Linguagem principal: JavaScript" src="https://img.shields.io/github/languages/top/IsaacGomes260653/Album-da-copa?style=flat-square&logo=javascript&logoColor=white&color=122039&labelColor=0b1324">
</p>

<p align="center">
  <a href="#demonstração">Demonstração</a> ·
  <a href="#como-rodar-em-60-segundos">Como rodar</a> ·
  <a href="#o-que-ele-faz">O que ele faz</a> ·
  <a href="#como-foi-feito">Como foi feito</a> ·
  <a href="#testes-e-qualidade">Testes e qualidade</a> ·
  <a href="#próximos-passos">Próximos passos</a> ·
  <a href="#english-summary">English</a>
</p>

## Demonstração

<p align="center">
  <img src=".github/capturas/demo.gif" width="720" alt="Demonstração do Meu Álbum da Copa: a busca por vini leva à página do Brasil, onde as figurinhas 1, 2, 4, 10, 14 e 18 são marcadas como coladas, a 14, de Vinicius Júnior, ganha duas repetidas e a 2, de Alisson, uma; de volta ao álbum, o cartão do Brasil mostra 6/20 e, com o mouse em cima, a prévia das 20 figurinhas; na tela Trocas aparecem as duas repetidas, a lista é copiada e a aba Faltantes mostra as 986 que faltam">
</p>

Gravado com o Playwright, com o app rodando localmente (`python -m http.server`). Na gravação, o fundo animado ficou parado para o GIF caber em menos de 5 MB; o resto está como no app. O app tem só o tema escuro.

No celular, a busca ganha uma linha própria e as figurinhas ficam em duas colunas:

<table>
  <tr>
    <td width="50%" valign="top"><img src=".github/capturas/celular-selecao.png" alt="Página do Brasil numa tela de 390 px: cabeçalho verde e amarelo com 6/20 coladas, 30% e 3 repetidas, e as figurinhas em duas colunas, com o contador de repetidas nas coladas"></td>
    <td width="50%" valign="top"><img src=".github/capturas/celular-trocas.png" alt="Tela Trocas numa tela de 390 px: aba Repetidas com 3 figurinhas diferentes e 4 repetidas no total, o botão Copiar lista e as repetidas do Brasil e da Argentina com o código, o nome e a quantidade"></td>
  </tr>
</table>

## Como rodar em 60 segundos

Precisa do Git e de um servidor de arquivos estáticos. Aqui, o do Python 3.

```bash
git clone https://github.com/IsaacGomes260653/Album-da-copa.git
cd Album-da-copa
python -m http.server 8000
```

Abra <http://localhost:8000>. Não há dependências nem build: num clone limpo, do `git clone` até o app no ar, levou cerca de 3 segundos (Windows 11 e Python 3.12).

- No macOS e no Linux, o comando pode ser `python3`.
- Também abre sem servidor, com dois cliques no `index.html`: os dados vêm de arquivos `.js` carregados por `<script>`, e não por `fetch`, então nada é bloqueado no `file://`.
- Sem internet, o app aberto localmente funciona igual. Só as fontes, que vêm do Google Fonts, dão lugar à fonte do sistema.
- Cada endereço guarda o seu próprio progresso: o que você marca em `localhost:8000` não aparece no `file://` nem no site publicado.
