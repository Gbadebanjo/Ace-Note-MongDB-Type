import Joi from 'joi';

export const signupUserSchema = Joi.object().keys({
  email:Joi.string().trim().lowercase().required(),
  username:Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  confirm_password:Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({'any.only': '{{#label}} does not match'})
})

export const options = {
    abortEarly:false,
    errors:{
        wrap:{
            label: ''
        }
    }
}


export const loginUserSchema = Joi.object().keys({
  email:Joi.string().trim().lowercase().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
})