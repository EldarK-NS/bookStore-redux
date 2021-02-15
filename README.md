# Cтруктура проекта

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

# Создаем Service

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

***---------------------------------------------------------------***

Структура проекта:
<import React from 'react';
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

***----------------------------------------------------------------***

# Чтение данных из Redux store

Для того чтобы принимающий компонент BookList мог читать данные state  из store необходимо использовать компонент HOC - функцию connect() -которая подключается к redux store 

для того что бы подключить компонент к redux store  нам нужен connect

эта функция импортируется import { connect } from 'react-redux'; 
connect имеет два аргумента (mapStateToProps, mapDispatchToProps )
mapStateToProps - позоляет читать state из store

mapStateToProps - это функция которая принимает state и возвращает объект с новым значением state- это функция которая определяет какие свойства 
получит компоннет из Redux

<const mapStateToProps = (state) => {
    return {
        books: state.books
    }

при этом connect - это компонент который оборачивает собой текущий - принимающий компонент :

 <export default connect(mapStateToProps)(BookList)

****-------------------------------------------------------------------***
# Отправка действий:

Для того чтобы взять данные из БД через service и отправить их в store т.е обновить наши state в redux store необходимо воспользоваться компонентом высшего порядка (hoc)   withBookstoreService -( который в свою очередь через context(provider,consumer) получает эти данные через пропсы из сервиса )

в функции 
<componentDidMount() {
    //здесь мы получаем необходимые данные

   const { bookstoreService } = this.props;
        const data = bookstoreService.getBooks();

//здесь запускаем функцию отправки

           this.props.booksLoaded(data)
    }

    также нам необходим второй аргумент connect-mapDispatchToProps() - который схож по дейстию с setState(){}
    
<const mapDispatchToProps = (dispatch) => {
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

***--------------------------------------------------------------------***

bindActionCreators

используем здесь функцию bindActionCreators которая работает только с mapDispatchToProps, она принимает два аргумента(actionCreator, dispatch) -переписываем функцию(возможно это рефакторинг). bindActionCreators -  обернет actionCreator и сделает так что как только мы вызываем функцию booksLoaded, она автоматически будет создавать нужное действие и передавать его в dispatch 

***-----------------------------------------------------------------***

итог по connect()-
1. в самом начале в нашем store нет никаких объектов
2. функция connect() оборачивает наш компонент BookList  в компонент высшего порядка который подключается к Redux store
3. мы конфигурируем то как будет работать это подключение при помощи функций mapStateToProps и mapDispatchToProps
* mapStateToProps-  описывает то какие данные наш компоннет хочет получить из Redux store
const mapStateToProps = (state) => {
    return {
        books: state.books
    }
}

и здесь мы хотим получить только массив books,
* mapDispatchToProps- описывает то какие действия хочет выполнить наш компонент, какие action он будет передавать в store
<const mapDispatchToProps = (dispatch) => {
     return {
         booksLoaded: (newBooks) => {
             dispatch(booksLoaded(newBooks));
         }
     };
};
4. как только компонент появляется на экране, происходит несколько действий
(здесь componentDidMount нужен для того что бы инициализировать первую загрузку данных, так как у нас нету запускающего элемента событие запускается автоматически через этот методю При запуске приложения книги уже подгружаются на сайт, это продолжение действия mapDispatchToProps):
<componentDidMount() {
     const { bookstoreService } = this.props;
    const data = bookstoreService.getBooks();
     this.props.booksLoaded(data)
    }

    * во первых: мы получаем service из context (const { bookstoreService } = this.props;) -мы его получаем при помощи другого компонента высшего порядка withBookstoreService()
    * при наличии доступа к service мы можем получить данные (const data = bookstoreService.getBooks();)
    * мы получаем данные и сразу вызываем функцию booksLoaded(data) - который автоматичсеки предает действие в Redux store
    * store вызывает reducer, который получает действие 'BOOKS_LOADED' и обновляет список книг в store
    * обновленный список книг снова возвращается в компонент BookList через mapStateToProps и в функции render отрисовывает его на странице

summary

что бы получить данные из Service  и передать их в Redux Store мы используем два HOC :
> withBookStoreService - получает сервис из контекста и передает в компонент
> connect()-оборачивает функцию dispatch из Redux Store
mapDispatchToProps может быть функцией или объектом Усли это объект, то он передается в bindActionCreators(). 
    закончил 9-й урок connect()
------------------------------------------------------------
# Работа с асинхронными данными

1. Получение данных из БД!!
для получения данных из внешних источников, мы используем fetch, 
который вернет нам Promis,
<getBooks() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.data)
      }, 1000)
    });
  }

 этот Promis через connect и withBookStoreService мы передаем в компонент. 
