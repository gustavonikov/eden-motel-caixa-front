import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';
import Entrada from './pages/Entrada';
import Pagamento from './pages/Pagamento';
import Produtos from './pages/Produtos';
import Vale from './pages/Vale';
import CriarUsuario from './pages/CriarUsuario';
import Fechamento from './pages/Fechamento';
import Historico from './pages/Historico';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/entrada" exact component={Entrada} />
                <Route path="/caixa" component={Pagamento} />
                <Route path="/produtos" component={Produtos} />
                <Route path="/vale" component={Vale} />
                <Route path="/fechamento" component={Fechamento} />
                <Route path="/criar-usuario" component={CriarUsuario} />
                <Route path="/historico" component={Historico} />
            </Switch>
        </BrowserRouter>
    );
}
