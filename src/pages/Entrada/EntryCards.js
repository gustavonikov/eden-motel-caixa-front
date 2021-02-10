import React from 'react';
import { FiEdit } from 'react-icons/fi';

const EntryCards = ({ number, placa, data, time, onClick }) => {
    const date = new Date();
    const year = date.getFullYear();
    const [day, month] = String(data).split('/');
    const formattedDay = day.padStart(2, 0);
    const formattedMonth = month.padStart(2, 0);
    const formattedDate =  `${formattedDay}/${formattedMonth}/${year}`;

    return (
        <>
            <strong className="title-order">Apartamento {number} <FiEdit className="edit-icon" title="Clique para mudar o apartamento" onClick={onClick} /></strong>

            <strong className="title-order">Veículo</strong>
            <span>Placa do Veículo: {placa.toUpperCase()}</span>

            <strong className="title-order">Data & Hora</strong>
            <span>Data de Entrada: {formattedDate}</span>
            <br/>
            <span>Hora de Entrada: {time}</span>
            <br/>
        </>
    );
};

export default EntryCards;
