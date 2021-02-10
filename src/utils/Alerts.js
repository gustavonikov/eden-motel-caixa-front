import swal from '@sweetalert/with-react';

export const confirmAlert = (title, text) => (
    swal({
        title,
        text,
        buttons: ['Não', 'Sim'],
    })
);

export const errorAlert = (text) => (
    swal('Oops', `${text}`, 'error')
);

export const successAlert = (text) => (
    swal(text, '', 'success')
);
