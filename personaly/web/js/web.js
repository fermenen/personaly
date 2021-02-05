import '../../static/theme/web.scss';

const $ = require('jquery');
import Index from "./index";

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';


UIkit.use(Icons);
window.$ = $;
window.Web = Index