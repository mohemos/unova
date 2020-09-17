import { useState } from 'react';
import Modal from 'react-modal';
Modal.setAppElement('#root');

export function useModal() {
  const [openModal, setOpenModal] = useState(false);

  const open = () => setOpenModal(true);
  const close = () => setOpenModal(false);
  const defaultStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return { open, close, openModal, Panel: Modal, defaultStyle };
}

export function useTabContent(defaultContent = null) {
  const [content, setContent] = useState(defaultContent);

  const display = (newContent) => setContent(newContent);

  return { display, content };
}

export function useForm(submitAction) {
  const [values, setValue] = useState({});

  const getData = (e) => {
    setValue({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const setData = (field, data) => {
    values[field] = data;
    setValue({ ...values });
  };

  const submit = (e) => {
    e.preventDefault();
    submitAction();
  };

  return {
    values,
    getData,
    setData,
    submit,
  };
}
