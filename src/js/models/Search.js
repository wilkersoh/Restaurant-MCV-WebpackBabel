import axios from "axios";
import { key } from '../config';

export default class Search {
    constructor(query){
        this.query = query;
    }

    async getResults(){
        try{
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            // console.log(res);
            this.result = res.data.recipes;
        }catch(err){
            alert(error);
        }
    }
    /*
    getResults() {
        const API_KEY = "1d4e862be156056d16d3390378173c21";
        // return a promise
        return fetch(`https://www.food2fork.com/api/search?key=${API_KEY}&q=${this.query}`)
        .then(res => res.json())
        .then(data => this.result = data.recipes)
        .catch(error => alert('Receive Data Failed'))       
    };*/
    
}
