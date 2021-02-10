import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { MdAddShoppingCart } from 'react-icons/md';
import { RiCloseCircleFill } from 'react-icons/ri';

import SideBar from '../../components/SideBar';
import EntryCards from './EntryCards';
import CardsLoader from '../../components/EntryCardsLoader';
import { Modal } from '@material-ui/core';

import api from '../../services/api';
import { confirmAlert, errorAlert, successAlert } from '../../utils/Alerts';

import './styles.css';

export default function Entrada() {
    const asideActiveBars = {
        entry: true,
        payment: false,
        products: false,
        vale: false,
        close: false,
        historico: false,
    };

    const [entradas, setEntradas] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [open, setOpen] = useState(false);
    const [openChangeApt, setOpenChangeApt] = useState(false);
    const [clientId, setClientId] = useState(null);
    const [aptNumber, setAptNumber] = useState(null);
    const [valorDaDiaria, setValorDaDiaria] = useState('');
    const [nomeDoProduto, setNomeDoProduto] = useState('');
    const [produtoId, SetProdutoId] = useState(null);
    const [quantidade, setQuantidade] = useState(1);
    const [apartamentos, setApartamentos] = useState([]);
    const [novoApt, setNovoApt] = useState('');

    useEffect(() => {
        api.get('/entry').then((response) => {
            setEntradas(response.data);
        });
    }, []);

    useEffect(() => {
        api.get('/apartamento').then((response) => {
            console.log(response.data);
            setApartamentos(response.data);
        });
    }, []);

    async function handleCashier(id, aptNumber) {
        if (!valorDaDiaria) {
            console.log('Insira a diaria para prosseguir!');

        } else {
            try {
                const cashierId = localStorage.getItem('cashierId');

                await api.put(`apagar/${id}/${cashierId}/${aptNumber}`);
                setEntradas(entradas.filter((entrada) => entrada.id !== id));
            } catch (err) {
                console.log(err);

                errorAlert('Ocorreu um erro ao realizar o pagamento!');
            }
        }
    }

    useEffect(() => {
        api.get('/produtos').then((response) => {
            setProdutos(response.data);
        });
    }, []);

    function handleOpen(id, number) {
        setClientId(id);
        setAptNumber(number);
        setOpen(true);
        setQuantidade(1);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleOpenChangeApt() {
        setOpenChangeApt(true);
    }

    function handleCloseChangeApt() {
        setOpenChangeApt(false);
    }

    function handleConsumptionModalSubmit(ev) {
        ev.preventDefault();

        confirmAlert('Deseja prosseguir?', `Produto: ${nomeDoProduto} \n Quantidade: ${quantidade}`).then((yes) => {
            const cashierId = localStorage.getItem('cashierId');
            const consumo = {
                clientId,
                produtoId,
                quantidade,
                cashierId
            };

            if (yes) {
                api.post('/consumo', consumo).then(() => {
                    successAlert('Seu produto foi adicionado com sucesso!');
                }).catch(() => {
                    errorAlert('Não foi possível inserir os dados do consumo!');
                });
            }
        });
    }

    async function handleUpdateDiaria() {
        try {
            await api.put(`update-diaria/${clientId}/${aptNumber}/${valorDaDiaria}`).then(() => successAlert('Diária adicionada com sucesso!'));
        } catch (err) {
            console.log(err);
            errorAlert('Não foi possível adicionar a diária!');
        }
    }

    async function handleChangeAptSubmit(id, aptNumber) {
        
        const cashierId = localStorage.getItem('cashierId');

        console.log(id, cashierId, aptNumber, novoApt);

        try {
            await api.put(`update-apt/${id}/${cashierId}/${aptNumber}/${novoApt}`).then(() => successAlert('O apartamento foi mudado com sucesso!'));
            handleCloseChangeApt();
            window.location.reload();

        } catch (err) {
            console.log(err);
            errorAlert('Não foi possível mudar o apartamento!');
        }
    }

    return (
        <div id="entry-page">
            <SideBar barsState={asideActiveBars} />

            <div className="dashboard-container">
                <ul>
                    {
                        entradas.length === 0 && <CardsLoader />
                    }
                    {entradas.map(({ id, number, type, diaria, placa, data, time }) => (
                        <li key={id}>
                            <EntryCards
                                number={number}
                                type={type}
                                diaria={diaria}
                                placa={placa}
                                data={data}
                                time={time}
                                onClick={handleOpenChangeApt}
                            />
                            <div className="button-wrapper">
                                <button
                                    type="button"
                                    className="button"
                                    onClick={() => handleOpen(id, number)}
                                    title="Clique para inserir o consumo do cliente"
                                >
                                    <MdAddShoppingCart className="insert-consumption-icon" size={28} color="#ffffff" />
                                    Inserir consumo
                                </button>

                                <button
                                    type="submit"
                                    className="button"
                                    onClick={() => handleCashier(id, number)}
                                    title="Clique para realizar o pagamento do cliente"
                                >
                                    Realizar pagamento
                                </button>
                            </div>

                            <Modal
                                id="consumption-modal"
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                            >
                                <div className="modal-container">
                                    <RiCloseCircleFill size={28} color="#f00" className="close-icon" onClick={handleClose} title="Clique aqui para fechar" />
                                    <div className="modal-content">
                                        <div className="wrapper">
                                            <h2>Insira o tipo de diária</h2>
                                            <Select
                                                placeholder="Selecione a diária"
                                                className="modal-diaria-select"
                                                options={[
                                                    {
                                                        label: 'Diária',
                                                        value: 'DIARIA',
                                                    },
                                                    {
                                                        label: 'Pernoite',
                                                        value: 'PERNOITE',
                                                    }
                                                ]}
                                                onChange={({value}) => {
                                                    setValorDaDiaria(value);
                                                }}
                                                required
                                            />
                                            <div className="button-diaria-container">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateDiaria(entradas.id)}
                                                    className="button"
                                                >
                                                Adicionar
                                                </button>
                                            </div>
                                        </div>
                                        <div className="wrapper"><h2>Insira o produto e a quantidade</h2></div>
                                        <div className="modal-product-content">
                                            <Select
                                                placeholder="Selecione o produto"
                                                className="modal-product-select"
                                                options={produtos.map(({ name, id }) => ({
                                                    label: name,
                                                    value: id,
                                                }))}
                                                onChange={({ label, value }) => {
                                                    setNomeDoProduto(label);
                                                    SetProdutoId(value);
                                                }}
                                                required
                                            />
                                            <input
                                                type="number"
                                                name="quantidade"
                                                value={quantidade}
                                                className="modal-input"
                                                onChange={(ev) => setQuantidade(ev.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="button-products-container">
                                            <button
                                                type="submit"
                                                onClick={handleConsumptionModalSubmit}
                                                className="button"
                                            >
                                            Adicionar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                            <Modal
                                id="change-apt-modal"
                                open={openChangeApt}
                                onClose={handleCloseChangeApt}
                            >
                                <div className="modal-container">
                                    <h2>Escolha o apartamento disponível</h2>
                                    <Select
                                        placeholder="Selecione o apartamento"
                                        className="modal-change-apt-select"
                                        options={apartamentos.map(({ number}) => ({
                                            label: number,
                                            value: number,
                                        }))}
                                        onChange={({value}) => {
                                            setNovoApt(value);
                                        }}
                                        required
                                    />
                                    <div className="button-container">
                                        <button type="button" className="button" onClick={handleCloseChangeApt}>
                                            Cancelar
                                        </button>
                                        <button type="submit" className="button" onClick={() => handleChangeAptSubmit(id, number)}>
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
