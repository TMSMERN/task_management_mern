import React from 'react';

const Profile = ({ name, surname, username }) => {
    return (
        <div>
            <h2>Profile</h2>
            <p>Name: {name}</p>
            <p>Surname: {surname}</p>
            <p>Username: {username}</p>
        </div>
    );
};

export default Profile;
