import React from 'react'
import {
    BrowserRouter as Router, 
    Route,
    Switch,
  } from "react-router-dom";
import Activate from './features/auth/Activate';
import Auth from './features/auth/Auth';
import Auth_done from './features/auth/Auth_done';
import PasswordConfirm from './features/auth/PasswordConfirm';
import PasswordReset from './features/auth/PasswordReset';
import Game from './features/group/Game';
import GroupHome from './features/group/GroupHome';
import GroupMember from './features/group/GroupMember';
import MatchRecord from './features/group/MatchRecord';
import MemberDetail from './features/group/MemberDetail';
import Contact from './features/home/Contact';
import Disclaimer from './features/home/Disclaimer';
import Footer from './features/home/Footer';
import Header from './features/home/Header';
import Home from './features/home/Home';


function App(){
    return (
        <div className="App">
            <Router basename = {process.env.PUBLIC_URL}>
                <Header/>
                <Switch>
                    <Route path='/activate/:token' component={Activate}/>
                    <Route path='/password/reset' component={PasswordReset}/>
                    <Route path='/password_confirm/:uid/:token'component={PasswordConfirm}/>
                    <Route path="/contact" component={Contact}/>
                    <Route path="/disclaimer" component={Disclaimer}/>
                    <Route exact path="/" component={Auth}/>
                    <Route path="/create_done" component={Auth_done}/>
                    <Route path="/home" component={Home}/>
                    <Route exact path="/group/:id" component={GroupHome}/>
                    <Route exact path="/group/:id/member" component={GroupMember}/>
                    <Route exact path="/group/:id/member/:user_id" component={MemberDetail}/>
                    <Route exact path="/group/:id/matchrecord" component={MatchRecord}/>
                    <Route path="/group/:id/game" component={Game}/>
                </Switch>
                <Footer/>
            </Router>
        </div>
    )
}

export default App