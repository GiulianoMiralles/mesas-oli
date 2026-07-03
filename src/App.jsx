import { useMemo, useRef, useState } from 'react';
import guestsData from './guests.json';
import { buildIndex, searchGuests, tableMates } from './search.js';

const STORAGE_KEY = 'mesas-oli:nombre';

export default function App() {
    const index = useMemo(() => buildIndex(guestsData), []);
    const saved = useMemo(() => {
        const nombre = localStorage.getItem(STORAGE_KEY);
        return nombre ? index.find((g) => g.nombre === nombre) ?? null : null;
    }, [index]);
    const [query, setQuery] = useState(saved ? saved.nombre : '');
    const [selected, setSelected] = useState(saved);
    const [touched, setTouched] = useState(false);
    const inputRef = useRef(null);

    const results = useMemo(
        () => (selected ? [] : searchGuests(index, query)),
        [index, query, selected]
    );

    const mates = useMemo(
        () => (selected ? tableMates(index, selected) : []),
        [index, selected]
    );

    function pick(guest) {
        setSelected(guest);
        setQuery(guest.nombre);
        localStorage.setItem(STORAGE_KEY, guest.nombre);
        inputRef.current?.blur();
    }

    function reset() {
        setSelected(null);
        setQuery('');
        setTouched(false);
        localStorage.removeItem(STORAGE_KEY);
        setTimeout(() => inputRef.current?.focus(), 50);
    }

    const showNoResults = touched && !selected && query.trim().length >= 2 && results.length === 0;

    return (
        <div className="page">
            <Petals />
            <div className="card">
                <header className="hero">
                    <div className="hero__portrait">
                        <img className="hero__photo" src="/oli.jpg" alt="Oli" />
                        <Crown />
                        <Fawn />
                    </div>
                    <p className="hero__eyebrow">Bautismo y 1° Cumple de</p>
                    <h1 className="hero__name">Oli</h1>
                    <p className="hero__sub">Escribí tu nombre y encontrá tu mesa</p>
                </header>

                {!selected && (
                    <div className="search">
                        <input
                            ref={inputRef}
                            className="search__input"
                            type="text"
                            inputMode="text"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck="false"
                            placeholder="Tu nombre…"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setTouched(true);
                            }}
                            aria-label="Buscar tu nombre"
                        />

                        {results.length > 0 && (
                            <ul className="suggestions">
                                {results.map((g) => (
                                    <li key={g.id}>
                                        <button
                                            type="button"
                                            className="suggestions__item"
                                            onClick={() => pick(g)}
                                        >
                                            <span className="suggestions__name">{g.nombre}</span>
                                            <span className="suggestions__mesa">Mesa {g.mesa}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {showNoResults && (
                            <p className="hint">
                                No encontramos ese nombre. Probá con tu nombre o apellido, o avisale
                                a la familia. 💗
                            </p>
                        )}
                    </div>
                )}

                {selected && (
                    <div className="result" key={selected.id}>
                        <p className="result__hi">¡Hola, {firstName(selected.nombre)}!</p>
                        <div className="result__mesa">
                            <Hearts />
                            <span className="result__label">Tu mesa</span>
                            <span className="result__number">{selected.mesa}</span>
                        </div>
                        <p className="result__fullname">{selected.nombre}</p>

                        {mates.length > 0 && (
                            <div className="mates">
                                <p className="mates__title">También en tu mesa</p>
                                <ul className="mates__list">
                                    {mates.map((name) => (
                                        <li key={name}>{name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button type="button" className="result__again" onClick={reset}>
                            Buscar otro nombre
                        </button>
                    </div>
                )}

                <footer className="foot">
                    <span className="foot__heart">♥</span>
                    <span>¡Gracias por acompañarnos en este día tan especial!</span>
                </footer>
            </div>
        </div>
    );
}

function firstName(full) {
    return String(full).trim().split(/\s+/)[0];
}

// Pétalos ambient que caen detrás de la card (posiciones/tiempos en el SCSS).
function Petals() {
    return (
        <div className="petals" aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => (
                <span key={i} />
            ))}
        </div>
    );
}

// Corazoncitos que flotan una sola vez al revelar la mesa.
function Hearts() {
    return (
        <div className="hearts" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
                <span key={i}>♥</span>
            ))}
        </div>
    );
}

// Florcita de 5 pétalos, compartida entre la corona de la foto y la cervatilla.
// Colores hardcodeados acá porque el SVG no ve las variables SCSS.
function flor(cx, cy, r, color) {
    return (
        <g>
            {[0, 72, 144, 216, 288].map((a) => (
                <circle
                    key={a}
                    cx={cx + r * Math.cos((a * Math.PI) / 180)}
                    cy={cy + r * Math.sin((a * Math.PI) / 180)}
                    r={r * 0.78}
                    fill={color}
                />
            ))}
            <circle cx={cx} cy={cy} r={r * 0.55} fill="#fff6f2" />
        </g>
    );
}

// Corona de flores que se apoya sobre la foto de Oli.
function Crown() {
    return (
        <svg className="hero__crown" viewBox="0 0 100 32" aria-hidden="true">
            <ellipse cx="36" cy="15" rx="6" ry="3" transform="rotate(-22 36 15)" fill="#a9bb8f" />
            <ellipse cx="64" cy="15" rx="6" ry="3" transform="rotate(22 64 15)" fill="#a9bb8f" />
            {flor(28, 20, 6.5, '#d98aa0')}
            {flor(50, 14, 7.5, '#e9a7ba')}
            {flor(72, 20, 6.5, '#d98aa0')}
        </svg>
    );
}

// Cervatilla con corona de flores, en la paleta de la invitación.
function Fawn() {
    return (
        <svg className="hero__fawn" viewBox="0 0 140 112" role="img" aria-label="Cervatilla">
            {/* orejas */}
            <ellipse cx="31" cy="40" rx="17" ry="10" transform="rotate(-35 31 40)" fill="#e8c9ab" stroke="#7c5a4e" strokeWidth="2" />
            <ellipse cx="31" cy="40" rx="9" ry="4.5" transform="rotate(-35 31 40)" fill="#f7d9df" />
            <ellipse cx="109" cy="40" rx="17" ry="10" transform="rotate(35 109 40)" fill="#e8c9ab" stroke="#7c5a4e" strokeWidth="2" />
            <ellipse cx="109" cy="40" rx="9" ry="4.5" transform="rotate(35 109 40)" fill="#f7d9df" />
            {/* cabeza */}
            <ellipse cx="70" cy="66" rx="38" ry="34" fill="#e8c9ab" stroke="#7c5a4e" strokeWidth="2" />
            {/* hocico */}
            <ellipse cx="70" cy="82" rx="20" ry="14" fill="#fff6f2" />
            {/* manchitas */}
            <circle cx="44" cy="54" r="2.4" fill="#fff6f2" />
            <circle cx="52" cy="46" r="2" fill="#fff6f2" />
            <circle cx="96" cy="54" r="2.4" fill="#fff6f2" />
            <circle cx="88" cy="46" r="2" fill="#fff6f2" />
            {/* ojos cerrados */}
            <path d="M48 64 q6 6 12 0" fill="none" stroke="#7c5a4e" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M80 64 q6 6 12 0" fill="none" stroke="#7c5a4e" strokeWidth="2.4" strokeLinecap="round" />
            {/* cachetes */}
            <circle cx="45" cy="74" r="5.5" fill="#e9a7ba" opacity="0.55" />
            <circle cx="95" cy="74" r="5.5" fill="#e9a7ba" opacity="0.55" />
            {/* nariz y boca */}
            <path d="M64.5 78 h11 q1.6 0 .8 1.4 l-4.6 5.2 q-1.7 1.9 -3.4 0 l-4.6 -5.2 q-.8 -1.4 .8 -1.4 z" fill="#7c5a4e" />
            <path d="M70 86 q0 4.5 -4.5 5.5 M70 86 q0 4.5 4.5 5.5" fill="none" stroke="#7c5a4e" strokeWidth="2" strokeLinecap="round" />
            {/* corona de flores */}
            <ellipse cx="58" cy="29" rx="5" ry="2.6" transform="rotate(-24 58 29)" fill="#a9bb8f" />
            <ellipse cx="82" cy="29" rx="5" ry="2.6" transform="rotate(24 82 29)" fill="#a9bb8f" />
            {flor(50, 34, 5, '#d98aa0')}
            {flor(70, 28, 6, '#e9a7ba')}
            {flor(90, 34, 5, '#d98aa0')}
        </svg>
    );
}
