# nodeaplic
 node js typescript knex
API Rest NodeJs,Typescript and knex(query builder)

sqlite3
Criação do Banco de Dados,
conexão,
de dois modos a criação do banco, um através de SQLiteStudio e outra usando knex migrations

Sistema para controle dos items e em quais locais podem ser reciclados

três tabelas:

items
locations
locais_items - tabela de interligação duas chaves strangeiras items_id e locais_id => um item pode ser reciclado
varios locais (tabela 1:N)

Testes efetuado com o Insonmnia.

API Rest function implemented
locations_routers.ts - The POST implemented com cmd for e sem usar transaction.

DEL  - eleminar uma location
PUT  - Upload of file
POST - Criar um location referenciando os items 
GET  - Listar todos os items
GET  - Listar a respectiva location
GET  - Listar locations using to filter the Query "city,uf,items"

Using CORS para habilitar qual dominio pode acessar a api (no caso desenvolvimento esta habilitado todas)