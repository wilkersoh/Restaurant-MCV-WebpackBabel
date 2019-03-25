import { elements } from './base';


export const getInput= () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.iinerHTML = "";
}

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active')
}

/**
 * pasta with tomato and spinach
 * acc 0 /acc + curr.length = 5 / newTitle = ['pasta'
 * acc 5 / acc + curr.length= 9 / newTitle = ['pasta', 'with']
 */
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if ( title.length > limit){
        title.split(' ').reduce((acc, curr) => {
            // cur = pasta ... <= 17
            if(acc + curr.length <= limit){
                newTitle.push(curr);
            }
            return acc + curr.length;
        }, 0);

        return `${newTitle.join(' ')}...`
    }
    return title;
}   

const renderRecipe = recipe => {
    const makeup =`
        <li>
            <a class="results__link results__link--active" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>    
    `
    elements.searchResList.insertAdjacentHTML('beforeend', makeup);
}

// type : 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page -1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? "left" : "right"}"></use>
        </svg>
    </button>
`

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if(page === 1 && pages > 1){
        // go next page
        button = createButton(page, 'next');
    } else if(page < pages){
        // botn way 
        button = ` ${createButton(page, 'prev')}
                   ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1 ){
        //  go prev page
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

// 30个 recipes 每个都loop .. v vv>> 是 state.search.result
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    // console.log(end); > 10

    recipes.slice(start, end).forEach(renderRecipe);

    // next和 prev button
    renderButtons(page, recipes.length, resPerPage);
}
