````markdown
# Lottie `.was` WhatsApp Sticker Bypass 🚀

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)

🇧🇷 **Português:**
Um "bot" simples em Node.js usando a biblioteca Baileys para burlar o bloqueio nativo do WhatsApp na criação e envio de figurinhas animadas personalizadas no novo formato Lottie (`.was`). O aplicativo nativo impede a importação direta de arquivos `.was` modificados. Este "bot" atua como uma "porta dos fundos", gerando o pacote via código e injetando a figurinha oficial diretamente nos servidores da Meta.

🇺🇸 **English:**
A simple Node.js "bot" using the Baileys library to bypass WhatsApp's native block on creating and sending custom animated stickers in the new Lottie (`.was`) format. The native mobile app prevents direct imports of modified `.was` files. This "bot" acts as a backdoor, generating the package via code and injecting the official sticker directly into Meta's servers.

---

## 🛠️ Como usar / How to use

### 🇧🇷 Instalação (Português)

1. **Clone este repositório:**

```bash
git clone https://github.com/voi1d/bot-figurinhas.git
cd bot-figurinhas
```
````

2. **Instale as dependências:**

```bash
npm install
```

3. **Coloque a sua imagem:**
   Adicione a imagem que você deseja testar na raiz do projeto com o nome `minha_foto.jpg`.

4. **Configure seu número:**
   Abra o arquivo `index.js` e coloque o seu número do WhatsApp (com código do país 55 e DDD) na variável `MEU_NUMERO`.
   Exemplo:

```js
const MEU_NUMERO = "5511999999999";
```

5. **Inicie o Bot:**

```bash
node index.js
```

6. **Conecte e Teste:**
   O terminal irá gerar um código de emparelhamento de 8 dígitos. Vá no WhatsApp > Aparelhos Conectados > Conectar usando número de telefone e digite o código.
   Assim que conectar, mande a mensagem `!testar` no WhatsApp para o "bot" te enviar a figurinha gerada!

---

### 🇺🇸 Installation (English)

1. **Clone this repository:**

```bash
git clone https://github.com/voi1d/bot-figurinhas.git
cd bot-figurinhas
```

2. **Install dependencies:**

```bash
npm install
```

3. **Add your image:**
   Place the image you want to test in the project's root folder and name it `minha_foto.jpg`.

4. **Set your phone number:**
   Open `index.js` and insert your WhatsApp number (including country code) into the `MEU_NUMERO` variable.
   Example:

```js
const MEU_NUMERO = "15551234567";
```

5. **Start the Bot:**

```bash
node index.js
```

6. **Connect and Test:**
   The terminal will generate an 8-digit Pairing Code. Go to WhatsApp > Linked Devices > Link with phone number instead, and type the code.
   Once connected, send the message `!testar` on WhatsApp, and the "bot" will reply with your generated sticker!

---

## ⚙️ Créditos / Credits

Este projeto utiliza o "script" de empacotamento Lottie do Pedrozz13755/Lottie-Whatsapp adaptado com a biblioteca `adm-zip` para compatibilidade universal entre sistemas operacionais (Windows/Mac/Linux).

This project uses the Lottie packaging script from Pedrozz13755/Lottie-Whatsapp adapted with the `adm-zip` library for universal OS compatibility (Windows/Mac/Linux).

```

```
