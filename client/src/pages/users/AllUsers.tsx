import User from 'components/users/User';
import {useState, useCallback, useEffect} from 'react';
import { toast } from 'react-toastify';

import { getAllUsersRequest } from 'services/userServices';

import style from 'module.css/user.module.css';

export type UserType = {
  _id: string,
  firstName: string,
  lastName: string,
  username: string,
  age: string,
  email: string,
  phone: string,
  image: string,
  is_admin: boolean,
  is_banned: boolean,
}

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [page, setPage] = useState(sessionStorage.getItem('userPage') !== null ? JSON.parse(String(sessionStorage.getItem('userPage'))) : 0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await getAllUsersRequest(page);
      setAllUsers(response.payload.users);
      setTotalPages(response.payload.totalPages);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [page]);

  useEffect(() => {
    fetchAllUsers();
    sessionStorage.setItem('userPage', JSON.stringify(page));
  }, [fetchAllUsers, page]);

  const oneUser = allUsers.map(oneUser => <article key={oneUser._id}><User {...oneUser} /><hr className={style.hr} /></article>);

  return (
    <div className={style.users}>
      <div className={style.pagination}>
        <button onClick={() => setPage(1)} hidden={page > 0} id={style['show-all']}>Show in pages</button>
      </div>
      <section className={style.users__profile}>
        {oneUser}
      </section>
      <div className={style.pagination}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1} hidden={page === 0}>{page === 1 ? page : page - 1}</button>
        <h3 hidden={page === 0}>{page}</h3>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages} hidden={page === 0}>{page === totalPages ? page : page + 1}</button>
        <button onClick={() => setPage(0)} hidden={page === 0}>Show all</button>
        <h3 hidden={page === 0}>... {totalPages}</h3>
      </div>
    </div>
  )
}

export default AllUsers;