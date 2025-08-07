export const initialStore=()=>{
  return{
    is_logged: false,
    showLoginForm: false,
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    case 'SHOW_LOGIN_FORM':
      return {
        ...store,
        showLoginForm: action.payload
      };

    default:
      throw Error('Unknown action.');
  }    
}
