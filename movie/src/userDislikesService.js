const userDislikesService = async (token) => {
  console.log("token ", token);
  const options = {
    method: "POST",
    // tell backend that this data will be json because that's what its expecting
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    //convert email and password to a json string
  };

  const response = await fetch(`/allDislikes`, options);
  const json = await response.json();
  console.log(json);
  if (response.status === 200) {
    console.log(Object.values(json));
    return json;
  }
};

export default userDislikesService;
