# Calendar APP Challenge

Bem-vindo(a) ao Calendar APP Challenge.\
Este projeto foi desenvolvido para atender a um desafio de curto prazo em aproximadamente 3 dias.\
Esse projeto usa `Nx` que eh um _build system_ e a aplicacao foi construida usando **Component First Architecture**.\
Algumas configuracoes do projeto ficam em `src/app` porem o principal da aplicacao esta em `libs/calendar/src/lib/`.

O layout e design do projeto estao de acordo com a proposta do desafio.

**Acesse o porjeto em producao:**\
https://calendar-app-challenge.ruanpasta.com/

[Angular CLI](https://github.com/angular/angular-cli) version 15.2.0.


## Como Rodar o Projeto
Antes de começar, certifique-se de ter o Node.js instalado na sua máquina. Caso não tenha, você pode baixá-lo em https://nodejs.org/.

Clone este repositório para o seu computador usando o seguinte comando:

```bash
git clone https://github.com/ruanpasta/calendar_challenge
```

Navegue até o diretório do projeto:

```bash
cd calendar-challenge
```

Instale as dependências do projeto usando o npm ou yarn:

```bash
npm install
# ou
yarn install
```
Agora, você pode executar o projeto localmente com o comando:

```bash
nx serve
# ou
yarn start
# ou
npm start
```

Abra o seu navegador e acesse http://localhost:4200/ para visualizar o AngularPlatformChallenge em ação!

## Como Gerar o Build do Projeto
Se você deseja construir uma versão otimizada do projeto para implantação em produção, siga as etapas abaixo:

Certifique-se de que está no diretório do projeto:

```bash
cd calendar-challenge
```
Execute o seguinte comando para criar o build:

```bash
nx build
# ou
yarn build
# ou
npm build
```
Após a conclusão, o build otimizado estará disponível no diretório `dist/calendar-challenge`. Você pode implantar esses arquivos diretamente em um servidor web ou qualquer plataforma de hospedagem de sua escolha.
