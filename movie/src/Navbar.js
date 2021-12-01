import React from 'react'
import './navbar.css'
import SearchIcon from '@material-ui/icons/Search';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Link } from 'react-router-dom';

function Header() {
    //const[{basket,user},dispatch]=useStateValue();
    return (
        <div className='navbar'>
            {/* Logo */}
            <Link to="/">
                <img className="navbar__logo" src='https://images.creativemarket.com/0.1.0/ps/7414066/1820/1214/m1/fpnw/wm1/logo-design-for-movie-production-company-01-.jpg?1575502358&s=c37b3e6a8863b415070b669f6c8a457c'/>
            </Link>

            <div className='navbar__buttons'>
                <div className='navbar__option'>
                        <span className='navbar__optionLineTwo'>
                            Home
                        </span>
                    </div>

                <div className='navbar__option'>
                    <span className='navbar__optionLineTwo'>
                        Liked Movies
                    </span>
                </div>

                <div className='navbar__option'>
                    <span className='navbar__optionLineTwo'>
                        Recommendations
                    </span>
                </div>

                <div className='navbar__option'>
                    <span className='navbar__optionLineTwo'>
                        Genres
                    </span>
                </div>
            </div>
            <div className="navbar__searchbar">
                {/* Search icon */}
                <SearchIcon className='navbar__searchIcon'/>
                {/* Search */}
                <input className='navbar__searchInput' type='text'/>
                
                </div>
                <Link to={'/login'}>
                    <div className='navbar__option'>
                        <span className='navbar__optionLineOne'>
                            Hello Guest
                        </span>
                        <span className='navbar__optionLineTwo'>
                            Sign in
                        </span>
                    </div>
                </Link>

                <div className='navbar__option'>
                    <span className='navbar__optionLineOne'>
                        Your
                    </span>

                    <span className='navbar__optionLineTwo'>
                        Account
                    </span>
                </div>

                <Link to="/checkout">
                    <div className='navbar__optionBasket'>
                        <ShoppingCartIcon />
                        {/* Two class names */}
                        <span className="navbar__optionLineTwo 
                        navbar__basketCount"></span>
                    </div>
                </Link>
        </div>
    )
}

export default Header