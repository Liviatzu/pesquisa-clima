# Pesquisa de Clima — Falcioni Consultoria

App para aplicar pesquisas de clima organizacional durante a entrevista com o cliente: o consultor lê a pergunta, o respondente fala a resposta, o microfone transcreve e sugere a nota/nível automaticamente, e o relatório (média por pergunta, comentários anônimos) vai sendo montado em tempo real conforme cada pessoa responde.

Dois modelos prontos, no mesmo ambiente:
- **Nota 0 a 10** — 10 perguntas padrão (extraídas do modelo real já usado) + 2 abertas.
- **Concordância / Satisfação** — as mesmas 10 dimensões, em escala de 5 níveis (concordância, satisfação ou frequência conforme a pergunta) + 2 abertas.

Em "Nova pesquisa" dá para editar, remover, reordenar ou adicionar perguntas livremente antes de começar a coletar — os modelos são só um ponto de partida.

## 1. Configurar o Firebase (uma vez só)

1. Acesse https://console.firebase.google.com e crie um projeto novo (gratuito).
2. No menu lateral, vá em **Build > Firestore Database** e clique em "Criar banco de dados". Escolha o modo **produção** e a região mais próxima (ex: `southamerica-east1`).
3. Em **Configurações do projeto (ícone de engrenagem) > Geral**, role até "Seus apps" e clique no ícone `</>` para criar um app Web. Dê um nome (ex: "pesquisa-clima") e copie o objeto `firebaseConfig` que aparece.
4. Cole esse objeto em [firebase-config.js](firebase-config.js), substituindo os valores de exemplo.
5. Em **Firestore Database > Regras**, cole isto e publique:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sessions/{sessionId} {
      allow read, write: if true;
      match /respondentes/{respondenteId} {
        allow read, write: if true;
      }
    }
  }
}
```

> Isso deixa o banco aberto (sem login) para simplificar o uso em campo — qualquer pessoa com o link do app consegue ler/escrever. Se quiser reforçar depois, dá pra adicionar autenticação por senha; me avise quando quiser isso.

## 2. Publicar (GitHub Pages)

Tudo fica no GitHub, sem token de terceiro para renovar. Repositório: https://github.com/Liviatzu/pesquisa-clima

O GitHub Pages já está ativado (branch `main`, pasta `/`). O app fica no ar em:

**https://liviatzu.github.io/pesquisa-clima/**

Toda atualização é só `git push` — o GitHub publica sozinho em 1-2 minutos, sem nenhum passo manual.

## 3. Usar

1. **Nova pesquisa** → nome do cliente, segmentos (setores) opcionais, escolher modelo (ou editar as perguntas) → "Criar pesquisa e começar a coletar".
2. Na coleta: escolha o segmento do respondente (se configurado), toque no microfone 🎤, deixe o cliente responder, confirme a nota/nível sugerido (ou toque no botão certo manualmente) e avance. Ao terminar as perguntas, o app já abre um novo respondente automaticamente.
3. **Relatório** (acessível a qualquer momento pela lista de pesquisas) mostra a média e a distribuição de cada pergunta, comentários anônimos (só "Respondente N", nunca o nome) e um botão para imprimir/salvar em PDF.
4. Reconhecimento de voz funciona melhor no **Chrome** ou **Edge** (Android/desktop). No iPhone/Safari a transcrição pode não estar disponível — nesse caso, dá pra registrar a resposta tocando direto no número/nível.

## Estrutura

- `index.html`, `style.css`, `app.js` — a aplicação.
- `questions.js` — banco de perguntas padrão dos dois modelos.
- `voice.js` — reconhecimento de voz e interpretação da resposta falada.
- `firebase-config.js` — suas credenciais do Firebase (edite aqui).
- `manifest.json`, `sw.js`, `icons/` — PWA (instalável no celular/tablet).
