import React, { useEffect, useState } from 'react';
import { Modal } from '@material-ui/core';
import { FaSearch } from 'react-icons/fa';
import { RiPrinterFill } from 'react-icons/ri';

import SideBar from '../../components/SideBar';
import SimpleLoader from '../../components/SimpleLoader';
import api from '../../services/api';

import './styles.css';

export default function Historico() {
    const asideActiveBars = {
        entry: false,
        payment: false,
        products: false,
        vale: false,
        close: false,
        historico: true,
    };

    const [historicoDasEntradas, setHistoricoDasEntradas] = useState([]);
    const [printData, setPrintData] = useState({});
    const [open, setOpen] = useState(false);

    useEffect(() => {
        api.get('/historico-entradas')
        .then((res) => setHistoricoDasEntradas(res.data))
        .catch((error) => console.log(error))
    }, []);

    function handleOpenPrint(apt_id) {
        setPrintData(historicoDasEntradas.find(({ id }) => id === apt_id));

        setOpen(true);
    }

    function handlePrintModal() {
        console.log(printData);
        window.print();
        setOpen(false);
    };

    function handleSearch() {
        let td; let i; let txtValue;

        const input = document.getElementById('history-input');
        const filter = input.value;
        const table = document.getElementById('history-table');
        const tr = table.getElementsByTagName('tr');

        for (i = 0; i < tr.length; i += 1) {
            [td = 0] = tr[i].getElementsByTagName('td');

            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.indexOf(filter) > -1) {
                    tr[i].style.display = '';
                } else {
                    tr[i].style.display = 'none';
                }
            }
        }
    }

    return (
        <div id="history-page">
            <SideBar barsState={asideActiveBars} />
            <div className="history-container">
                <header>
                    <div className="input-wrapper">
                        <FaSearch size={30} color="#122" />
                        <input
                            type="text"
                            id="history-input"
                            onKeyUp={() => handleSearch()}
                            placeholder="Pesquise o apartamento..."
                        />
                    </div>
                </header>
                <table id="history-table">
                    <thead>
                        <tr className="header">
                            <th>Apartamento</th>
                            <th>Data de saída</th>
                            <th>Horário de saída</th>
                            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                    {
                        historicoDasEntradas.length > 0
                        && historicoDasEntradas.map(({ id, number, exit_date, exit_time }) => (
                            <tr key={id}>
                                <td>{number}</td>
                                <td>{exit_date}</td>
                                <td>{exit_time}</td>
                                <td>
                                <RiPrinterFill 
                                    className="print-icon" 
                                    size={30} 
                                    onClick={() => handleOpenPrint(id)}
                                />
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                {
                    historicoDasEntradas.length === 0 && (
                        <div className="loading">
                            <h2>Carregando histórico</h2>
                            <SimpleLoader />
                        </div>
                    )
                }
            </div>
            <Modal
                id="print-modal"
                open={open}
                aria-labelledby="printer"
                onRendered={handlePrintModal}
            >
                <div className="modal-container">
                    <header>
                        EDEN MOTEL LTDA <br />
                        Apartamento: {printData.number}<br />
                        Horario de Entrada..: {printData.entry_time} - {printData.entry_date}<br />
                        Horario de Saida....: {printData.exit_time} - {printData.exit_date}<br />
                        Tempo de Permanencia: {printData.length_stay}<br />
                        Horas extras........: {printData.extraHours}<br />
                    </header>
                    --------------------------------------
                    <main>
                        Consumo
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome do produto</th>
                                    <th>Valor</th>
                                    <th>Qtd</th>
                                </tr>
                            </thead>
                            <tbody>
                                {printData.consumo.map(({ name, price, quantity }) => (
                                    <tr key={name}>
                                        <td>{name}</td>
                                        <td>{price}</td>
                                        <td>{quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        --------------------------------------<br />
                        Total à pagar<br />
                        <span>Consumo total.......: {Intl.NumberFormat({ style: 'currency', currency: 'BRL' }, { minimumFractionDigits: 2 },).format(Number(printData.totalPrice))}</span>
                        <br />
                        <span>Valor do Apartamento: {Intl.NumberFormat({ style: 'currency', currency: 'BRL' }, { minimumFractionDigits: 2 },).format(Number(printData.valor_diaria))}</span>
                        <br />
                        <br />
                        {
                            !printData.desconto ?
                                <span> Valor da conta......: {Intl.NumberFormat({ style: 'currency', currency: 'BRL' }, { minimumFractionDigits: 2 },).format(Number(printData.valor_diaria) + Number(printData.totalPrice))}</span>
                                :
                                <>
                                    <span> Valor do desconto...: {Intl.NumberFormat({ style: 'currency', currency: 'BRL' }, { minimumFractionDigits: 2 },).format(printData.desconto)}</span>
                                    <br />
                                    <span> Valor da conta......: {
                                        Intl.NumberFormat({ style: 'currency', currency: 'BRL' }, { minimumFractionDigits: 2 },).format((Number(printData.valor_diaria) + Number(printData.totalPrice)) - printData.desconto)
                                    }</span>
                                </>
                        }
                        <br />
                    </main>

                    <footer>
                        OBRIGADO PELA PREFERENCIA, VOLTE SEMPRE!
                    </footer>
                </div>
            </Modal>
        </div>
    );
}
