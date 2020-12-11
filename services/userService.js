const getUserInfo= async(session)=>{
    const user= await session.get('user');
    return user;
}

export {getUserInfo};