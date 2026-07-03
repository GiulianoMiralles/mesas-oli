import { useMemo, useRef, useState } from 'react';
import guestsData from './guests.json';
import { buildIndex, searchGuests, tableMates } from './search.js';

export default function App() {
    const index = useMemo(() => buildIndex(guestsData), []);
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(null);
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
        inputRef.current?.blur();
    }

    function reset() {
        setSelected(null);
        setQuery('');
        setTouched(false);
        setTimeout(() => inputRef.current?.focus(), 50);
    }

    const showNoResults = touched && !selected && query.trim().length >= 2 && results.length === 0;

    return (
        <div className="page">
            <div className="card">
                <header className="hero">
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
                    <div className="result">
                        <p className="result__hi">¡Hola, {firstName(selected.nombre)}!</p>
                        <div className="result__mesa">
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
