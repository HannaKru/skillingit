'use client';
import React, {useState, useEffect, use} from 'react';
import axios from 'axios';
import {Loading} from './Loading'
import {type} from "node:os";


export default function App(){
    const [users,setUsers]=useState([]);
    const [loading, setLoading]= useState(false);

    const fetchUsers= ()=>{
        setLoading(true);
        axios('https://api.randomuser.me/?nat=US&results=5').then((response)=>{
            setUsers(prevUsers=>[...prevUsers, ...response.data.results]);
            setLoading(false);
        })
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit=(e)=>{
        e.preventDefault();
        fetchUsers();
        console.log('more users loaded');
    };

        return(
            <h2>Counter App</h2>

        );


}