в компоненте в:
 <componentDidMount() {
      const { bookstoreService, booksLoaded } = this.props;
        bookstoreService.getBooks()
            .then((data) => booksLoaded(data))
     }
 мы через then получаем data и сразу автоматически выполняем передачу команды в store через  booksLoaded(data)

 ***-------------------------------------------------------------***

# отличие setState() и reducer

 когда мы изменяем какой то state через setState() мы вносим изменения только в один элемент, а остальные элементы state 
 остаются такими же и не трансформируются, в reducer каждый раз нужно указывать все эелементы state в том виде в каком они существуют на данный моммент плюс указывать новый state в изененном виде, или через spred (...state, n:2):

 пример:

 React: setState()
 -----------------
 {a:0, b:0} initial state

 setState({a:100})

 new state {a:100, b:0}

 Redux: reducer()
 ----------------
{a:0, b:0} initial state

const reducer=(state, action)=>{
    return {a:100}- не правильно
    return {a:100, b:state.b} - правильно либо через spread {...state, a:100}
}

 new state {a:100} - b потерялось, потому что в reducer нужно возвращать весь state, не только те ключи и значеняи которые необходимо изменить но и остальные ключи и значения 

***--------------------------------------------------------------------***

2. Для того что бы на местах гре происходит загрузка данных, установить Spinner, мы в initial state добавляем доп состояние loading

<const initialState = {
  books: [],
  loading: true
}

 и в сам reducer добавляем это состояние и новый action

 <const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'BOOK-REQUESTED':
      return {
        books:[],
        loading: true
      }
    case 'BOOKS_LOADED':
      return {
        books: action.payload,
        loading: false
      };
    default:
      return state
  }
}
создаем новый AC:
<const booksRequested = () => {
    return {
        type: 'BOOK-REQUESTED'
    }
}

экспортируем его

<export { booksLoaded, booksRequested }

затем это соотояние у нас передается компоненту, как и переданные до этого другие state

добавить в 
<const mapDispatchToProps = {booksLoaded, booksRequested }

 добавить это новое состояние в mapStateToProps

 <const mapStateToProps = ({ books, loading }) => {
    return { books, loading };
};

и уже в render указать что и когда нужно рендерить
 <render() {
        const { books, loading } = this.props
        if(loading){
            return <Spinner/>
        }
        return (.......)
 }

далее отразить его в 

  <componentDidMount() {
        console.log(this.props)
 const { bookstoreService, booksLoaded, booksRequested } = this.props;
        booksRequested();
        bookstoreService.getBooks()
            .then((data) => booksLoaded(data))
   }

 _ИТОГ: в initial state добавляемновый state -> reducer  новый объект с type(при этом не забыть что нужно вернуть остальные state)->AC новую функцию-> в компоненте импорт АС->mapStateToProps добавляем новый State-> в mapDispatchToProps ->добавляем новый АС-> в render добавляем результат действия(!деструктурирование- вытащить из props)-> в componentDidMount (!деструктурирование AC- вытащить из props) запускаем функцию AC_

 закончил урок 11-12
----------------------------------------------------------------------

