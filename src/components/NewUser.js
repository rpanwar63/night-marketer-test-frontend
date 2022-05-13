import React, { useEffect, useRef, useState } from 'react'

function NewUser({close, users, setUsers}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hobbies, setHobbies] = useState('');
  
  const nameInput = useRef();

  useEffect(() => {nameInput.current.focus()}, [])

  const addUser = async () => {
    if(name === '' || phone === '' || hobbies === '') {
      alert('fields cant be empty')
      return
    }
    await fetch('https://night-marketer-test-backend.herokuapp.com/api/test1/newuser', {
        method:"POST", 
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({"name":name, "phone":phone, "hobbies":hobbies})
    })
    .then(res => res.json())
    .then(result => {
      setName('')
      setPhone('')
      setHobbies('')
      setUsers(users => [result, ...users])
      close(false)
    })
    .catch(err => console.log(err))
  }

  const handleChange = (e) => {
      e.preventDefault();
      e.target.name === "name" && setName(e.target.value)
      e.target.name === "phone" && setPhone(e.target.value)
      e.target.name === "hobbies" && setHobbies(e.target.value)
  }

  return (
    <div className={`fixed inset-0 bg-black/70 flex items-center justify-center`} onClick={() => close(false)}>
      <div className={`flex flex-col px-10 py-5 bg-white shadow-lg rounded-md`} onClick={e => e.stopPropagation()}>
        <p className={`text-center mb-4`}>Add New User</p>
        <input type="text" value={name} onChange={handleChange} ref={nameInput} className={`border-b-2 border-gray-500 mb-3 text-lg focus:outline-none`} name="name" placeholder="name" />
        <input type="text" value={phone} onChange={handleChange} className={`border-b-2 border-gray-500 mb-3 text-lg focus:outline-none`} name="phone" placeholder="phone" />
        <input type="text" value={hobbies} onChange={handleChange} className={`border-b-2 border-gray-500 mb-3 text-lg focus:outline-none`} name="hobbies" placeholder="hobbies" />
        <button className={`border border-green-600 rounded-md px-3 py-1 lg:px-5 lg:py-3 text-green-600`} onClick={addUser}>Add New</button>
    </div>
    </div>
  )
}

export default NewUser