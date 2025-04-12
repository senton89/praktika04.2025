// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);

//Давай продолжим разработку проекта согласно плану из Output, опираясь на требования. Давай продолжим реализацию 4 этапа(продолжи 12. Создание глобальных стилей)(действия в проекте проделаны согласно документации Реализованы этапы 1-3 "Реализация Этапа 4: Разработка клиентской части (React)","Продолжение реализации Этапа 4: Разработка клиентской части (React)" ,"Продолжение реализации Этапа 4: Разработка клиентской части (React) Продолжим разработку клиентской части нашего e-commerce приложения, завершая компоненты и страницы, необходимые для полноценного функционирования приложения.","Продолжение реализации Этапа 4: Разработка клиентской части (React) 9. Создание страниц приложения (продолжение)")