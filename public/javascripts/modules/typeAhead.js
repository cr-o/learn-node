import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(stores){
    return stores.map(store => { // map through stores and return html for each
        return `
            <a href="/store/${store.slug}" class="search__result">
                <strong>${store.name}</strong>
            </a>
        `;
    }).join(''); // join them back together into one piece
}

function typeAhead(search){
    if(!search) return;

    const searchInput = search.querySelector('input[name="search"]');
    const searchResults = search.querySelector('.search__results');

    searchInput.on('input', function(){
        if(!this.value){
            searchResults.style.display = 'none'; // no value so hide and quit
            return;
        }

        searchResults.style.display = 'block';
        axios
        .get(`/api/search?q=${this.value}`)
        .then(res => {
            if(res.data.length){ // sanitize to prevent injecting HTML
                searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data)); // send result array to turn into html
                return;
            }
            searchResults.innerHTML = dompurify.sanitize(`<div class="search__result">No results for ${this.value} found!</div>`);
        })
        .catch(err => {
            console.error(err);
        })

        searchInput.on('keyup', (e) => {
            // listen for up, down, enter
            if(![38, 40,13].includes(e.keyCode)){
                return;
            }
            // cycle through search results
            const activeClass = 'search__result--active';
            const current = search.querySelector(`.${activeClass}`);
            const items = search.querySelectorAll('.search__result');
            let next;
            if(e.keyCode === 40 && current){
                next = current.nextElementSibling || items[0];
            }else if(e.keyCode === 40){
                next = items[0];
            }else if(e.keyCode === 38 && current){
                next = current.previousElementSibling || items[items.length -1];
            }else if(e.keyCode === 38){
                next = items[items.length -1];
            }else if(e.keyCode === 13 && current.href){
                window.location = current.href; // go to url on enter
                return;
            }
            if(current){
                current.classList.remove(activeClass);
            }
            next.classList.add(activeClass);
        })
    });
}

export default typeAhead;