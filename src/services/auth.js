export default function isAuthenticated(){

    const user_id = localStorage.getItem('userId');

    if(!user_id){
        return false;
    }else{
        return true;
    }
};