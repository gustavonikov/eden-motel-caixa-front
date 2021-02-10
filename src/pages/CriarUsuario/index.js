import React, { useState } from 'react';
import { Link, useHistory} from 'react-router-dom';

import api from '../../services/api';

import './styles.css';

export default function CriarUsuario() {
    const history = useHistory();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    async function handleCreateUser(e) {
        e.preventDefault();

        const data = {
            login,
            password
        }

        try {
            await api.post('/create-user', data);
            history.push('/');
        } catch (error) {
            
        }
    }

    return (
        <div id="create-user-page">
                <form className="create-user-content">
                    <h1>Cadastro</h1>
                    <label htmlFor="login">
                        Usuário
                        <input
                            placeholder = "Digite o seu usuário"
                            value={login}
                            onChange={ e => setLogin(e.target.value)}
                            required
                        />
                    </label>
                    <label htmlFor="password">
                        Senha
                        <input
                            type="password"
                            placeholder = "Digite a sua senha"
                            value={password}
                            onChange={ e => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button className="button" type="submit" onClick={(e) => handleCreateUser(e)}>Registrar</button>

                    <Link to="/" className ="back-to-login">
                        Voltar para o login
                    </Link>
                </form>
            </div>
    );
}
