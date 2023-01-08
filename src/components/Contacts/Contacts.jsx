import {useContext} from "react";
import {ContactContext} from "../../context/contactContext";
import {CURRENTLINE, ORANGE, PINK} from "../../helpers/colors";
import Contact from "./Contact";
import Spinner from "../Spinner";
import {Link} from "react-router-dom";

const Contacts = () => {
    const {filteredContacts, loading, deleteContact} = useContext(ContactContext)
    return (
        <>
            <section className="container mt-4">
                <div className="grid">
                    <div className="row">
                        <div className="col">
                            <p className="h3">
                                <Link to="/contacts/add" className="btn mx-2" style={{backgroundColor: PINK}}>
                                    ساخت مخاطب جدیدی
                                    <i className="fa fa-plus-circle mx-2"/>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {loading ? <Spinner/> : (
                <section className="container">
                    <div className="row">
                        {
                            filteredContacts.length > 0 ? filteredContacts.map(contact => (
                                <Contact key={contact.id} contact={contact} deleteContact={() => {
                                    deleteContact(contact.id, contact.fullname)
                                }}/>
                            )) : (
                                <div className="text-center py-5" style={{backgroundColor: CURRENTLINE}}>
                                    <p className="h3" style={{color: ORANGE}}>
                                        مخاطب یافت نشد ...
                                    </p>
                                    <img src={require("../../assets/no-found.gif")} className="w-25" alt="یافت نشد"/>
                                </div>
                            )
                        }
                    </div>
                </section>
            )}
        </>
    )
}

export default Contacts;