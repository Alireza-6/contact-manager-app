import {createContext} from 'react';

export const ContactContext = createContext({
    loading: false,
    setLoading: () => {
    },
    setContacts: () => {
    },
    filteredContacts: [],
    setFilteredContacts: () => {
    },
    contacts: [],
    contactQuery: {},
    groups: [],
    deleteContact: () => {
    },
    createContact: () => {
    },
    contactSearch: () => {
    },
})