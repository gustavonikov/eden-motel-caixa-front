import React, { useEffect, useState } from 'react';
import { RiPrinterFill } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';
import { Modal } from '@material-ui/core';

import api from '../../services/api';
import SideBar from '../../components/SideBar';
import EntryCards from './EntryCards';
import CardsLoader from '../../components/PaymentCardsLoader';
import SimpleLoader from '../../components/SimpleLoader';

import './styles.css';
import { confirmAlert, errorAlert } from '../../utils/Alerts';

export default function Cashier() {
    const asideActiveBars = {
        entry: false,
        payment: true,
        products: false,
        vale: false,
        close: false,
        historico: false,
    };

    const [openPrinter, setOpenPrinter] = useState(false);
    const [consumo, setConsumo] = useState([]);
    const [entradas, setEntradas] = useState([]);
    const [openEndPayment, setOpenEndPayment] = useState(false);
    const [dinheiro, setDinheiro] = useState('');
    const [cartao, setCartao] = useState('');
    const [openDiscount, setOpenDiscount] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [entryId, setEntryId] = useState(0);
    const [printData, setPrintData] = useState({});

    useEffect(() => {
        api.get('/consumo').then((response) => {
            console.log(response.data);
            setConsumo(response.data);
        });
    }, []);

    useEffect(() => {
        api.get('/apagar').then((response) => {
            setEntradas(response.data);
        });
    }, []);

    function handleOpenEndPayment() {
        setOpenEndPayment(true);
    }

    function handleClosePayment() {
        setOpenEndPayment(false);
    }

    function handleOpenDiscount(id) {
        setOpenDiscount(true);
        setEntryId(id);
    }

    function handleCloseDiscount() {
        setOpenDiscount(false);
    }

    async function handlePaid(id, number, dinheiro, cartao) {

        if (!dinheiro) {

            dinheiro = 0;

            try {
                await api.put(`/pago/${id}/${number}/${dinheiro}/${cartao}`);
                setEntradas(entradas.filter((entrada) => entrada.id !== id));
            } catch (err) {
                console.log(err);
            }
        }

        if (!cartao) {

            cartao = 0;

            try {
                await api.put(`/pago/${id}/${number}/${dinheiro}/${cartao}`);
                setEntradas(entradas.filter((entrada) => entrada.id !== id));
            } catch (err) {
                console.log(err);
            }

        }

        if (dinheiro !== 0 && cartao !== 0) {

            try {
                await api.put(`/pago/${id}/${number}/${dinheiro}/${cartao}`);
                setEntradas(entradas.filter((entrada) => entrada.id !== id));
            } catch (err) {
                console.log(err);
            }
        }

        handleClosePayment();

    }

    async function handleDiscount(id, discount) {
        try {
            await api.put(`/desconto/${id}/${discount}`);
            setOpenDiscount(false);
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    function handleCalcHoursDiff(entryTime, exitTime) {
        const [entryHours, entryMinutes] = entryTime.split(':');
        const [exitHours, exitMinutes] = exitTime.split(':');

        const entryTimeInMinutes = Number(entryHours) * 60 + Number(entryMinutes);
        const exitTimeInMinutes = Number(exitHours) * 60 + Number(exitMinutes);

        const lenghtOfStayInMinutes = exitTimeInMinutes - entryTimeInMinutes;

        return lenghtOfStayInMinutes;
    }

    function handleCalcLengthOfStay(lengthOfStay) {
        const hours = Math.trunc(lengthOfStay / 60);
        const minutes = lengthOfStay - (hours * 60)

        const result = `${String(hours.toFixed(0)).padStart(2, 0)}:${String(minutes.toFixed(0)).padStart(2, 0)}`;

        return result;
    }

    function handleExtraHours(lengthOfStay, tipo_diaria) {
        let extraHours;
        let hours;
        let minutes;

        if (tipo_diaria === 'DIARIA') {
            if (lengthOfStay > 149) {
                extraHours = lengthOfStay - 149
                hours = Math.trunc(extraHours / 60);
                minutes = extraHours - (hours * 60)
            }
            else {
                extraHours = 0;
                hours = 0;
                minutes = 0;
            }
        } else {
            if (lengthOfStay > 749) {
                extraHours = lengthOfStay - 749;
                hours = Math.trunc(extraHours / 60);
                minutes = extraHours - (hours * 60)
            }
            else {
                hours = 0;
                minutes = 0;
            }
        }

        const result = `${String(hours.toFixed(0)).padStart(2, 0)}:${String(minutes.toFixed(0)).padStart(2, 0)}`;

        return result;
    }

    function handleOpenPrinter(id, number, totalPrice, valor_diaria, desconto, lengthOfStay, extraHours, time, dinheiro, cartao) {
        setPrintData({
            id,
            number,
            totalPrice,
            valor_diaria,
            desconto,
            lengthOfStay,
            extraHours,
            time,
            dinheiro,
            cartao
        })

        setOpenPrinter(true);
    }

    function handlePrintModal() {
        window.print();
        setOpenPrinter(false);
    };

    function handleDeleteProduct(id, product_id, name, quantity, price) {
        confirmAlert(`Deseja realmente excluir "${name}"?`, 'Essa ação não poderá ser revertida.').then((yes) => {
            if (yes) {
                console.log(id, product_id, name, quantity, price);
                const cashier_id = localStorage.getItem('cashierId');

                api.post(`/auditoria/${cashier_id}/${name}/${quantity}/${price}`);

                api.delete(`/consumo/${id}/${product_id}`)

                window.location.reload()
                .catch((error) => {
                    errorAlert('Não foi possível deletar o produto!');
                    console.log(error);
                });
            }
        });
    }

    return (
        <div id="payment-page">
            <SideBar barsState={asideActiveBars} />
            <div className="dashboard-container">
                <ul>
                    {
                        entradas.length === 0 && <CardsLoader />
                    }
                    {entradas.length > 0 &&
                        entradas.map(({ id, number, type, valor_diaria, placa, data, time, desconto }) => {
                            let totalPrice = 0;
                            // substituir 00:58 e diaria pelos valores dinâmicos, no mesmo formato, caso n for, mudar nas funções
                            const extraHours = handleExtraHours(handleCalcHoursDiff(time, '00:58'), 'DIARIA');
                            const lengthOfStay = handleCalcLengthOfStay(handleCalcHoursDiff(time, '00:58'))

                            return (
                                <div className="cards-container" key={id}>
                                    <li>
                                        <strong className="title-order">Consumo</strong>

                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Nome do produto</th>
                                                    <th>Valor</th>
                                                    <th>Qtd</th>
                                                    <th />
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {consumo.length > 0
                                                    && consumo.filter(({ entry_id }) => entry_id === id).map(({ product_id, name, price, quantity }) => {
                                                        const precoComPonto = price.replace(/,/, '.');
                                                        totalPrice += (Number(precoComPonto) * Number(quantity));

                                                        return (
                                                            <tr key={name}>
                                                                <td>{name}</td>
                                                                <td>{
                                                                    new Intl.NumberFormat(
                                                                        { style: 'currency', currency: 'BRL' },
                                                                        { minimumFractionDigits: 2 },
                                                                    ).format(price)
                                                                }
                                                                </td>
                                                                <td>{quantity}</td>
                                                                <td>
                                                                    <MdDelete
                                                                        size={25}
                                                                        title="Clique pra excluir o produto"
                                                                        className="delete-product-icon"
                                                                        onClick={() => handleDeleteProduct(id, product_id, name, quantity, price)}
                                                                    />
                                                                </td>
                                                            </tr>

                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                        {
                                            consumo.length === 0 && (
                                                <div className="loading">
                                                    <h3>Carregando produtos</h3>
                                                    <SimpleLoader />
                                                </div>
                                            )
                                        }
                                        <strong className="title-order">Total à pagar</strong>
                                        <span>
                                            Consumo total: {
                                                new Intl.NumberFormat(
                                                    { style: 'currency', currency: 'BRL' },
                                                    { minimumFractionDigits: 2 },
                                                ).format(totalPrice)
                                            }
                                        </span>
                                        <br />
                                        <br />
                                        <span>
                                            Valor do Apartamento: {
                                                new Intl.NumberFormat(
                                                    { style: 'currency', currency: 'BRL' },
                                                    { minimumFractionDigits: 2 },
                                                ).format(valor_diaria)
                                            }
                                        </span>
                                        <br />
                                        <br />
                                        <span>
                                            Horas extras: {extraHours}
                                        </span>
                                        <br />
                                        <span className="separation" />
                                        <span className="valor-total">
                                            {!desconto ?
                                                <strong>{Intl.NumberFormat({ style: 'currency', currency: 'BRL' }, { minimumFractionDigits: 2 },).format(Number(valor_diaria) + Number(totalPrice))}</strong>
                                                :
                                                <strong>{Intl.NumberFormat({ style: 'currency', currency: 'BRL' }, { minimumFractionDigits: 2 },).format((Number(valor_diaria) + Number(totalPrice)) - desconto)}</strong>
                                            }

                                            <span
                                                role="button"
                                                className="desconto"
                                                title="Clique para inserir o desconto"
                                                onKeyPress={() => handleOpenDiscount(id)}
                                                onClick={() => handleOpenDiscount(id)}
                                                tabIndex={0}
                                            >
                                                Inserir Desconto
                                        </span>
                                        </span>
                                        <button type="submit" className="button print-button" onClick={() => handleOpenPrinter(id, number, totalPrice, valor_diaria, desconto, lengthOfStay, extraHours, time)}>
                                            <RiPrinterFill className="printer-icon" size={23} />
                                        Imprimir
                                    </button>
                                    </li>
                                    <li key={id}>
                                        <EntryCards
                                            number={number}
                                            type={type}
                                            diaria={valor_diaria}
                                            placa={placa}
                                            data={data}
                                            time={time}
                                            lengthOfStay={lengthOfStay}
                                        />

                                        <button
                                            type="button"
                                            className="button end-payment"
                                            onClick={() => handleOpenEndPayment()}
                                        >
                                            Finalizar Pagamento
                                    </button>
                                    </li>
                                </div>

                            );
                        })}
                </ul>
            </div>
            <Modal
                id="payment-modal"
                open={openEndPayment}
                onClose={handleClosePayment}
                aria-labelledby="endPayment"
                aria-describedby="simple-modal-description"
            >
                <div className="modal-container">
                    <div className="modal-content">
                        <h2>Forma de Pagamento</h2>
                        <div className="total-payment">
                            <strong>Total: </strong>
                            <span className="valor-total-modal">
                                {
                                    !printData.desconto ?
                                        <strong>{Intl.NumberFormat({ style: 'currency', currency: 'BRL' }, { minimumFractionDigits: 2 },).format(Number(printData.valor_diaria) + Number(printData.totalPrice))}</strong>
                                        :
                                        <strong>{Intl.NumberFormat({ style: 'currency', currency: 'BRL' }, { minimumFractionDigits: 2 },).format((Number(printData.valor_diaria) + Number(printData.totalPrice)) - printData.desconto)}</strong>
                                }
                            </span>
                        </div>
                        <div className="input-container">
                            <label htmlFor="nome">
                                <strong>Dinheiro</strong>
                                <input
                                    name="nome"
                                    type="text"
                                    value={dinheiro}
                                    onChange={({ target }) => setDinheiro(target.value)}
                                    required
                                />
                            </label>
                            <label htmlFor="nome">
                                <strong>Cartão</strong>
                                <input
                                    name="nome"
                                    type="text"
                                    value={cartao}
                                    onChange={({ target }) => setCartao(target.value)}
                                    required
                                />
                            </label>
                        </div>
                        <div className="button-container">
                            <button type="button" className="button" onClick={handleClosePayment}>
                                Cancelar
                            </button>
                            <button type="submit" className="button" onClick={() => handlePaid(printData.id, printData.number, dinheiro, cartao)}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                id="discount-modal"
                open={openDiscount}
                onClose={handleCloseDiscount}
                aria-labelledby="discount"
            >
                <div className="modal-container">
                    <label htmlFor="desconto">
                        <strong>Insira o desconto</strong>
                        <input
                            className="discount-input"
                            name="desconto"
                            type="text"
                            value={discount}
                            onChange={({ target }) => setDiscount(target.value)}
                            required
                        />
                    </label>
                    <div className="button-container">
                        <button type="button" className="button" onClick={handleCloseDiscount}>
                            Cancelar
                        </button>
                        <button type="button" className="button" onClick={() => handleDiscount(entryId, discount)}>
                            Adicionar
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                id="print-modal"
                open={openPrinter}
                aria-labelledby="printer"
                onRendered={handlePrintModal}
            >
                <div className="modal-container">
                    <header>
                        EDEN MOTEL LTDA <br />
                        Apartamento: {printData.number}<br />
                        Horario de Entrada..: {printData.time} - 10/12/2020<br />
                        Horario de Saida....: 10:33 - 10/12/2020<br />
                        Tempo de Permanencia: 00:00<br />
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
                                {consumo.filter(({ entry_id }) => entry_id === printData.id).map(({ name, price, quantity }) => (
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
