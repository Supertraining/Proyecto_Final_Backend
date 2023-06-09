import express from 'express';
import passport from 'passport';
import UsersController from '../controllers/users.js';
import { passportRegister, passportLogin } from './middlewares/passport.js';
import { routeLogger } from '../utils/logger.js';
import { savePicturesLocal } from './middlewares/storeUserImage.js';
import { requireAuthentication } from './middlewares/isAuthenticated.js';

const router = express.Router();

export default class UserRouter {

	constructor() {

		this.controllers = new UsersController();

	}

	start() {

		router.post(

			'/register',

			passportRegister,

			savePicturesLocal,

			passport.authenticate('register',

				{
					failureRedirect: '/failregister',
					successRedirect: '/'
				}

			)

		);

		router.get(

			'/failregister',

			this.controllers.failRegister

		);

		router.get(

			'/login',

			async (req, res) => {

				try {
					
					req.isAuthenticated()
						
					? res.json(`El usuario ${req.user.username} ya está logueado`)
					: res.status(404).json({message: 'Por favor inicie sesión'});

				} catch (error) {

					routeLogger(req, 'error', error);

				}


			}

		);
	
		router.post(

			'/login',

			passportLogin,

			passport
				.authenticate('login',
					{
						failureRedirect: '/faillogin',
						successRedirect: '/inicio'
					}
				)

		);

		router.get(

			'/faillogin',

			this.controllers
				.failLogin

		);

		router.get(

			'/inicio',

			requireAuthentication,

			this.controllers
				.getByUserName

		);

		router.get(

			'/logout',

			this.controllers
				.logout

		);
	
		router.get(

			'/',

			async (req, res) => {

				res.redirect('/inicio');

			}

		);

		router.get(

			'/getAll',

			this.controllers
				.getAllUsers

		);

		router.get(

			'/user/:id',

			this.controllers
				.getById

		)

		router.delete(

			'/eliminar/:id',

			this.controllers
				.deleteById

		);

		router.put(

			'/actualizar/:id',

			this.controllers
				.updateUser

		);
			
		router.get(

			'/imagen',

			this.controllers
				.getUserImage

		);
		
		router.get(

			'/miCarrito',

			this.controllers
				.getMyCart

		);
		
		router.post(

			'/miCarrito',

			this.controllers
				.newOrderNotification

		);

		return router;
	}
}





