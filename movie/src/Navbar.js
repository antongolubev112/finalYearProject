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
                <img className="navbar__logo" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2-789iM0kU29v6e1lqfkh6BTgvizVovmn1Q&usqp=CAU'/>
            </Link>
            
            <div className="navbar__searchbar">
                {/* Search */}
                <input className='navbar__searchInput' type='text'/>
                {/* Search icon */}
                <SearchIcon className='navbar__searchIcon'/>
            </div>

            <div className='navbar__buttons'>
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
                        Returns
                    </span>

                    <span className='navbar__optionLineTwo'>
                        Orders
                    </span>
                </div>

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
        </div>
    )
}

export default Header