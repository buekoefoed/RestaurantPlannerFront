import React, {useEffect, useState} from "react"
import facade from "./apiFacade";
import {BrowserRouter as Router, NavLink, Route, Switch} from "react-router-dom";

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

const ApiData = ({user}) => {
	const [apiData, setApiData] = useState([]);

	useEffect(() => {
		facade.fetchApiData(user).then(data => setApiData(data));
	}, [user]);

	return (
		<div>
			<h3 className={"mt-5"}>Api Spam:</h3>
			<p>{apiData.map((data, index) => <li key={index}>{data.substring(0, 30)}...</li>)}</p>
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

	const logout = () => {
		facade.logout();
		setLoggedIn(false)
	};
	const login = (user, pass) => {
		facade.login(user, pass)
			.then(res => setLoggedIn(true));
		setUser(user);
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
								<ApiData/>
							</div>)}
					</div>
				</Route>
			</Switch>
		</Router>

	);
}

export default App;
