import React, { useState } from 'react';
import {useHistory, Link} from 'react-router-dom';

import api from '../../services/api';

import './styles.css';

export default function Logon(){
    const [ login, setLogin ] = useState('');
    const [ password, setPassword ] = useState('');
    
    const history = useHistory();

    async function handleLogin(){

        try {
            const response = await api.post('/sessions',{login, password});
            
            localStorage.setItem('cashierId', response.data.id);

            history.push('/entrada');
        } catch (err) {
            console.log(err);
        }
    }
    
    return(
        <div id="login-page"
            onKeyDown={(ev) => {
                if (ev.key === 'Enter') handleLogin();
            }}
        >
            <div className = "login-container">
                <h1>Login</h1>
                    <div className="input-block">
                        <input
                            placeholder = "Usuário"
                            value={login}
                            onChange={ e => setLogin(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-block">
                        <input
                            placeholder = "Senha"
                            type="password"
                            value={password}
                            onChange={ e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        className="button"
                        type="button" 
                        onClick={handleLogin}
                    >
                        Entrar
                    </button>
                    
                    <Link to="/criar-usuario" className ="temporary-register">
                        Adicionar Usuário
                    </Link>
            </div>
        </div>
    );
}