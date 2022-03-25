#serialize user into json format and append a the token
def user_serializer(user,token):
    return{
        'fname':user.fname,
        'lname':user.lname,
        'email':user.email,
        'token':token
    }

