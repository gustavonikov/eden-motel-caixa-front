import React, { useState } from 'react';
import SideBar from '../../components/SideBar';

import api from '../../services/api';
import { errorAlert, successAlert } from '../../utils/Alerts';

import './styles.css';

export default function Vale() {
    const asideActiveBars = {
        entry: false,
        payment: false,
        products: false,
        vale: true,
        close: false,
        historico: false,
    };

    const [motivo, setMotivo] = useState('');
    const [valorDoVale, setValorDoVale] = useState(0);

    const userId = localStorage.getItem('userId');

    function handleSubmit() {
        
        const cashierId = localStorage.getItem('cashierId');

        const novoVale = {
            motivo,
            valor: valorDoVale,
            userId,
            cashierId
        };

        api.post('/vale', novoVale).then(() => {
            console.log('Done!');

            successAlert('Seu envio foi concluído com sucesso!');
        }).catch((error) => {
            console.log(error);

            errorAlert('Não foi possível cadastrar seu vale!');
        });
    }

    return (
        <div id="vale-page">
            <SideBar barsState={asideActiveBars} />
            <div className="vale-container">
                <h2>Formulário do Vale</h2>
                <div className="vale-content">
                    <label htmlFor="motivo">
                        <strong>Motivo</strong>
                        <input type="text" name="motivo" value={motivo} onChange={({ target }) => setMotivo(target.value)} />
                    </label>
                    <label htmlFor="valorDoVale">
                        <strong>Valor do vale</strong>
                        <input
                            type="text"
                            className="short-input"
                            name="valorDoVale"
                            value={valorDoVale}
                            onChange={({ target }) => setValorDoVale(target.value)}
                        />
                    </label>
                </div>
                <button type="button" className="button" onClick={handleSubmit}>Confirmar</button>
            </div>
        </div>
    );
}
