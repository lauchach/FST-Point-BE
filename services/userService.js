let user = {
  id: 1,
  name: 'John Doe',
  email: 'johndoe@example.com',
  points: 100,
  redeemedProducts: []
};

redeemedProducts = [
  { id: 1, name: 'Reward 1', description: 'Special offer 1', points: 50, redeemedDate: '2024-10-01' },
  { id: 2, name: 'Reward 2', description: 'Special offer 2', points: 30, redeemedDate: '2024-10-02' }
]; 

exports.mockUser = () => {
  return user
};

exports.mockRedeemedProducts = () => {
  return redeemedProducts
};

exports.getUserInfo = () => {
  return {
      name: user.name,
      points: user.points
  };
};

exports.getUserProfile = () => {
  return {
      name: user.name,
      email: user.email,
      points: user.points
  };
};

exports.updateUserProfile = (currentUser, { name, email }) => {
  user.name = name;
  user.email = email;
  return { message: 'Profile updated successfully', name: user.name, email: user.email };
};

exports.getRedeemedProducts = () => {
  console.log(35 , user)
  return user.redeemedProducts;
};
