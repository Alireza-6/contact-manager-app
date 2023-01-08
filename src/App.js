import {useEffect} from 'react';
import {Routes, Route, Navigate, useNavigate} from "react-router-dom";
import {confirmAlert} from 'react-confirm-alert';

import {useImmer} from "use-immer";
import _ from 'lodash';
import {ToastContainer, toast} from "react-toastify";

import {ContactContext} from "./context/contactContext";
import {
    AddContact,
    EditContact,
    ViewContact,
    Contacts,
    Contact,
    SearchContact,
    Navbar,
    Spinner,
} from './components';

import {createContact, getAllContacts, getAllGroups, deleteContact} from './services/contactService';

import './App.css';
import {COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW} from "./helpers/colors";

const App = () => {
    const [loading, setLoading] = useImmer(false);
    const [contacts, setContacts] = useImmer([]);
    const [groups, setGroups] = useImmer([]);
    const [filteredContacts, setFilteredContacts] = useImmer([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const {data: contactsData} = await getAllContacts();
                const {data: groupData} = await getAllGroups();

                setContacts(contactsData);
                setFilteredContacts(contactsData);
                setGroups(groupData)
                setLoading(false);
            } catch (err) {
                console.log(err.message);
                setLoading(false);
            }
        }
        fetchData()
    }, []);

    const createContactForm = async (values) => {
        try {
            setLoading(draft => !draft)
            const {status, data} = await createContact(values);
            if (status === 201) {
                toast.success("مخاطب ساخته شد")
                setContacts(draft => {
                    draft.push(data)
                })
                setFilteredContacts(draft => {
                    draft.push(data)
                })
                setLoading((prevLoading) => !prevLoading);
                navigate("/contacts");
            }
        } catch (err) {
            setLoading((prevLoading) => !prevLoading);
        }
    }

    const confirmDelete = (contactId, contactFullname) => {
        confirmAlert({
            customUI: ({onClose}) => {
                return (
                    <div
                        dir="rtl"
                        style={{
                            backgroundColor: CURRENTLINE,
                            border: `1px solid ${PURPLE}`,
                            borderRadius: "1em"
                        }}
                        className="p-4"
                    >
                        <h1 style={{color: YELLOW}}>پاک کردن مخاطب</h1>
                        <p style={{color: FOREGROUND}}>
                            مطمنی که میخوای {contactFullname} را پاک کنی؟
                        </p>
                        <button
                            onClick={() => {
                                removeContact(contactId);
                                onClose();
                            }}
                            className="btn mx-2"
                            style={{backgroundColor: PURPLE}}
                        >
                            اره
                        </button>
                        <button onClick={onClose} className="btn" style={{backgroundColor: COMMENT}}>نه</button>
                    </div>
                )
            }
        })
    }

    const removeContact = async (contactId) => {
        const contactsBackup = [...contacts];
        try {
            setContacts(draft => draft.filter(c => c.id !== contactId));
            setFilteredContacts(draft => draft.filter(c => c.id !== contactId));
            const {status} = await deleteContact(contactId);
            toast.error("مخاطب حذف شد")
            if (status !== 200) {
                setContacts(contactsBackup);
                setFilteredContacts(contactsBackup);
            }
        } catch (err) {
            console.log(err.message);
            setContacts(contactsBackup);
            setFilteredContacts(contactsBackup);
        }
    };

    const contactSearch = _.debounce((query) => {
        if (!query) return setFilteredContacts([...contacts]);
        setFilteredContacts(draft => draft.filter(
            c => c.fullname.toString().toLowerCase().includes(query.toString().toLowerCase()
            )))
    }, 1000);

    return (
        <ContactContext.Provider value={{
            loading,
            setLoading,
            setContacts,
            setFilteredContacts,
            contacts,
            filteredContacts,
            groups,
            deleteContact: confirmDelete,
            createContact: createContactForm,
            contactSearch,
        }}>
            <div className="App">
                <ToastContainer rtl={true} position="top-center" theme="colored"/>
                <Navbar/>
                <Routes>
                    <Route path="/" element={<Navigate to="/contacts"/>}/>
                    <Route path="/contacts" element={<Contacts/>}/>
                    <Route path="/contacts/add" element={<AddContact/>}/>
                    <Route path="/contacts/:contactId" element={<ViewContact/>}/>
                    <Route path="/contacts/edit/:contactId" element={<EditContact/>}/>
                </Routes>
            </div>
        </ContactContext.Provider>
    );
}

export default App;
