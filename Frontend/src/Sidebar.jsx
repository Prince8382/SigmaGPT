import React, { useContext } from 'react'
import "./Sidebar.css";
import { useState, useEffect } from 'react';
import { MyContext } from  "./MyContext.jsx";
import {v1 as uuidv1} from "uuid";
import './App.css'
import logo from "./assets/blacklogo.png";

function Sidebar() {
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, sidebarOpen, setSidebarOpen} = useContext(MyContext);

    const getAllThreads = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/thread`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const res = await response.json();

        //console.log("Thread Response:", response.status, res);

        const filteredData = res.map(thread => ({
            threadId: thread.threadId,
            title: thread.title,
        }));

        setAllThreads(filteredData);

    } catch (err) {
        console.log(err);
    }
};

    useEffect(() => {
        getAllThreads();
    }, [currThreadId])


    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setSidebarOpen(false);
    }

    const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    setPrevChats([]);
    setReply(null);
    setNewChat(false);
    setSidebarOpen(false);

    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/thread/${newThreadId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            }
        );

        const res = await response.json();
        console.log(res);

        // IMPORTANT safety check
        if (!Array.isArray(res)) {
            console.log("Invalid response:", res);
            setPrevChats([]);
            return;
        }

        setPrevChats(res || []);
        setNewChat(false);
        setReply(null);

    } catch (err) {
        console.log(err);
    }
};

    const deleteThread = async (threadId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/thread/${threadId}`,
                {
                    method: "DELETE",
                    headers: {
                                Authorization: `Bearer ${token}`,
                                
                             },
                 }
            );

            const res = await response.json();
          //  console.log(res);

            //update thread re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            
            if(threadId === currThreadId) {
                createNewChat();
            }

        } catch(err) {
            console.log(err);
        }
    }

    return ( 
<>
    {Boolean(sidebarOpen) && (
        <div
            className="overlay"
            onClick={() => setSidebarOpen(false)}
        />
    )}

    <section className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        
            <button onClick={createNewChat}>
                <img src={logo} alt="SigmaGPT" className="logo"/>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>    

            <ul className='history'>
                {
                    allThreads?.map((thread, idx) => (
                        <li
                          key={idx}
                          onClick={() => changeThread(thread.threadId)}
                          className={thread.threadId === currThreadId ? "highlighted" : ""}
                        >
                          <span className="threadTitle">{thread.title}</span>

                         <i
                          className="fa-solid fa-trash"
                          onClick={(e) => {
                             e.stopPropagation();
                             deleteThread(thread.threadId);
                            }}
                        ></i>
                   </li>
                    ))
                }
            </ul>

            <div className='sign'>
                <p>By Prince Chaudhary🖤</p>
            </div>
        </section>
        </>
     );    
}

export default Sidebar ;  