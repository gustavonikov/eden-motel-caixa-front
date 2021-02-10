import React from 'react';

const EntryCards = ({ number, placa, data, time, lengthOfStay }) => {
    const date = new Date();
    const year = date.getFullYear();
    const [day, month] = String(data).split('/');
    const formattedDay = day.padStart(2, 0);
    const formattedMonth = month.padStart(2, 0);
    const formattedDate =  `${formattedDay}/${formattedMonth}/${year}`;

    return (
        <>
            <strong className="title-order">Apartamento {number}</strong>

            <strong className="title-order">Veículo</strong>
            <span>Placa do Veículo: {placa.toUpperCase()}</span>

            <strong className="title-order">Data & Hora</strong>
            <span>Data de Entrada: {formattedDate}</span>
            <br/>
            {/* <span>Data de Saída: Faltando</span> */}
            <br/>
            <span>Hora de Entrada: {time}</span>
            <br/>
            {/* <span>Hora de Saida: Faltando</span> */}
            <br/>
            {/*<span>Tempo de Permanencia: {lengthOfStay}</span> */}
        </>
    );
};

export default EntryCards;
