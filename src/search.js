// Normaliza texto: minúsculas, sin tildes, sin espacios de más.
export function normalize(str) {
    return String(str ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '') // saca tildes/diacríticos
        .replace(/\s+/g, ' ')
        .trim();
}

// Prepara la lista una sola vez con campos normalizados y un id estable.
export function buildIndex(guests) {
    return guests.map((g, i) => {
        const norm = normalize(g.nombre);
        return {
            id: i,
            nombre: g.nombre,
            mesa: g.mesa,
            _norm: norm,
            _words: norm.split(' ').filter(Boolean),
        };
    });
}

// Busca por cualquier palabra de la fila. Prioriza:
// 1) alguna palabra empieza con la consulta (la "primera palabra" cae acá)
// 2) coincidencia en cualquier parte del nombre
export function searchGuests(index, query, limit = 8) {
    const q = normalize(query);
    if (q.length < 1) return [];

    const scored = [];
    for (const g of index) {
        let score = -1;
        if (g._words.some((w) => w.startsWith(q))) {
            // bonus si es la primera palabra de la fila
            score = g._words[0].startsWith(q) ? 3 : 2;
        } else if (g._norm.includes(q)) {
            score = 1;
        }
        if (score >= 0) scored.push({ g, score });
    }

    scored.sort((a, b) => b.score - a.score || a.g._norm.localeCompare(b.g._norm));
    return scored.slice(0, limit).map((s) => s.g);
}

// Compañeros de la misma mesa (excluye a la propia fila).
export function tableMates(index, guest) {
    return index
        .filter((g) => g.mesa === guest.mesa && g.id !== guest.id)
        .map((g) => g.nombre);
}
