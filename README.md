## Notion

<img width="472" height="157" alt="image" src="https://github.com/user-attachments/assets/2f3e84cf-fd53-4a69-9e23-61f7540d95fb" />

## Projeto de Automação Financeira via WhatsApp e Notion

## Responsáveis pelo desenvolvimento:
•	Tiago Santos Felisberto

•	Pietro Fontenelle


## Orientadores:
•	Valcelio Fontenelle

•	Wagner Mobile Costa
________________________________________
## 1. Objetivo do Projeto
O propósito deste projeto é criar uma automação simples e funcional que permita registrar e controlar todas as movimentações financeiras da empresa (entradas e saídas) através de um grupo no WhatsApp. Esses registros deverão ser enviados automaticamente para uma planilha no Notion, que já estará formatada para receber e organizar os dados.
Com isso, buscamos centralizar as informações financeiras, facilitar o acompanhamento diário e gerar um relatório confiável de entradas (receitas) e saídas (despesas).
________________________________________
## 2. Como deve funcionar o processo
1.	Registro no WhatsApp:
   
o	Todos os colaboradores vão registrar no grupo do WhatsApp as movimentações financeiras.

o	O formato da mensagem deve ser simples e padronizado, por exemplo:

## Exemplo de mensagens no WhatsApp:
o	Entrada | Conserto de chuveiro | 120,00 | 05/10/2025 | Interlagos

o	Saída | Compra de resistência elétrica | 35,00 | 05/10/2025 | Guarapiranga

## 3.	Automação:

o	A automação deve ler as mensagens do grupo do WhatsApp.

o	Identificar se a mensagem é uma entrada ou saída.

o	Extrair os dados principais:

	Tipo (entrada ou saída)

	Descrição

	Valor

	Data

	Área (local onde o serviço foi realizado ou gasto ocorreu)

## 5.	Envio ao Notion:

o	Esses dados devem ser enviados automaticamente para uma tabela no Notion.

o	A tabela terá os seguintes campos:

	Tipo (Entrada / Saída)

	Descrição

	Valor

	Data

	Área (local do serviço, ex.: Interlagos, Guarapiranga, Aracati, Imbuguaçu)

## Exemplo de como deve aparecer no Notion:
Tipo	Descrição	Valor	Data	Área

Entrada	Conserto de chuveiro	120,00	05/10/2025	Interlagos

Saída	Compra de resistência elétrica	35,00	05/10/2025	Guarapiranga

## 6.	Organização no Notion:

o	Entradas serão contabilizadas em uma parte da planilha.

o	Saídas serão contabilizadas em outra parte.

o	O Notion deve permitir visualização de:

	Total de entradas

	Total de saídas

	Saldo final

	Relatórios filtrados por área (ex.: quanto entrou e saiu em Interlagos, Guarapiranga, etc.)
________________________________________

## 3. Requisitos Técnicos
•	Conexão entre WhatsApp e Notion (pode ser feita através de API, ferramentas como Make, Zapier, ou programação própria).
•	Padronização das mensagens no WhatsApp para que a automação consiga entender corretamente.
•	Configuração da planilha no Notion já formatada para receber os dados.
•	Testes para garantir que os lançamentos estão sendo enviados corretamente.
________________________________________

## 4. Responsabilidades
•	Tiago e Pietro Fontenelle: desenvolver a automação, configurar a comunicação entre WhatsApp e Notion e garantir que os dados sejam enviados corretamente.

•	Valcelio Fontenelle e Wagner: orientar, revisar e validar os resultados da automação, além de fornecer a estrutura inicial no Notion.

________________________________________
## 5. Entregáveis do Projeto

•	Automação funcional entre WhatsApp e Notion.

•	Planilha no Notion recebendo e organizando dados de entradas e saídas.

•	Manual simples de como usar o sistema (como escrever a mensagem no WhatsApp).

________________________________________
## 6. Prazo e Testes
•	O projeto deve ser concluído em etapas:

1.	Configuração inicial do Notion.

2.	Conexão do WhatsApp com a automação.

3.	Envio de dados de teste.

4.	Revisão e ajustes finais.

•	Após cada etapa, será feito um teste prático para validar.
________________________________________
## 7. Considerações Finais
Este é um projeto inicial de automação, voltado para aprendizado prático de programação e integração de ferramentas. É fundamental manter o processo simples, claro e funcional. O objetivo não é criar algo complexo, mas sim eficiente e fácil de usar para todos que vão registrar as movimentações.
O sucesso do projeto será medido quando todas as entradas e saídas lançadas no grupo do WhatsApp forem automaticamente registradas na planilha do Notion, permitindo acompanhamento em tempo real da saúde financeira da empresa.
