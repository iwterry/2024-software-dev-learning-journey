import { AxiosError } from '../services/apiClient.ts';
import userService from "../services/userService.ts";
import useUsers from "../hooks/useUsers.ts";


export default function HttpApp() {
  const {
    users, setUsers,
    error, setError,
    isLoading, setIsLoading
  } = useUsers();

  const handleDeleteUser = (idOfUserToDelete: number) => {
    const prevUsersBeforeDeletion = [...users];

    setUsers(users.filter((user) => user.id != idOfUserToDelete));

    userService.deleteUser(idOfUserToDelete)
      .then(() => console.log('delete successful'))
      .catch((axiosError: AxiosError) => {
        setError(axiosError.message);
        setUsers(prevUsersBeforeDeletion);
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddUser = () => {
    const prevUsersBeforeAddition = [...users];
    const idOfUnsavedNewUser = -1;
    const newUser = {
      id: idOfUnsavedNewUser,
      name: 'John Doe'
    };
    const updatedUsers = [newUser, ...users];

    setUsers(updatedUsers);

    userService.createUser(newUser.name)
      .then((res) => {
        // NOTE: updatedUsers should be used here instead of users because users
        //   will still have the same data before making this post request
        setUsers(updatedUsers.map(
          (user) => user.id === idOfUnsavedNewUser ? { ...user, id: res.data.id } : user)
        );

        // another way to do this is the following:
        // setUsers([res.data, ...users]);
      })
      .catch((err: AxiosError) => {
        setError(err.message);
        setUsers(prevUsersBeforeAddition);
      });
  };

  const handleUpdateUser = (idOfUserToUpdate: number) => {
    const prevUsersBeforeUpdation = [...users];
    const updatedName = 'Jane Doe';

    setUsers(users.map((user) => user.id === idOfUserToUpdate ? {...user, name: updatedName} : user));

    userService.updateUser(idOfUserToUpdate, updatedName)
      .then(() => {
        console.log('request is successful');
      })
      .catch((err: AxiosError) => {
        setError(err.message);
        setUsers(prevUsersBeforeUpdation);
      });
  }

  return (
    <>
      {isLoading && (
        <p>Please wait while data is being fetched</p>
      )}
      {error && (
        <p>{error}</p>
      )}
      <button onClick={handleAddUser}>Add User</button>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}
            {" "}
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            <button onClick={() => handleUpdateUser(user.id)}>Update</button>
          </li>
        ))}
      </ul>
    </>
  );
}