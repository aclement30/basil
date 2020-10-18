import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import { CookingRecipesState, default as cookingRecipesReducer } from './reducers/cookingRecipes'
import { default as sessionReducer, SessionState } from './reducers/session'
import { default as tagsReducer, TagsState } from './reducers/tags'
import { default as timersReducer, TimersState } from './reducers/timers'

const persistConfig = {
  key: 'basil',
  storage,
}

const rootReducer = combineReducers({
  cookingRecipes: cookingRecipesReducer,
  session: sessionReducer,
  tags: tagsReducer,
  timers: timersReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export interface AppState {
  cookingRecipes: CookingRecipesState
  session: SessionState
  tags: TagsState
  timers: TimersState
}

const initialState = {}

const store = createStore(persistedReducer, initialState)

export default store
export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