# Обработка ошибок 
в данном случае обрабатываются ошибки которые выскакивают при загрузке книг из БД

нужно создать новый state(error:null)-> в reducer создаем новый action 

<(case 'BOOKS_ERROR':
      return {
        books: action.payload,
        loading: false,
        error: action.payload
      };)

    при этом не забыть установить новый стейт в нужное положение во всех предидущих actions->создать новый АС:

<const booksError = (error) => {
    return {
        type: 'BOOKS_ERROR',
        payload: error
    }
}
и экспортроват его
export { booksLoaded, booksRequested, booksError } ->

в компоненете (импорт АС)-> mapStateToProps добавляем новый State-> в mapDispatchToProps ->добавляем новый АС-> в render добавляем результат действия(!деструктурирование state- вытащить из props)-> в componentDidMount(!деструктурирование AC- вытащить из props)  добавляем catch:
 <bookstoreService.getBooks()
            .then((data) => booksLoaded(data))
            .catch((err) => booksError(err))->

в Service добавляем reject

 <getBooks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.data)
        reject(new Error('Somthing wrong'))
      }, 1000)
    });
  }

 закончил урок 13

 ***--------------------------------------------------------------------***

# mapDispatchToProps- ownProps !рефакторинг!

всю логику componentDidMount
  <componentDidMount() {
        const { bookstoreService, booksLoaded, booksRequested, booksError} = this.props;
        booksRequested();
        bookstoreService.getBooks()
            .then((data) => booksLoaded(data))
            .catch((err) => booksError(err))
  }

  <const mapDispatchToProps = { booksLoaded, booksRequested, booksError }

  можно вынести из метода и оставить в mapDispatchToProps()  а обратно вернуть только одну функцию так как mapDispatchToProps() имеет два вида -функциональный и объектный, и в функциональном виде принимает два аргумента (dispatch, ownProps) 

  <componentDidMount() {
        this.props.fetchBooks()
    }

<const mapDispatchToProps = (dispatch, ownProps) => {
    const {bookstoreService}=ownProps
    return {
        fetchBooks: () => {
            dispatch(booksRequested());
            bookstoreService.getBooks()
                .then((data) => dispatch(booksLoaded(data)))
                .catch((err) => dispatch(booksError(err)))
        }
    }
}
в данном случае ownProps позволяет получить нам из пропсов также доступ к Service через withBookstoreService()- который обернул connect()

закончил урок 12

***---------------------------------------------------------------***

# рефакторинг 
мы вынесли всю логику из компонента mapDispatchToProps() в АС так как вся деятельность mapDispatchToProps была связана только с АС

Компоннет:

<const mapDispatchToProps = (dispatch, ownProps) => {
    const { bookstoreService } = ownProps
    return {
        fetchBooks: fetchBooks(bookstoreService, dispatch)
    }
}

AC:
<const booksLoaded = (newBooks) => {
    return {
        type: 'BOOKS_LOADED',
        payload: newBooks
    };
};
<const booksRequested = () => {
    return {
        type: 'BOOK-REQUESTED'
    }
}
<const booksError = (error) => {
    return {
        type: 'BOOKS_ERROR',
        payload: error
    }
}


<const fetchBooks = (bookstoreService, dispatch) => () => {
    dispatch(booksRequested());
    bookstoreService.getBooks()
        .then((data) => dispatch(booksLoaded(data)))
        .catch((err) => dispatch(booksError(err)))
}

<export { fetchBooks }

***---------------------------------------------------------------***

# Naming conventions

переименование actions
'BOOK-REQUESTED' = 'FETCH_BOOKS_REQUEST' - запрос отправлен
'BOOKS_LOADED'= 'FETCH_BOOKS_SUCCESS' -получен результат (в payload передаются полученные данные )
'BOOKS_ERROR'='FETCH_BOOKS_FAILURE' - произошла ошибка (в payload передается объект Error )

***---------------------------------------------------------------***

# Компоненты-контейнеры:

