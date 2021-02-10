import React from 'react';
import { Link } from 'react-router-dom';
import { MdPayment, MdAssignment, MdShoppingCart } from 'react-icons/md';
import { FaMoneyCheckAlt, FaPowerOff, FaHistory } from 'react-icons/fa';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import api from '../../services/api';

import './styles.css';

export default function SideBar ({ barsState }) {
    async function handleLogout() {
        console.log("entrou no deslogar");

        const id = localStorage.getItem('cashierId');

        console.log(id);
        await api.put(`/deslogar/${id}`);

        localStorage.clear();
    }

    return (
        <aside className="app-sidebar">
            <Link to="/entrada" className={barsState.entry ? 'active-bar' : ''}>
                <MdAssignment size={30} className="icon" />
                    Entrada
            </Link>
            <Link to="/caixa" className={barsState.payment ? 'active-bar' : ''}>
                <MdPayment size={30} className="icon" />
                    Pagamento
            </Link>
            <Link to="/produtos" className={barsState.products ? 'active-bar' : ''}>
                <MdShoppingCart size={30} className="icon" />
                    Produtos
            </Link>
            <Link to="/vale" className={barsState.vale ? 'active-bar' : ''}>
                <FaMoneyCheckAlt size={30} className="icon" />
                    Vale
            </Link>
            <Link to="/fechamento" className={barsState.close ? 'active-bar' : ''} >
                <HiOutlineDocumentReport size={30} className="icon-report" />
                Fechamento       
            </Link>
            <Link to="/historico" className={barsState.historico ? 'active-bar' : ''} >
                <FaHistory size={30} className="icon-report" />
                Histórico       
            </Link>
            <Link to="/" onClick={handleLogout}>
                <FaPowerOff size={30} className="icon"/>
                Deslogar        
            </Link> 
        </aside>
    );
};
