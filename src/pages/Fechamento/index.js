import { React, useEffect, useState } from 'react';

import IniciarFechamento from './IniciarFechamento';
import SideBar from '../../components/SideBar';
import api from '../../services/api';

import './styles.css';

const cashierId = localStorage.getItem('cashierId');

export default function Fechamento() {
    const [header, setHeader] = useState([]);
    const [valorFechamento, setValorFechamento] = useState([]);
    const [valeFechamento, setValeFechamento] = useState([]);
    const [valeTotalFechamento, setValeTotalFechamento] = useState([]);
    const [entradas, setEntradas] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [dinheiro, setDinheiro] = useState([]);
    const [cartao, setCartao] = useState([]);
    const [dinheiroDoCaixa, setDinheiroDoCaixa] = useState('');
    const [cartaoDoCaixa, setCartaoDoCaixa] = useState('');
    const [mostrarRelatorio, setMostrarRelatorio] = useState(false);

    const asideActiveBars = {
        entry: false,
        payment: false,
        products: false,
        vale: false,
        close: true,
        historico: false,
    };

    const date = new Date();
    const hours = String(date.getHours()).padStart(2, 0);
    const minutes = String(date.getMinutes()).padStart(2, 0);
    const exitTime = `${hours}:${minutes}`;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, 0);
    const day = String(date.getDate()).padStart(2, 0);
    const exitDate = `${day}/${month}/${year}`;

    useEffect(() => {
        api.get(`/headerCashier/${cashierId}`).then((response) => {
            console.log(response.data);
            setHeader(response.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/consumoTotal/${cashierId}`).then((response) => {
            setValorFechamento(response.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/entradasCashier/${cashierId}`).then((response) => {
            setEntradas(response.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/produtosCashier/${cashierId}`).then((response) => {
            setProdutos(response.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/valesCashier/${cashierId}`).then((response) => {
            setValeFechamento(response.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/valesTotalCashier/${cashierId}`).then((response) => {
            setValeTotalFechamento(response.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/dinheiroCashier/${cashierId}`).then((response) => {
            setDinheiro(response.data);
        });
    }, []);

    useEffect(() => {
        api.get(`/cartaoCashier/${cashierId}`).then((response) => {
            setCartao(response.data);
        });
    }, []);

    function adjustDate(db_date) {
        const date = new Date();
        const year = date.getFullYear();
        const [day, month] = String(db_date).split('/');
        const formattedDay = day.padStart(2, 0);
        const formattedMonth = month.padStart(2, 0);
        const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;

        return formattedDate;
    }

    function adjustValue(value) {
        return Intl.NumberFormat(
            { style: 'currency', currency: 'BRL' }, { minimumFractionDigits: 2 }
        ).format(value);
    }

    return (
        <div id="report-page">
            <SideBar barsState={asideActiveBars} />
            {
                !mostrarRelatorio ?
                    <IniciarFechamento 
                        valor_dinheiro={dinheiroDoCaixa}
                        dinheiroChange={setDinheiroDoCaixa}
                        valor_cartao={cartaoDoCaixa}
                        cartaoChange={setCartaoDoCaixa}
                        abrirFechamento={setMostrarRelatorio}
                    />
                    :
                    (
                        <div className="report-container">
                            <h1>Relatório de fechamento</h1>
                            <div className="report-content">
                                {header.map(({ login, cash_opening_date, cash_opening_time }) => (
                                    <header>
                                        INFORMAÇÕES DE FECHAMENTO DO CAIXA <br />
                                        ------------------------------------------
                                        <br />
                                        CAIXA: {login}<br />
                                        Data Abert/Fecham: {adjustDate(cash_opening_date)} à {exitDate}<br />
                                        Hora Abert/Fecham: {cash_opening_time} às {exitTime}<br />
                                        Valor de Abertura: 0,00<br />
                                        Valor de Fecham..: {adjustValue(parseFloat(valorFechamento.consumoTotal) + parseFloat(valorFechamento.diariaTotal))}<br />
                                    </header>
                                ))}
                                ------------------------------------------
                                <main>
                                    <table id="entries">
                                        <thead>
                                            <tr>
                                                <th>Ap</th>
                                                <th>Hr.Ent</th>
                                                <th>Hr.Sai</th>
                                                <th>Placa</th>
                                                <th>Valor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entradas.map(({ id, number, time, exitime, placa, valor_diaria, consumo, payment_type }) => (
                                                <tr key={id}>
                                                    <td>{number}</td>
                                                    <td>{time}</td>
                                                    <td>{exitime}</td>
                                                    <td>{placa.toUpperCase()}</td>
                                                    <td>{adjustValue(parseFloat(valor_diaria) + parseFloat(consumo))}</td>
                                                    <td>{payment_type}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    ------------------------------------------<br />
                                    <span id="total-entries">{entradas.length}</span><span>T.Cons: {adjustValue(valorFechamento.consumoTotal)} </span><span>T.Serv: {adjustValue(valorFechamento.diariaTotal)}</span><span>{adjustValue(parseFloat(valorFechamento.consumoTotal) + parseFloat(valorFechamento.diariaTotal))}</span>
                                    <br />
                                    <br />
                                    ------------------------------------------<br />
                                    PRODUTOS CONSUMIDOS <br />
                                    ------------------------------------------<br />
                                    <table id="products">
                                        <tbody>
                                            {produtos.map(({ id, name, quantity }) => (
                                                <tr key={id}>
                                                    <td>{name} -</td>
                                                    <td>{quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <br />
                                    ------------------------------------------<br />
                                    VALES <br />
                                    ------------------------------------------<br />
                                    <table id="tickets">
                                        <thead>
                                            <tr>
                                                <th />
                                                <th />
                                                <th />
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {valeFechamento.map(({ id, data, motivo, value }) => (
                                                <tr key={id}>
                                                    <td>{adjustDate(data)}</td>
                                                    <td>{motivo}</td>
                                                    <td>{adjustValue(value)}</td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                    ------------------------------------------<br />
                                    Total <span>{adjustValue(valeTotalFechamento)}</span> {/* Fazer a mesma lógica do total price, tanto nesse quanto no valor lá de cima*/}
                                    <br />
                                    <br />
                                </main>
                                <footer>
                                    Resumo de Recebimentos<br />
                        ------------------------------------------<br />
                                    <table id="accounting">
                                        <thead>
                                            <tr>
                                                <th />
                                                <th>Informado</th>
                                                <th>Sistema</th>
                                                <th>Dif.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Cartao........:</td>
                                                <td>{adjustValue(cartaoDoCaixa)}</td>
                                                <td>{adjustValue(cartao)}</td>
                                                <td />
                                            </tr>
                                            <tr>
                                                <td>Dinheiro......:</td>
                                                <td>{adjustValue(parseFloat(dinheiroDoCaixa))}</td>
                                                { !valeTotalFechamento ?
                                                    <td>{adjustValue(parseFloat(dinheiro))}</td>
                                                    :
                                                    <td>{adjustValue(parseFloat(dinheiro) - parseFloat(valeTotalFechamento))}</td>
                                                }
                                                
                                                <td>{adjustValue(parseFloat(dinheiro) - parseFloat(dinheiroDoCaixa))}</td>
                                            </tr>
                                            <tr>
                                                <td>Vales.........:</td>
                                                <td>{adjustValue(valeTotalFechamento)}</td>
                                                <td />
                                            </tr>
                                        </tbody>
                                    </table>
                                    ------------------------------------------<br />
                                    <span>Total Dinheiro:</span> {adjustValue(parseFloat(dinheiro))}<br />
                                    <span>TOTAL GERAL...:</span> {adjustValue(parseFloat(dinheiro) + parseFloat(cartao))}<br />
                                    <br />
                        ATENÇAO: Diferença de Caixa de: {adjustValue(parseFloat(dinheiro) - parseFloat(dinheiroDoCaixa))}
                                </footer>
                            </div>
                        </div>
                    )
            }
        </div>
    );
}