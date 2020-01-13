import React, {useEffect, useState} from "react"
import facade from "./apiFacade";
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";
import {RecipeSearch} from "./search";

function LogIn({login}) {
    const init = {username: "", password: ""};
    const [loginCredentials, setLoginCredentials] = useState(init);

    const performLogin = (evt) => {
        evt.preventDefault();
        login(loginCredentials.username, loginCredentials.password);
    };
    const onChange = (evt) => {
        setLoginCredentials({...loginCredentials, [evt.target.id]: evt.target.value})
    };

    return (
        <div>
            <h2>Login</h2>
            <form className={"form-inline"} onChange={onChange}>
                <input className={"form-control mr-1"} placeholder="User Name" id="username"/>
                <input type={"password"} className={"form-control mr-1"} placeholder="Password" id="password"/>
                <button className={"btn btn-primary"} onClick={performLogin}>Login</button>
            </form>
        </div>
    )

}

function LoggedIn({user}) {
    const [dataFromServer, setDataFromServer] = useState("Loading...");

    useEffect(() => {
        facade.fetchData(user).then(data => setDataFromServer(data.msg));
    }, [user]);

    return (
        <div>
            <h2>Data Received from server</h2>
            <h3>{dataFromServer}</h3>
        </div>
    )

}

const ApiData = ({user, apiData, setApiData, menu, setMenu}) => {

    useEffect(() => {
        facade.fetchApiData(user).then(data => setApiData(data));
    }, [user]);
    return (
        <div className={"bg-marge mt-5"}>
            <h3><strong>Recipes:</strong></h3>
            {apiData.map(data => {
                return <div key={data.id} className={"bg-marge mb-3"}>
                    <div className={"row"}>
                        <div className={"col"}>
                            <h4><strong>{data.name}</strong></h4>
                        </div>
                    </div>
                    <div className={"row"}>
                        <div className={"col"}>
                            <strong>Ingredients: </strong>
                            {data.ingredients.map(ingredient => {
                                return <div key={ingredient.id} className={"bg marge p-3 ml-3"}>
                                    <div className={"ml-3"}>{ingredient.itemName}: {ingredient.amount} g
                                        <div className={"ml-3"}>Amount in stock: {ingredient.itemStorage} Kg
                                            <div className={"ml-3"}>Marked price: {ingredient.itemPricePrKg} Kr/Kg
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                        <div className={"col"}>
                            <p className={"text-right mb-3"}><strong>Meal Preparation time: </strong></p>
                            <p className={"text-right"}>{data.prepTime / 60} min</p>
                            <p className={"text-right"}><strong>Description: </strong></p>
                            <p className={"text-right"}>{data.description}</p>
                            <button className={"btn btn-success float-right mt-3"}
									onClick={() => setMenu(menu => [...menu, data])}>
                                Select
                            </button>
                        </div>
                    </div>
                </div>
            })}
        </div>
    )

};

const Welcome = () => {
    return "Welcome";
};

const Header = ({loggedIn}) => {
    return (
        <div><NavLink to={"/"}>Home</NavLink> <NavLink to={"/user-page"}>{!loggedIn ? "Login" : "Logout"}</NavLink>
        </div>
    )
};

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState("");
    const [apiData, setApiData] = useState([]);
    const [menu, setMenu] = useState([]);

    const logout = () => {
        facade.logout();
        setLoggedIn(false)
    };
    const login = (user, pass) => {
        facade.login(user, pass)
            .then(res => setLoggedIn(true));
        setUser(user);
    };

	const MenuRenderer = () => {
		if (Object.entries(menu).length === 0) {
			return null;
		} else {
			console.log(menu);
			return (
				<div className={"bg-marge mt-5"}>
					<h3>Menu plan:</h3>
					{menu.map(data => {
						return <div key={data.id} className={"bg-marge mb-3"}>
							<div className={"row"}>
								<div className={"col"}>
									<h4><strong>{data.name}</strong></h4>
								</div>
							</div>
							<div className={"row"}>
								<div className={"col"}>
									<strong>Ingredients: </strong>
									{data.ingredients.map(ingredient => {
										return <div key={ingredient.id} className={"bg marge p-3 ml-3"}>
											<div className={"ml-3"}>{ingredient.itemName}: {ingredient.amount} g
												<div className={"ml-3"}>Amount in stock: {ingredient.itemStorage} Kg
													<div className={"ml-3"}>Marked price: {ingredient.itemPricePrKg} Kr/Kg
													</div>
												</div>
											</div>
										</div>
									})}
								</div>
								<div className={"col"}>
									<p className={"text-right mb-3"}><strong>Meal Preparation time: </strong></p>
									<p className={"text-right"}>{data.prepTime / 60} min</p>
									<p className={"text-right"}><strong>Description: </strong></p>
									<p className={"text-right"}>{data.description}</p>
								</div>
							</div>
						</div>
					})}
				</div>
			)
		}
	};

    return (
        <Router>
            <Header loggedIn={loggedIn}/>
            <Switch>
                <Route exact path={"/"}>
                    <Welcome/>
                </Route>

                <Route path={"/user-page"}>
                    <div className={"container mt-5"}>
                        {!loggedIn ? (<LogIn login={login}/>) :
                            (<div>
                                <LoggedIn user={user}/>
                                <button className={"btn btn-primary"} onClick={logout}>Logout</button>
                                <RecipeSearch setApiData={setApiData}/>
                                <MenuRenderer/>
                                <ApiData apiData={apiData} setApiData={setApiData} menu={menu} setMenu={setMenu}/>
                            </div>)}
                    </div>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
