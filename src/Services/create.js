import { notion, DataBase_ID } from "../config/notion.js"

const CATEGORIA = '1c4432f1-2112-818b-825a-ddc2e167f99f'
const CARTAO = '1e9432f1-2112-8058-ac82-d176f2c371c2'
const BALANCO = '1c4432f1-2112-814a-9efb-d4c35b22c643'


export async function create() {
    try {
        const response = await notion.pages.create({
            parent: {
                database_id: DataBase_ID,
            },
            properties: {
                'Descrição': {
                    title: [
                        {
                            text: {
                                content: 'despesa setembro TESTE'
                            },
                        },
                    ],
                },
                'Área': {
                    rich_text: [
                        {
                            text: {
                                content: 'TESTE'
                            },
                        },
                    ],
                },
                'Categoria': {
                    relation: [
                        {
                            id: CATEGORIA,
                        },
                    ],
                },
                "Valor ": {
                    id: "pcnE",
                    type: "number",
                    number: 2000
                },
                'Date': {
                    // Tipo 'date' - formato YYYY-MM-DD
                    date: {
                        start: '2025-10-02',
                    },
                },
                'Origem': {
                    // Tipo 'select' - 'name' deve corresponder exatamente a uma opção existente
                    select: {
                        name: 'Pix',
                    },
                },
                'Cartão': {
                    relation: [
                        {
                            id: CARTAO,
                        },
                    ],
                },
                "Balanço": {
                    "id": "qO%7Cu",
                    "type": "relation",
                    "relation": [
                        {
                            "id": BALANCO
                        }
                    ],
                    "has_more": false
                },
            }
        });
        console.log('Pagina criada com sucesso:');
        console.log('URL da nova pagina:', response.url);
    } catch (error) {
        console.error('Erro ao criar a pagina:', error.message);
    }
}