import './theme/app.scss';

const $ = require('jquery');
const validate = require('jquery-validation');
import Application from "./js/Application"
import Dashboard from "./js/Dashboard"
import ContactsList from "./js/ContactsList"
import Reminder from "./js/Reminder"
import Contact from "./js/Contact"
import ContactNote from "./js/ContactNote"
import ContactCommon from "./js/ContactCommon"
import ContactMusic from "./js/ContactMusic"
import ContactFamily from "./js/ContactFamily"
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';


UIkit.use(Icons);
window.$ = $;
window.validate = validate;
window.App = Application
window.Dashboard = Dashboard
window.Reminder = Reminder
window.Contact = Contact
window.ContactNote = ContactNote
window.ContactCommon = ContactCommon
window.ContactMusic = ContactMusic
window.ContactsList = ContactsList
window.ContactFamily = ContactFamily


