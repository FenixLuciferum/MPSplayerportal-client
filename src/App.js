import Router from './Components/Router';
import AuthProvider from './Components/AuthProvider';

function App() {

  return (
    <div>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </div>
  );
}

export default App;