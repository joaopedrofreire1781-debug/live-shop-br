# Live Shop Brasil

Crie um protótipo mobile-first de um aplicativo brasileiro de live commerce e marketplace.

CONCEITO:

O aplicativo combina a experiência de live shopping do Whatnot com a descoberta de produtos de plataformas de vídeo curto como TikTok Shop.

O objetivo é permitir que usuários descubram produtos através de vídeos e transmissões ao vivo e possam comprar os produtos sem sair da experiência da live.

IMPORTANTE:

Este é um PROTÓTIPO, portanto não implemente inicialmente pagamentos reais, transmissão de vídeo real, integração real com TikTok Shop ou sistemas complexos de logística.

Use dados mockados para demonstrar a experiência.

DESIGN:

Quero uma interface moderna, minimalista e extremamente mobile-first, inspirada na estrutura de navegação de aplicativos modernos de live commerce.

Não copie logos, identidade visual, textos, imagens ou elementos proprietários do Whatnot ou TikTok.

Use uma identidade visual própria.

Priorize:

conteúdo visual;

produtos;

vídeos;

lives;

preço;

botão de compra;

navegação simples;

sensação de marketplace moderno.

TELAS PRINCIPAIS:

HOME

Criar uma Home com:

header com logo do aplicativo;

campo de pesquisa;

botão de notificações;

seção "Ao vivo agora";

cards horizontais de lives;

seção "Para você";

feed vertical de vídeos/produtos;

categorias;

produtos em alta.

Cada live deve mostrar:

avatar do vendedor;

nome;

quantidade de espectadores;

thumbnail;

categoria;

indicador vermelho "AO VIVO".

Criar navegação inferior:

Home
Explorar
Criar
Pedidos
Perfil

EXPLORAR

Criar uma página de descoberta com:

pesquisa;

categorias;

produtos populares;

lives;

vídeos;

vendedores populares.

Categorias:

Moda
Tecnologia
Beleza
Casa
Games
Colecionáveis
Esportes
Acessórios
Eletrônicos
Outros

LIVE

Esta é a tela mais importante do aplicativo.

Criar uma interface de transmissão ao vivo simulada.

Estrutura:

vídeo ocupando grande parte da tela;

avatar e nome do vendedor;

número de espectadores;

botão seguir;

chat sobreposto ao vídeo;

comentários simulados;

curtidas;

botão compartilhar;

produto atualmente fixado;

preço;

estoque;

botão "Comprar agora".

Na parte inferior da live criar um card de produto:

[ IMAGEM ]
Nome do produto
R$ 149,90
"12 vendidos"

BOTÃO:
COMPRAR AGORA

Criar também um botão para abrir todos os produtos disponíveis na live.

PRODUTO

Criar página de produto com:

galeria de imagens;

nome;

preço;

desconto;

avaliações;

quantidade vendida;

descrição;

vendedor;

botão seguir vendedor;

estoque;

opções/variações;

botão "Adicionar ao carrinho";

botão "Comprar agora".

CARRINHO

Criar:

produtos;

quantidade;

preço;

subtotal;

frete simulado;

total;

botão "Continuar para pagamento".

CHECKOUT

Criar checkout SIMULADO.

Campos:

endereço;

método de entrega;

método de pagamento;

resumo da compra;

total.

Botão:

"Finalizar pedido"

Após clicar, mostrar uma tela de pedido confirmado.

Não implementar pagamento real nesta primeira versão.

PEDIDOS

Criar página "Meus pedidos".

Estados:

Pagamento aprovado;

Preparando pedido;

Enviado;

Entregue.

Utilizar dados fictícios.

PERFIL DO VENDEDOR

Criar página de vendedor contendo:

avatar;

nome;

selo de vendedor;

avaliação;

seguidores;

botão seguir;

live atual;

produtos;

avaliações.

ÁREA DO VENDEDOR

Criar dashboard para o vendedor.

Mostrar:

vendas;

faturamento;

pedidos;

produtos;

espectadores;

conversão.

Criar botões:

"Adicionar produto"

"Começar live"

"Gerenciar produtos"

"Ver pedidos"

"Editar loja"

CRIAR LIVE

Criar uma tela simulando o processo de iniciar uma live.

Campos:

título da live;

categoria;

descrição;

thumbnail;

produtos que serão vendidos.

Botão:

"Começar live"

Ao clicar, simular uma live ativa.

BANCO DE DADOS:

Utilize Supabase para estruturar os dados do protótipo.

Criar tabelas:

profiles
stores
products
lives
live_products
orders
order_items
followers
messages

Relacionamentos:

profiles → stores
stores → products
stores → lives
lives → live_products
products → live_products
profiles → orders
orders → order_items
lives → messages

Para o protótipo, inserir dados mockados suficientes para que todas as telas pareçam reais.

EXPERIÊNCIA:

O fluxo principal deve ser:

HOME
↓
LIVE
↓
PRODUTO FIXADO
↓
COMPRAR AGORA
↓
CHECKOUT
↓
PEDIDO CONFIRMADO

Também permitir:

HOME
↓
PRODUTO
↓
CARRINHO
↓
CHECKOUT

Criar transições suaves entre as telas.

O aplicativo deve parecer um produto real pronto para receber usuários, mas todos os pagamentos, transmissões e integrações externas devem permanecer simulados nesta primeira versão.

Prioridade máxima:

Mobile-first

Live commerce

Descoberta de produtos

Compra rápida

Interface visual

Navegação simples

Experiência de vendedor

Não adicionar funcionalidades desnecessárias antes de terminar completamente esse fluxo principal.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/93bd9762-eca3-447b-a762-752714679926).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
