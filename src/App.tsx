import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import { initializeFirebase } from './firebase';
import { AuthContext, AuthProvider } from './providers/AuthProvider';
import HomePage from './pages/HomePage';
import BotPage from './pages/BotPage';
import LogoutPage from './pages/common/logoutpage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/common/loginpage';
import FullPageLoading from './components/page/pageloading';
import Header from './components/header/header';
import Footer from './components/footer/footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeFirebase().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <FullPageLoading />;
  }

  return (
    <AuthProvider>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
        <Header />
          <Layout.Content style={{ margin: '64px 0' }}>
            <AuthContext.Consumer>
            {({ userState }) => userState ? (
                <>
                  <Routes>
                  <Route path="/logout" element={<LogoutPage/>} />
                  <Route path="/bot/:id/*" element={<BotPage/>} />
                  {userState.isAdmin ? [
                    <Route key="admin" path="/admin/*" element={<AdminPage/>} />,
                    <Route key="home" path="/:uid?" element={<HomePage/>} />,
                  ] : <Route key="home" path="/" element={<HomePage />}/>}
                </Routes>
                </>
              ) : (
                <Routes>
                  <Route path="/*" element={<Navigate to="/"/>} />
                  <Route path="/logout" element={<LogoutPage/>} />
                  <Route path="/" element={<LoginPage/>} />
                </Routes>
              )}
            </AuthContext.Consumer>
          </Layout.Content>
          <Footer />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
