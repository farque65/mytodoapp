import React from 'react';
import { Menu, X, Github, Twitter, Linkedin } from 'lucide-react';

function Navbar() {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

	return (
		<div className='flex items-center justify-between p-4 bg-gray-800 text-white'>
			<div className='flex items-center'>
				<button className='mr-4' onClick={() => setIsMenuOpen(!isMenuOpen)}>
					{isMenuOpen ? <X /> : <Menu />}
				</button>
				<h1 className='text-2xl font-bold'>My Todo App</h1>
			</div>
			<div className='flex items-center'>
				<a href='https://github.com/brunorodrigues' className='mr-4'>
					<Github />
				</a>
				<a href='https://twitter.com/brunorodrigues' className='mr-4'>
					<Twitter />
				</a>
				<a href='https://www.linkedin.com/in/brunorodrigues/'>
					<Linkedin />
				</a>
			</div>
		</div>
	);
}

export default Navbar;