Презентационные компоннеты отвечают только за рендеринг
Компонненты-контейнеры - работают с Redux, реализуют loading, error др kjubre

Это по факту разделение задач поведения и отображения на разные компоннеты, что бы отделить логику от рендеринга

***---------------------------------------------------------------***

# Подключение нового компонента к Redux-store

вносим новый state  в  initial state, переносим его в reducer(два метода : либо через :
<return {
        cartItems: state.cartItems,
        orderTotal: state.orderTotal,
        books: [],
        loading: true,
        error: null
      }

      либо:
<return {
        ...state,
        books: action.payload,
        loading: false,
        error: null
      };

      -> в компоненте импортируем connect,оборачиваем export:

<export default connect(mapStatetoProps, mapDispatchToProps)(ShoppingCartTable);

переносим необходимые state в mapStatetoProps вносим их в аргументы, с деструктуризацией, и возвращаем объект с необходимыми state
const mapStatetoProps = ({ cartItems, orderTotal }) => {
  return { items: cartItems, total: orderTotal }

  если в компоненте есть events то переносим их листенеры-функции в 
mapDispatchToProps - все остальные действия в render
import React from 'react';
import './shopping-cart-table.css';
import { connect } from 'react-redux';

<const ShoppingCartTable = ({ items, total, onIncrease, onDecrease, onDelete }) => {

<const renderRow = (item, idx) => {
    const { id, name, count, total } = item
    return (
      <tr key={id}>
        <td>{idx + 1}</td>
        <td>{name}</td>
        <td>{count}</td>
        <td>${total}</td>
        <td>
          <button
            onClick={() => onDelete(id)}
            className="btn btn-outline-danger btn-sm float-right">
            <i className="fa fa-trash-o" />
          </button>
          <button
            onClick={() => onIncrease(id)}
            className="btn btn-outline-success btn-sm float-right">
            <i className="fa fa-plus-circle" />
          </button>
          <button
            onClick={() => onDecrease(id)}
            className="btn btn-outline-warning btn-sm float-right">
            <i className="fa fa-minus-circle" />
          </button>
        </td>
      </tr>
    )
  }



  return (
    <div className="shopping-cart-table">
      <h2>Your Order</h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Count</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {items.map(renderRow)}

        </tbody>
      </table>

      <div className="total">
        Total: ${total}
      </div>
    </div>
  );
};

const mapStatetoProps = ({ cartItems, orderTotal }) => {
  return { items: cartItems, total: orderTotal }
}
const mapDispatchToProps = () => {
  return {
    onIncrease: (id) => {
      console.log(`onIncrease${id}`)
    },
    onDecrease: (id) => {
      console.log(`onDecrease${id}`)
    },
    onDelete: (id) => {
      console.log(`onDelete${id}`)
    }
  }
}
<export default connect(mapStatetoProps, mapDispatchToProps)(ShoppingCartTable);

итого : 
1. Предаем в компонент через пропсы из store необходимые аргументы ({items,total, onDecrease ....})
2. навешиваем необходимые события на кнопки, это те события которые мы передали в п.1 (onDecrease...) onClick={()=>onDecrease}
3. в initialState добавляем необходимые элементы: cartItems(это items из 1) и orderTotal(это total из 1)
4. Во все reducer добавляем новые state
5. подключаем компонент к store через connect; в mapStateToProps передам в аргументы states сразу деструктурием их и возвращаем объект со стейтами
в данном 
const mapStatetoProps = ({ cartItems, orderTotal }) => {
  return { items: cartItems, total: cartItems }
}
у нас аргументы в компоеннете прописаны с именами items и total, через пропсы мы получаем cartItems, cartItems поэтому 'items: cartItems'
6. в mapDispatchToProps() переносятся уже АС 

***---------------------------------------------------------------***

# Добавление элементов в массив

1. Передаем в аргументы компоннета имена eventListener, они придут через в props через connect из mapDispatchToProps {onAddedToCart}
2. Навешиваем события на кнопку, (в данном случае наша кнопка находится в презентационном компоненте BLItem,который подключается через BL->BLСontainer,
поэтому в последующем пропсы нужно будет передавать по нисходящей-водопад) - onclick={onAddedToCart}- здесь имя функции события передается как имя, не как функция
3. В BL получаем аргумент из props - декструктуриуем его 
4. Передаем событие в виде функции во вложенный компонент  onAddedToCart={() => onAddedToCart(book.id)} и здесь уже указываем что мы бцдем отслеживать, в данном случае нам нужно по клику получать book.id
5. В AC создаем новый creator который получаем аргумент (bookID- в последующем этот аргумент будет являться action.payload, доп свойством передаваемым в store):
<export const bookAddedToCart=(bookId)=>{
    console.log(bookId)
return{
    type:'BOOK_ADDED_TO_CART',
    payload:bookId    
}}
здесь необходимо учесть что имя функции creator bookAddedToCart  а имя функции слушателя onAddedToCart !!!  это в последующем в mapDispatchToProps()

6. Добавляем в mapDispatchToProps() creator обернутый в dispatch
<const mapDispatchToProps = (dispatch, ownProps) => {
    const { bookstoreService } = ownProps
    return {
        fetchBooks: fetchBooks(bookstoreService, dispatch),
        onAddedToCart: (id) => dispatch(bookAddedToCart(id))
    } }
  здесь также можно использовать bindActionCreators()

7. B reducer добавляем новый case:Б
<case 'BOOK_ADDED_TO_CART':    

//получаем id книги через клик 
<const bookId = action.payload

// находим эту книгу 
<const book = state.books.find((book) => book.id === bookId)

// создаем новый новый Item и указываем какаф информация для него нам нужна
<const newItem = {
        id: book.id,
        name: book.title,
        count: 1,
        total: book.price
      }

// добавляем этот Item в массив cartItems
<return {
        ...state,
        cartItems: [
          ...state.cartItems,
          newItem
        ]
      }

 в redux как и в react нельзя модифицировать state (push,pop), добавить элемент можно так:

 case 'NAME_NAME':
 const newItem=action.payload
 return{
   items:[ ...state.items, item]
 }
 
 закончил 18 урок!

 ***---------------------------------------------------------------***

 # Обновление элементов массива

 все обновления массива происходят непосредственно в reducer

мы через метод findIndex() в cartItems ищем индекс элемента у которого id точно такой же как у добавляемого элемента;
<const itemIndex = state.cartItems.findIndex(({ id }) => id === bookId);

и вводим новую переменную item, которая выдаст нам индекс элемента либо если искомого элемента в массиве не существует findIndex() вернет -1 (undefined)
<const item = state.cartItems[itemIndex];

теперь у нас есть элемент кот нужно обновить если он существует в массиве
и если этот элемент уже находится в массиве, мы не сможем его изменить на прямую, мы только можем читать его, поэтому нам нужно будет создать новый объект-элемент для существующего элемента, с новыми значениями ключей, либо внести в массив совершенно новый элемент

<if (item) {
        newItem = {
          ...item,
          count: item.count + 1,
          total: item.total + book.price
        }
      }
 else {
        newItem = {
          id: book.id,
          title: book.title, 
          count: 1,
          total: book.price
        }
      }

      и теперь нам нужно вернуть state  с новыми данными, ...state - все прежние элементы state, ...state.cartItems- все прежние элементы cartItems + newItem - новый элемент
<if (itemIndex < 0) {
        return {
          ...state,
          cartItems: [
            ...state.cartItems,
            newItem
          ]
        }
      }
      else {
        return {
          ...state,
          cartItems: [
            ...state.cartItems.slice(0, itemIndex),
            newItem,
            ...state.cartItems.slice(itemIndex + 1)
          ]
        }
      }


(else )здесь мы  выдергиваем из массива cartItems старый newItem и вставляем новый модифицированный
