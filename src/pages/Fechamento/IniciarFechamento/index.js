import React, { useCallback } from 'react';
import api from '../../../services/api';
import { errorAlert, successAlert } from '../../../utils/Alerts';

import './styles.css';

export default function IniciarFechamento({ valor_dinheiro, dinheiroChange, valor_cartao, cartaoChange, abrirFechamento }) {
    const handleInputMoney = useCallback(ev => dinheiroChange(ev.target.value), [dinheiroChange]);

    const handleInputCard = useCallback(ev => cartaoChange(ev.target.value), [cartaoChange]);

    function handleCloseCashier() {
        
        const cashierId = localStorage.getItem('cashierId');

        const data = {
            valor_dinheiro,
            valor_cartao,
        };

        console.log(data);

        api.post(`/informar/${cashierId}/${valor_dinheiro}/${valor_cartao}`).then(() => {
            console.log('Done!');

            successAlert('Carregando...');

            abrirFechamento(true)

            setTimeout(() => window.print(), 1.5 * 1000);
        }).catch((error) => {
            console.log(error);

            errorAlert('Não foi possível cadastrar seu valor!');
            
            dinheiroChange('')
            cartaoChange('')
        });
    }

    return (
        <div className="iniciar-fechamento-container">
            <h2>Inserir dados para fechamento</h2>
            <div className="input-container">
                <label htmlFor="nome">
                    <strong>Dinheiro</strong>
                    <input
                        name="nome"
                        type="text"
                        value={valor_dinheiro}
                        onChange={handleInputMoney}
                        required
                    />
                </label>
                <label htmlFor="nome">
                    <strong>Cartão</strong>
                    <input
                        name="nome"
                        type="text"
                        value={valor_cartao}
                        onChange={handleInputCard}
                        required
                    />
                </label>
            </div>
            <div className="button-container">
                <button type="submit" className="button" onClick={handleCloseCashier}>
                    Confirmar
                </button>
            </div>
        </div>
    )
}
