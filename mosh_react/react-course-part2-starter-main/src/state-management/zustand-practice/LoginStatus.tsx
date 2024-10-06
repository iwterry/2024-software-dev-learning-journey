import useLoginStatusStore from "./LoginStatusStore";

const LoginStatus = () => {
   const { username, login, logout } = useLoginStatusStore()

  if (username)
    return (
      <>
        <div>
          <span className="mx-2">{username}</span>
          <a onClick={logout} href="#">
            Logout
          </a>
        </div>
      </>
    );
  return (
    <div>
      <a onClick={() => login('mosh.hamedani')} href="#">
        Login
      </a>
    </div>
  );
};

export default LoginStatus;
