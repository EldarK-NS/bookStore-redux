структура проекта

/actions/-action creators
/reducers/ -reducers
/services/
/utils/
/components/
   /app
   /pages
   /error-boundry
   /error-indicator
   /spinner
   /bookstore-service-context
   /hoc


   Большинству приложений необходимы вспомогательные компоненты:
   -ErrorBoundry
   -контекст
   -HOC (high order components) для работы с контекстом (withXyzService)
Эти вспомогательные компоннеты лучше создать сразу.

Создаем Service

Создаем context api
React.createContext() - возвращает provider, consumer
/* здесь мы просто создаем провайдер и консьюмер, придаем им удобные имена. дальше мы будем их отправлять в необходимые
 компоненты, провайдер уйдет как обертка всей структуры компонентов и в него как параметр будет передано то что нужно спустить вниз, а консьюмер будет перемещен туда где необходимо получить определенные параметры, переданные как пропсы из провайдера,
 при этом консьюмер через функцию возвращает переданные параметры <Consumer>{(переданные параметры)=>return( <Component/>)} </Consumer> - переход в HOC*/

Создаем HOC на основе context
/* hoc - это компонент который представляет из себя функцию которая возвращает другую функцию которая принимает 
компонент который будем оборачивать, тоесть в компоненте высшего порядка мы создаем новый компонент*/
/* - (переход из bookstore-service-context)- Здесь мы передали наш Consumer и создали HOC
const withПереданныйПараметр=(Wrapped)=>{
    return (props){
            return <Wrapped {... this.props}/>
    }
}
const MyWrappedComponent=hoc(InnerComponent)

Создаем reducer, action creator, store
>Для того что бы создать Redux приложение нужно  определить функцию -reducer
>Функция action creator не обязательна, но на парктике присутствует всегда
>Логику создания store нужно вынести в отдельный файл
------------------------------------------------------------------------------
Структура проекта:
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/index';
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import ErrorBoundry from './../error-boundry/error-boundry'
import BookstoreService from './services/bookstore-service';
import { BookstoreServiceProvider } from './components/bookstore-service-context'
import store from './store';

const bookstoreService = new BookstoreService()


ReactDOM.render(
    <Provider store={store}>
        <ErrorBoundry>
            <BookstoreServiceProvider value={bookstoreService}>
                <Router>
                <App />
                </Router>
            </BookstoreServiceProvider>
        </ErrorBoundry>
    </Provider>,
     document.getElementById('root')
);

все компоненты в APP будут чез Router иметь доступ к роутингу, через BookstoreServiceProvider иметь доступ к bookstoreService (бд), если в этих компонентах будут происходить ошибки их будет отлавливать ErrorBoundry и все компоненты ниже по иерархии будут иметь доступ к redux-store через Provider и смогут через dispatch обновлять store

// Предоставляет доступ к Redux store
<Provider store={store}>
// Обработка ошибок в компонентах ниже
<ErrorBoundry>
//Передает сервис через Context API
<ServiceProvider value={service}>
//Router из пакета react-router
 <Router>
 // Само приложение 
 <App>
---------------------------------------------------------------------------
Чтение данных из Redux store
Для того чтобы принимающий компонент BoorList мог читать данные state  из store необходимо использовать компонент HOC - функцию connect()
эта функция импортируется import { connect } from 'react-redux'; 
connect имеет два аргумента (mapStateToProps, mapDispatchToProps )
mapStateToProps - позоляет читать state из store

mapStateToProps - это функция которая принимает state и возвращает объект с новым значением state- это функция которая определяет какие свойства 
получит компоннет из Redux

const mapStateToProps = (state) => {
    return {
        books: state.books
    }

при этом connect - это компонент который оборачивает собой текущий - принимающий компонент :

export default connect(mapStateToProps)(BookList)
------------------------------------------------------------------------
Отправка действий:
Для того чтобы взять данные из БД через service и отправить их в store т.е обновить наши state в redux store необходимо воспользоваться компонентом высшего порядка (hoc)   withBookstoreService -( который в свою очередь через context(provider,consumer) получает эти данные через пропсы из сервиса )

в функции componentDidMount() {
    //здесь мы получаем необходимые данные

     const { bookstoreService } = this.props;
        const data = bookstoreService.getBooks();
//здесь запускаем функцию отправки

           this.props.booksLoaded(data)
    }

    также нам необходим второй аргумент connect-mapDispatchToProps() - который схож по дейстию с setState(){}
    
    const mapDispatchToProps = (dispatch) => {
    return {
        booksLoaded: (newBooks) => {
            dispatch({
                type: 'BOOKS_LOADED',
                payload: newBooks
            });
        }
    };
};
по факту hoc withBookstoreService() - является 2-й оберткой для нащего компонента,
export default withBookstoreService()(connect(mapStateToProps, mapDispatchToProps)(BookList));

Итого : connect() выполняет след функции:
1. mapStateToProps - читает initial state- и выводит его на стр или используется еще для чего то

2.mapDispatchToProps - получает данные из БД и передает их в store, обновляя initial state

3. mapStateToProps - читает обновленный state из store и выводит его на стр или используется еще для чего то