import { notion, DataBase_ID } from "../config/notion.js"


export async function list() {
    try {

        const response = await notion.databases.query({
            database_id: DataBase_ID,
        });
        // Iterate results and print only the important fields requested by the user.
        // Rules implemented:
        // - Print property names: Descrição, area, valor, date
        // - For title (Descrição) print title[0].text.content (or plain_text fallback)
        // - For area (rich_text) print rich_text[0].text.content (or plain_text fallback)
        // - For valor (number) print the numeric value
        // - For date (date) print the date.start value
        // - Ignore categoria, Origem, Cartão, Correspondente, Balanço and any other properties

        for (const page of response.results) {
            const props = page.properties || {};

            // title (Descrição)
            const titleProp = Object.values(props).find(p => p.type === 'title');
            const descricao = titleProp?.title?.[0]?.text?.content ?? titleProp?.title?.[0]?.plain_text ?? '';

            // rich_text (area)
            const areaProp = Object.values(props).find(p => p.type === 'rich_text');
            const areaText = areaProp?.rich_text?.[0]?.text?.content ?? areaProp?.rich_text?.[0]?.plain_text ?? '';

            // number (valor)
            const numberProp = Object.values(props).find(p => p.type === 'number');
            const valor = typeof numberProp?.number === 'number' ? numberProp.number : numberProp?.number ?? undefined;

            // date (date.start)
            const dateProp = Object.values(props).find(p => p.type === 'date');
            const dateStart = dateProp?.date?.start ?? '';

            // If nothing important exists, skip
            if (!descricao && !areaText && valor === undefined && !dateStart) continue;

            // Print only the requested fields with labels
            console.log(`Descrição: ${descricao}`);
            console.log(`area: ${areaText}`);
            console.log(`valor: ${valor}`);
            console.log(`date: ${dateStart}`);
            console.log('-------------------------------');
        }
    } catch (err) {
        const message = err && err.message ? err.message : String(err);
        console.error('Erro ao consultar a database:', message);
        // Se o erro indicar que o ID fornecido é uma página, buscamos a página
        if (message.includes('is a page, not a database')) {
            try {
                const page = await notion.pages.retrieve({ page_id: DataBase_ID });
                // Tentamos extrair um título simples (propriedades comuns)
                const titleProp = page.properties && Object.values(page.properties).find(p => p.type === 'title');
                const titleText = titleProp && titleProp.title && titleProp.title.length > 0
                    ? titleProp.title.map(t => t.plain_text).join('')
                    : '(sem título)';
                console.log(`O ID informado é de uma página. Título da página: ${titleText}`);
                console.log('Considere usar o ID de uma database ou abrir a database e copiar o ID correto.');

            } catch (innerErr) {
                console.error('Falha ao recuperar a página para inspeção:', innerErr && innerErr.message ? innerErr.message : innerErr);
            }
        } else {
            console.error(err);
        }
    }
}