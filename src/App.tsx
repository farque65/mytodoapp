import React from 'react';
import Navbar from './components/Navbar.tsx';
import TodoList from './components/TodoList.tsx';

function App() {
    
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="mb-8">
                <h2 className="text-3xl font-bold">Welcome to My Todo App!</h2>
                <p className="mt-4">This is a simple todo app built with React and Vite.</p>
            </div>
            <TodoList />
        </div>
    );
}

export default App;
