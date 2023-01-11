import React, {useEffect, useState} from "react";
import axios from "axios";

const LongPulling = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    getMessages();
  }, [])

  const getMessages = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/get-messages');
      setMessages(prev => [data, ...prev]);
      await getMessages();
    } catch (e) {
      setTimeout(() => {
        getMessages();
      }, 500)
    }
  }

  const sendMessage = async () => {
    setMessageText('');

    const params = {
      message: messageText,
      id: Date.now()
    };

    await axios.post('http://localhost:5000/new-messages', params);
  }

  console.log('messages ', messages);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl mb-4">Long pulling chat</h1>
      <div className="flex flex-col items-center w-full">
        <div className="w-1/2 flex border-solid border-2 border-sky-400 py-5 px-3 rounded-xl mb-10">
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
        </div>
      </div>

      {
        messages?.length > 0
        ? messages?.map((item, index) =>
            <div
              key={index}
              className="w-1/2 flex border-solid border-2 border-sky-400 py-5 px-3 rounded-xl mb-2">
              {item.message}
            </div>
          )
        : <p className="font-bold">No messages...</p>
      }

    </div>
  )
};

export default LongPulling;