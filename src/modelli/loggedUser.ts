interface LoggedUser{
    id: string;
    sessionId: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    photo: string;
    verified: boolean;
}
export default LoggedUser;