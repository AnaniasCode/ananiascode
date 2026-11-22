# AnaniasCode

Site da AnaniasCode — portfólio, planos e pré-cadastro de orçamento enviado pelo WhatsApp.

🌐 https://ananiascode.nacional-oficial.workers.dev/

## Estrutura

```
public/
  index.html   → página (carrossel, serviços, portfólio, planos, orçamento)
  styles.css   → visual branco & roxo
  script.js    → carrossel, animações e envio do pré-cadastro ao WhatsApp
  favicon.svg
wrangler.jsonc → configuração do Cloudflare Workers (arquivos estáticos)
```

## WhatsApp do pré-cadastro

Em `public/script.js`, preencha `WHATSAPP_NUMBER` com o número comercial
(DDI + DDD + número, só dígitos — ex: `5511987654321`). Assim o formulário abre
o WhatsApp com a mensagem já escrita. Se ficar vazio, a mensagem é copiada e o
link comercial é aberto para o cliente colar e enviar.

## Publicar na Cloudflare

Automático: em **Cloudflare → Workers & Pages → ananiascode → Settings → Build**,
conecte este repositório do GitHub. Cada push na `main` publica o site.

Manual:

```bash
npx wrangler deploy
```

## Rodar localmente

```bash
npx wrangler dev
```
