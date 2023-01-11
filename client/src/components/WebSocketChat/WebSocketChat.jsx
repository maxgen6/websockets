import React, {useRef, useState} from 'react';

const WebSocketChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [username, setUsername] = useState('');
  const socket = useRef();

  const connect = () => {
    socket.current = new WebSocket('ws://localhost:5000');

    socket.current.onopen = () => {
      setIsConnected(true);
      const message = {
        event: 'connection',
        username,
        id: Date.now()
      };

      socket.current.send(JSON.stringify(message));
    }

    socket.current.onmessage = (event) => {
      console.log('event ', event);
      const message = JSON.parse(event?.data);
      setMessages(prev => [message, ...prev]);
    }

    socket.current.onclose = () => {
      console.log('Is close');
    }

    socket.current.onerror = (e) => {
      console.log('Is error ', e);
    }
  }

  const sendMessage = () => {
    const message = {
      username,
      message: messageText,
      id: Date.now(),
      event: 'message'
    };

    socket.current.send(JSON.stringify(message));
    setMessageText('')
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mb-4">Web socket chat</h1>
      <div className="flex flex-col items-center w-full">

        <div className="w-1/2 flex border-solid border-2 border-sky-400 py-5 px-3 rounded-xl mb-10">
          {
            isConnected
              ? <>
                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  className="w-full border-2 focus-visible:outline-none pl-2 block mr-4"
                  placeholder={'Input message...'}
                />
                <button
                  className="block p-2 text-white bg-sky-400 hover:bg-sky-600 ease-in duration-200"
                  onClick={sendMessage}>Send</button>
              </>
              : <>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full border-2 focus-visible:outline-none pl-2 block mr-4"
                  placeholder={'Input user name...'}
                />
                <button
                  className="block p-2 text-white bg-sky-400 hover:bg-sky-600 ease-in duration-200"
                  onClick={connect}>Join</button>
              </>
          }

        </div>
      </div>

      {
        messages?.map(item =>
          <div key={item.id} className="w-1/2">
            {
              item.event === 'connection'
              ? <p className="text-center">User {item.username} connected</p>
              : <div
                  className="w-full flex border-solid border-2 border-sky-400 py-5 px-3 rounded-xl mb-2">
                  {item.username}: {item.message}
                </div>
            }
          </div>
        )
      }

    </div>
  )
};

export default WebSocketChat;