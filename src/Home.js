import React, { useEffect, useState } from 'react'
import NewUser from './components/NewUser';
import UpdateUser from './components/UpdateUser';

function Home() {
  const [users, setUsers] = useState([]);
  const [newUserModal, setNewUserModal] = useState(false);
  const [updateUserModal, setUpdateUserModal] = useState(false);
  const [updateUser, setUpdateUser] = useState(null);
  const [updateUserIndex, setUpdateUserIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    getUsers();
    return () => window.removeEventListener('scroll', handleScroll);
  },[]);

  useEffect(() => {
    if(!loading) return;
    if(lastPage) {
      setLoading(false)
      return
    }
    getMoreUsers();
  }, [ loading ])

  const handleScroll = () => {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) return;
    if (lastPage) {
        setLoading(false)
        return;
    }
    setLoading(true);
  }

  const getUsers = async () => {
    await fetch('http://localhost:5000/api/test1/users/'+currentPage)
    .then(res => res.json())
    .then(result => {
        setLoading(false)
        setUsers(result)
        setCurrentPage(currentPage+1)
        if(result.length < 15) setLastPage(true)
    })
    .catch(err => console.log(err))
}

const getMoreUsers = () => {
    setTimeout( async() => 
    {await fetch('http://localhost:5000/api/test1/users/'+currentPage)
    .then(res => res.json())
    .then(result => {
        setLoading(false)
        if(result.length < 15) setLastPage(true)
        setUsers(users => [...users, ...result])
        setCurrentPage(currentPage+1)
    })
    .catch(err => console.log(err))}, delayed ? 2000 : 0)
  }

  const deleteUser = async (id) => {
      await fetch('http://localhost:5000/api/test1/users/'+id, {method: 'DELETE'})
      .then(res => res.json())
      .then(result => setUsers(users.filter(user => user._id !== result._id )))
      .catch(err => console.log(err))
  }

  return (
    <div className={`lg:w-1/2 m-auto`}>
        <div className={`flex items-center justify-between p-2 lg:px-5 lg:py-2 mb-5`}>
            <p className={`lg:text-2xl text-gray-700`}>The Night Marketer</p>
            <button onClick={() => setNewUserModal(true)} className={`border border-green-600 rounded-md px-3 py-1 lg:px-5 lg:py-3 text-green-600`}>Add New</button>
        </div>
        <div className={`flex items-center justify-start px-3 mb-5`}>
            <button className={` border ${delayed ? 'border-red-500' : 'border-orange-400'} px-3 py-1 rounded-md ${delayed ? 'text-red-500' : 'text-orange-400'}`} onClick={() => setDelayed(!delayed)}>{delayed ? 'Deactivate' : 'Activate'} Slow Loading</button>
        </div>
        {users.length > 0 && users.map((user, index) => 
            <div key={user._id} className={`flex p-2 border-b-2 border-gray-300`}>
                <p className={`px-2 py-1 mr-1 rounded-md flex-1`} onClick={() => {setUpdateUserIndex(index); setUpdateUser(user); setUpdateUserModal(true)}}>{user.name}</p>   
                <button className={`border border-red-300 rounded-md px-2 text-red-300`} onClick={() => deleteUser(user._id)}>Delete</button>
            </div>
        )}
        <div className={`mb-10`}></div>
        {loading && <div className='flex items-center justify-center mt-10 mb-10'>
            <div className={`border-4 border-b-4 border-b-gray-500 rounded-full w-10 h-10 animate-spin`}></div>
        </div>}
        {lastPage && <div className='flex items-center justify-center mt-10'>
            <div className={`mb-10`}>no more data</div>
        </div>}
        {newUserModal && <NewUser close={setNewUserModal} users={users} setUsers={setUsers}/>}
        {updateUserModal && <UpdateUser close={setUpdateUserModal} users={users} setUsers={setUsers} user={updateUser} index={updateUserIndex} />}
    </div>
  )
}

export default Home