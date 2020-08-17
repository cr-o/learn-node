import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocomplete from './modules/autocomplete';
import typeAhead from './modules/typeAhead';

autocomplete($('#address'), $('#lat'), $('#lng'));

// when someone types into this box, we want to hit our API endpoint with the value that's typed into the box
typeAhead($('.search'));