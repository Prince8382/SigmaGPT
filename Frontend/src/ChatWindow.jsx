import "./ChatWindow.css";
import './App.css'
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { RingLoader } from "react-spinners";


function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        prevChats,
        setPrevChats,
        setNewChat,
        setSidebarOpen
    } = useContext(MyContext);

    const [loading, setLoding] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [profile, setProfile] = useState(null);

    const dropdownRef = useRef(null);

    const getReply = async () => {
        setLoding(true);
        setNewChat(false);

      //  console.log("message", prompt, "threadId", currThreadId);

        const options = {
            method: "POST",
            headers: {
                    "Content-Type": "application/json",
                     Authorization: `Bearer ${localStorage.getItem("token")}`

            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/chat`,
                options
            );
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch (err) {
            console.log(err);
        }

        setLoding(false);
    };

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats((prevChats) => [
                ...prevChats,
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }
            ]);
        }
        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsOpen(false);
        window.location.href = "/login";
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

   useEffect(() => {
    const fetchProfile = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/user/profile`,
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                }
            );

            if (!res.ok) throw new Error("Profile fetch failed");

            const data = await res.json();
            setProfile(data);
        } catch (err) {
            console.log("Profile error:", err);
            setProfile({ name: "User", email: "" }); // fallback
        }
    };

    fetchProfile();
}, []);

    return (
        <div className="chatWindow">
            <div className="navbar">
                <div
                 className="hamburger"
                   onClick={() => setSidebarOpen(true)}
                 >
                    <i className="fa-solid fa-bars"></i>
              </div>
                <span>
                    SigmaGPT <i className="fa-solid fa-angle-down"></i>
                </span>

                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon">
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>
            </div>

            {isOpen && (
                <div className="dropDown" ref={dropdownRef}>
                    <div className="profileBox">
                        <p>{profile?.name}</p>
                        <p className="small">{profile?.email}</p>
                    </div>

                    <div
                        className="dropDownItem"
                        onClick={() => (window.location.href = "/settings")}
                    >
                        <i className="fa-solid fa-gear"></i>
                        Setting
                    </div>

                    <div
                        className="dropDownItem"
                        onClick={() => (window.location.href = "/upgrade")}
                    >
                        <i className="fa-solid fa-bolt"></i>
                        Upgrade Plan
                    </div>

                    <div
                        className="dropDownItem logout"
                        onClick={handleLogout}
                    >
                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                        Log out
                    </div>
                </div>
            )}

            <Chat />

            {loading && (
                <div className="loaderWrapper">
                    <RingLoader color="#fff" size={40} />
                </div>
            )}

            <div className="chatInput">
                <div className="inputBox">
                    <textarea
                       className="chatTextarea"
                       placeholder="Message SigmaGPT..."
                       value={prompt}
                       rows={1}
                       onChange={(e) => {
                          setPrompt(e.target.value);

                          e.target.style.height = "auto";
                          e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault(); // new line stop
                                getReply();
                            }
                        }}
                    />

                    <div id="submit" onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>

                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See
                    Cookie Preferences.
                </p>
            </div>
        </div>
    );
}

export default ChatWindow;