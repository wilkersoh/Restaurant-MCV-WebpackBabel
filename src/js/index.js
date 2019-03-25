// C- index M-Models V-views
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import "./style.css";
import * as searchView from './views/searchViews';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';


/**Global "state" of the app 
 * -Search object
 * -Current recipe object
 * -Shopping list object
 * Liked recipes
 */
const state = {};
window.state = state;

/*
    Serach Controller
*/
const controlSearch =  async () =>{
    // 拿到 search input 
    const query = searchView.getInput();
    
    if(query){
        // 创建search Obj
        state.search = new Search(query);
        
        // 准备 UI 的 result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        try{
        // 找 recipes
        await state.search.getResults();

        // render 去 UI
        clearLoader();
        searchView.renderResults(state.search.result)  } catch(err){
            alert(err);
        }      
        
    }
}


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    // 找btn-inline 最靠近 btn-inline
    const btn =  e.target.closest('.btn-inline');
    if (btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage); 

    }
})

/**
 * Recipe Controller
 */
const controlRecipe= async () => {
    // 找 url的 recipe id
    const id = window.location.hash.replace('#', '');
    
    if(id){
        

        state.recipe = new Recipe(id);
        try{
            // render to ui
            recipeView.clearRecipe();
            renderLoader(elements.recipe);

            // highligh selected item
            if(state.search) searchView.highlightSelected(id);


            // get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // calc the time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();

            // render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

        } catch(err){
            console.log(err);
        }
    }
}

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe))

/**
 * List Controller 
 * */

 const controlList = () => {
    // create a new list if dont have
    if (!state.list) state.list =new List();
    state.recipe.ingredients.forEach(el => {
        // add item to
         const item =state.list.addItem(el.count, el.unit, el.ingredient);
         listView.renderItem(item);
    }) 
 }

//  handle delete and update list item
elements.shopping.addEventListener('click', e=>{
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // delete from the state
        state.list.deleteItem(id);
        // delete from UI
        listView.deleteItem(id);

    } else if(e.target.matches('.shopping__count-value')){ 
        // handle count update
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
})





/**
 * Like Controller
 */

const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    if(!state.likes.isLiked(currentID)){
        // user has not liked

        // add like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // toogle the like
        likesView.toggleLikeBtn(true);
        // add like to UI
        likesView.renderLike(newLike);

    } else{
        // user has liked
        state.likes.deleteLike(currentID);
        // REmove like from state

        // toggle the like 
        likesView.toggleLikeBtn(false);
        // remove the Like
        likesView.deleteLike(currentID);

    }
    likesView.toggleLikeBtn(state.likes.getNumLikes())
}

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    // toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes())

    // render the existing like
    state.likes.likes.forEach(like => likesView.renderLike(like));
})


// handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // decrease
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe)
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // add ingredient to shp list
        controlList()
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
})




