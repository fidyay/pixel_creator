import React, { createContext } from "react";
import App from "./components/App";
import ReactDOM from "react-dom";
import "./styles/style.scss";
import "./functions/generateId";
import State from "./state/State";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const state = new State

export const StateContext = createContext<State>(state)

const httpLink = createHttpLink({
    uri: '/graphql',
})

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token')
    return {
        headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        }
    }
})

export const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
})

ReactDOM.render(
            (<React.StrictMode>
                <ApolloProvider client={apolloClient}>
                    <StateContext.Provider value={state}> 
                        <App/>
                    </StateContext.Provider>
                </ApolloProvider>
            </React.StrictMode>),
     document.getElementById('root'))