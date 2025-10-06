import { notion, DataBase_ID } from "../config/notion.js";

// Fixed relation IDs (defaults requested by the user)
//const CATEGORIA = '1c4432f1-2112-818b-825a-ddc2e167f99f';
//const CARTAO = '1e9432f1-2112-8058-ac82-d176f2c371c2';
//const BALANCO = '1c4432f1-2112-814a-9efb-d4c35b22c643';

// Helper: try multiple possible input keys (accented / unaccented / different cases)
function pick(obj, ...keys) {
	if (!obj) return undefined;
	for (const k of keys) {
		if (Object.prototype.hasOwnProperty.call(obj, k)) return obj[k];
	}
	// try case-insensitive match
	const lower = Object.keys(obj).reduce((acc, cur) => {
		acc[cur.toLowerCase()] = obj[cur];
		return acc;
	}, {});
	for (const k of keys) {
		const val = lower[k.toLowerCase()];
		if (val !== undefined) return val;
	}
	return undefined;
}

export async function create(raw) {
	try {
		if (!raw) {
			console.log(
				"Uso: npm start -- create '{ \"Descrição\": \"Teste\", \"Valor\":100, \"Origem\":\"Pix\" }'"
			);
			return;
		}

		// raw usually comes in as a JSON string from the CLI
		let data;
		if (typeof raw === 'string') {
					try {
						data = JSON.parse(raw);
					} catch (err) {
						// Fallbacks: try to extract JSON substring and normalize quotes (handles PowerShell quoting)
								try {
									// find first { and last }
									const first = raw.indexOf('{');
									const last = raw.lastIndexOf('}');
									let candidate = raw;
									if (first !== -1 && last !== -1 && last > first) {
										candidate = raw.slice(first, last + 1);
									}

									// normalize common quote types
									candidate = candidate.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim();

									// If keys are unquoted (e.g. { Descrição:Teste, Valor:100 }) add quotes around keys
									// Add quotes to keys: match start or comma, optional spaces, then key (until colon)
									candidate = candidate.replace(/([\{,\s])([A-Za-zÀ-ÿ0-9_\-]+)\s*:/g, (m, p1, p2) => `${p1}\"${p2}\":`);

									// Now ensure values that are plain words (not numbers, booleans, null, objects, arrays or quoted) are quoted
									candidate = candidate.replace(/:\s*([^",\{\[\]\}][^,\}]*)/g, (m, p1) => {
										const v = p1.trim();
										// If it's a number
										if (/^-?\d+(?:\.\d+)?$/.test(v)) return `: ${v}`;
										if (/^(true|false|null)$/i.test(v)) return `: ${v.toLowerCase()}`;
										// otherwise quote the string value (remove trailing commas/spaces already handled by regex)
										// remove possible trailing commas/spaces
										const cleaned = v.replace(/,$/, '').trim();
										return `: \"${cleaned}\"`;
									});

									data = JSON.parse(candidate);
								} catch (err2) {
									console.error('Erro ao interpretar JSON de entrada. raw:', raw);
									console.error('Erro original:', err.message);
									return;
								}
					}
		} else if (typeof raw === 'object') {
			data = raw;
		} else {
			console.error('Entrada inválida. Passe um JSON como string.');
			return;
		}

		// Read required fields from input (support accent/no-accent variants)
		const descricao = pick(data, 'Descrição', 'Descricao', 'descricao');
		const area = pick(data, 'Área', 'Area', 'area');
		const valorRaw = pick(data, 'Valor', 'valor', 'VALUE', 'Value');
		const origem = pick(data, 'Origem', 'origem');

		// Validate required fields (Descrição, Valor, Origem)
		if (!descricao) {
			console.error('Campo obrigatório ausente: Descrição');
			return;
		}
		if (valorRaw === undefined || valorRaw === null || Number.isNaN(Number(valorRaw))) {
			console.error('Campo obrigatório ausente ou inválido: Valor');
			return;
		}
		if (!origem) {
			console.error('Campo obrigatório ausente: Origem');
			return;
		}

		const valor = Number(valorRaw);

			// Fetch database schema to map property names exactly as they exist in Notion
			let dbInfo;
			try {
				dbInfo = await notion.databases.retrieve({ database_id: DataBase_ID });
			} catch (err) {
				console.error('Falha ao recuperar schema da database:', err && err.message ? err.message : err);
				return;
			}

			const dbProps = dbInfo.properties || {};

			const normalize = (s) =>
				String(s)
					.normalize('NFD')
					.replace(/\p{Diacritic}/gu, '')
					.toLowerCase()
					.replace(/[^a-z0-9]/g, '');

			function findPropName(candidates, typeFallback) {
				// candidates: array of possible names
				for (const cand of candidates) {
					const norm = normalize(cand);
					for (const [k, v] of Object.entries(dbProps)) {
						if (normalize(k) === norm) return k;
					}
				}
				// fallback by type
				for (const [k, v] of Object.entries(dbProps)) {
					if (v.type === typeFallback) return k;
				}
				return undefined;
			}

			const titleKey = findPropName(['Descrição', 'Descricao', 'descricao', 'titulo', 'title'], 'title');
			const numberKey = findPropName(['Valor', 'valor', 'amount', 'valor (brl)'], 'number');
			const areaKey = findPropName(['Área', 'Area', 'area', 'observação', 'observacao'], 'rich_text');
			const origemKey = findPropName(['Origem', 'origem', 'source'], 'select');
			const categoriaKey = findPropName(['Categoria', 'categoria'], 'relation');
			const cartaoKey = findPropName(['Cartão', 'Cartao', 'cartao'], 'relation');
			const balancoKey = findPropName(['Balanço', 'Balanco', 'balanco'], 'relation');
			const dateKey = findPropName(['Data', 'data', 'Date', 'date'], 'date');

			if (!titleKey) {
				console.error('Não foi possível localizar a propriedade de título na database (Descrição).');
				return;
			}
			if (!numberKey) {
				console.error('Não foi possível localizar a propriedade numérica na database (Valor).');
				return;
			}
			if (!origemKey) {
				console.error('Não foi possível localizar a propriedade select na database (Origem).');
				return;
			}

			// Build properties object using actual DB property names
			const properties = {};
			properties[titleKey] = {
				title: [
					{
						text: { content: String(descricao) },
					},
				],
			};
			properties[numberKey] = { number: valor };
			properties[origemKey] = { select: { name: String(origem) } };

			if (categoriaKey) properties[categoriaKey] = { relation: [{ id: CATEGORIA }] };
			if (cartaoKey) properties[cartaoKey] = { relation: [{ id: CARTAO }] };
			if (balancoKey) properties[balancoKey] = { relation: [{ id: BALANCO }] };

			if (area !== undefined && area !== null && String(area).trim() !== '' && areaKey) {
				properties[areaKey] = { rich_text: [{ text: { content: String(area) } }] };
			}

				// Helper to get today's date in YYYY-MM-DD
				function getTodayISO() {
					const d = new Date();
					const yyyy = d.getFullYear();
					const mm = String(d.getMonth() + 1).padStart(2, '0');
					const dd = String(d.getDate()).padStart(2, '0');
					return `${yyyy}-${mm}-${dd}`;
				}

				// Always set date property to today if the DB has a date property
				if (dateKey) {
					properties[dateKey] = { date: { start: getTodayISO() } };
				}

		// Optional rich_text area
		if (area !== undefined && area !== null && String(area).trim() !== '') {
			properties['Área'] = {
				rich_text: [
					{
						text: {
							content: String(area),
						},
					},
				],
			};
		}

		// Build payload and send to Notion
		const payload = {
			parent: { database_id: DataBase_ID },
			properties,
		};

		console.log('Enviando para Notion o payload:');
		console.log(JSON.stringify(payload, null, 2));

		const response = await notion.pages.create(payload);

		console.log('Página criada com sucesso. ID:', response.id);
		return response;
	} catch (err) {
		console.error('Erro ao criar página no Notion:', err && err.message ? err.message : err);
		// If Notion returns a helpful body, print it for debugging
		if (err && err.body) console.error('Resposta do Notion:', err.body);
	}
}
