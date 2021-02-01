import './theme/web.scss';

const $ = require('jquery');
import Web from "./js/web"

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';


UIkit.use(Icons);
window.$ = $;
window.Web = Web