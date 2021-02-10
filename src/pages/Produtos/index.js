import { Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { IoMdAddCircle } from 'react-icons/io';

import SideBar from '../../components/SideBar';
import api from '../../services/api';
import { confirmAlert, errorAlert } from '../../utils/Alerts';
import SimpleLoader from '../../components/SimpleLoader';

import './styles.css';

export default function Produtos() {
    const asideActiveBars = {
        entry: false,
        payment: false,
        products: true,
        vale: false,
        close: false,
        historico: false,
    };

    const [produtos, setProdutos] = useState([]);
    const [openAddProductModal, setOpenAddProductModal] = useState(false);
    const [openUpdateProductModal, setOpenUpdateProductModal] = useState(false);
    const [nomeDoProduto, setNomeDoProduto] = useState('');
    const [valorDoProduto, setValorDoProduto] = useState('');
    const [estoqueDoProduto, setEstoqueDoProduto] = useState(1);
    const [updateDoProduto, setUpdateDoProduto] = useState({});
    const [novaQuantidade, setNovaQuantidade] = useState(0);

    useEffect(() => {
        api.get('/produtos').then((res) => setProdutos(res.data));
    }, []);

    function handleAddProductModalOpen() {
        setNomeDoProduto('');
        setValorDoProduto('');
        setEstoqueDoProduto(0);
        setOpenAddProductModal(true);
    }

    function handleAddProductModalClose() {
        setOpenAddProductModal(false);
    }

    function handleUpdateProductModalOpen() {
        setOpenUpdateProductModal(true);
        setNovaQuantidade(0);
    }

    function handleUpdateProductModalClose() {
        setOpenUpdateProductModal(false);
    }

    function handleAddProduct(name, price, quantity) {
        const novoProduto = {
            name,
            price,
            quantity,
        };

        //cadastrar-produto
        api.post('/cadastrar-produto', novoProduto).then(() => {
            console.log('Done!');

            setOpenAddProductModal(false);

            api.get('/produtos').then((res) => setProdutos(res.data));
        }).catch(() => {
            errorAlert('Ocorreu um erro ao cadastrar o produto!');
            setOpenAddProductModal(false);
        });
    }

    function handleSearch() {
        let td; let i; let txtValue;

        const input = document.getElementById('products-input');
        const filter = input.value.toUpperCase();
        const table = document.getElementById('products-table');
        const tr = table.getElementsByTagName('tr');

        for (i = 0; i < tr.length; i += 1) {
            [td = 0] = tr[i].getElementsByTagName('td');

            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = '';
                } else {
                    tr[i].style.display = 'none';
                }
            }
        }
    }

    function handleUpdateQuantity(ev, quantidade) {
        ev.preventDefault();

        const quantidadeUpdated = Number(quantidade) + Number(updateDoProduto.quantity);

        const updatedProduct = {
            ...updateDoProduto,
            quantity: quantidadeUpdated,
        };

        api.put(`/produtos/${updateDoProduto.id}`, updatedProduct).then(() => {
            console.log('Done!');

            setOpenUpdateProductModal(false);
            
            api.get('/produtos').then((res) => setProdutos(res.data));
        }).catch((error) => {
            console.log(error);

            errorAlert('Não foi possível alterar o produto');
            setOpenUpdateProductModal(false);
        });
    }

    function handleDeleteProduct(productId, productName) {
        confirmAlert(`Deseja realmente excluir "${productName}"?`, 'Essa ação não poderá ser revertida.').then((yes) => {
            if (yes) {
                api.delete(`/produto/${productId}`).then(() => {
                    console.log('Deletado com sucesso!');

                    setProdutos(produtos.filter(({ id }) => productId !== id));
                }).catch((error) => {
                    errorAlert('Não foi possível deletar o produto!');
                    console.log(error);
                });
            }
        });
    }

    return (
        <div id="products-page">
            <SideBar barsState={asideActiveBars} />

            <div className="products-container">
                <header>
                    <div className="input-wrapper">
                        <FaSearch size={30} color="#122" />
                        <input
                            type="text"
                            id="products-input"
                            onKeyUp={() => handleSearch()}
                            placeholder="Pesquise o produto..."
                        />
                    </div>
                    <button type="button" onClick={handleAddProductModalOpen} className="button">
                        <IoMdAddCircle size={30} className="products-add-icon" color="#ffffff" />
                        Novo produto
                    </button>
                </header>
                <table id="products-table">
                    <thead>
                        <tr className="header">
                            <th>Nome do produto</th>
                            <th>Valor</th>
                            <th>Quantidade em estoque</th>
                            <th>Alterar estoque</th>
                            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {
                            produtos.length > 0
                                && produtos.map(({ id, name, price, quantity }) => (
                                    <tr key={id}>
                                        <td>{name}</td>
                                        <td>{price}</td>
                                        <td>{quantity}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="button"
                                                onClick={() => {
                                                    setUpdateDoProduto({
                                                        id,
                                                        name,
                                                        price,
                                                        quantity,
                                                    });
                                                    handleUpdateProductModalOpen();
                                                }}
                                            >
                                            Adicionar
                                            </button>
                                        </td>
                                        <td>
                                            <MdDelete
                                                size={25}
                                                title="Clique pra excluir o produto"
                                                className="delete-product-icon"
                                                onClick={() => handleDeleteProduct(id, name)}
                                            />
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
                {
                    produtos.length === 0 && (
                        <div className="loading">
                            <h2>Carregando produtos</h2>
                            <SimpleLoader />
                        </div>
                    )
                }
            </div>
            <Modal
                id="add-products-modal"
                open={openAddProductModal}
                onClose={handleAddProductModalClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <div className="modal-container">
                    <h2>Adicionar Produto</h2>
                    <div className="modal-product-content">
                        <label htmlFor="nome">
                            <strong>Nome do Produto</strong>
                            <input
                                className="product-modal-primary-input"
                                name="nome"
                                type="text"
                                value={nomeDoProduto}
                                onChange={({ target }) => setNomeDoProduto(target.value)}
                                required
                            />
                        </label>
                        <div className="second-line">
                            <label htmlFor="nome">
                                <strong>Valor</strong>
                                <input
                                    className="product-modal-input bigger"
                                    name="nome"
                                    type="text"
                                    value={valorDoProduto}
                                    onChange={({ target }) => setValorDoProduto(target.value)}
                                    required
                                />
                            </label>
                            <label htmlFor="nome">
                                <strong>Quantidade</strong>
                                <input
                                    className="product-modal-input smaller"
                                    name="nome"
                                    type="number"
                                    value={estoqueDoProduto}
                                    onChange={({ target }) => setEstoqueDoProduto(target.value)}
                                    required
                                />
                            </label>
                        </div>
                    </div>
                    <div className="button-container">
                        <button type="button" className="button" onClick={handleAddProductModalClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="button" onClick={() => handleAddProduct(nomeDoProduto, valorDoProduto, estoqueDoProduto)}>
                            Adicionar
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                id="update-quantity-modal"
                open={openUpdateProductModal}
                onClose={handleUpdateProductModalClose}
            >
                <div className="modal-container">
                    <h2>{updateDoProduto.name}</h2>
                    <label htmlFor="alterar-quantidade">
                        <strong>Quantidade</strong>
                        <input
                            className="product-modal-primary-input"
                            name="alterar-quantidade"
                            type="number"
                            value={novaQuantidade}
                            onChange={({ target }) => setNovaQuantidade(target.value)}
                            required
                        />
                    </label>
                    <div className="button-container">
                        <button type="button" className="button" onClick={handleUpdateProductModalClose}>
                                Cancelar
                        </button>
                        <button type="submit" className="button" onClick={(ev) => handleUpdateQuantity(ev, novaQuantidade)}>
                                Adicionar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
