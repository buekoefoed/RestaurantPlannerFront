import React, {useState} from "react";
import apiFacade from "./apiFacade";

export const RecipeSearch = ({setApiData}) => {
    const [searchQuery, setSearchQuery] = useState(null);
    return (
        <div>
            <div className={"input-group mt-3"}>
                <input className={"form-control input-group-prepend"} placeholder={"Recipe Name"}
                       onChange={event => setSearchQuery(event.target.value)}/>
            </div>
            <button className={"btn btn-success mt-3"}
                    onClick={() => {
                        apiFacade.fetchSearchRecipes(searchQuery).then(data => setApiData(data))
                    }}>
                Search
            </button>
            <button className={"btn btn-danger mt-3 ml-3"}
                    onClick={() => {
                        apiFacade.fetchApiData().then(data => setApiData(data))
                    }}>
                Reset
            </button>
        </div>
    )
};
