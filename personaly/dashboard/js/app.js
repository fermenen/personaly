import '../../static/theme/app.scss';

const $ = require('jquery');
const validate = require('jquery-validation');
import Application from "./Application"
import Dashboard from "./Dashboard"
import ContactsList from "./ContactsList"
import Reminder from "./Reminder"
import Contact from "./Contact"
import ContactNote from "./ContactNote"
import ContactCommon from "./ContactCommon"
import ContactMusic from "./ContactMusic"
import ContactFamily from "./ContactFamily"
import ContactTag from "./ContactTag";
import Settings from "./Settings";
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
window.ContactTag = ContactTag
window.Settings = Settings


