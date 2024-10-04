import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import LoginRegister from './LoginRegister/LoginRegister';
import CharSel from './CharacterSelection/CharSel';
import CharacterSheet from './CharacterSheet/CharacterSheet';
import PrivateRoutes from './PrivateRoutes';
import Terms from './Terms/Terms';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import ResetPassword from './ResetPassword/ResetPassword';
import ResetPasswordRoute from './ResetPasswordRoute';


function Router() {

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    
                    <Route path='/' element={<LoginRegister />} />
                    <Route path='/terms&conditions' element={<Terms />} />
                    <Route path='/forgot' element={<ForgotPassword />} />
                    
                    <Route element={<ResetPasswordRoute />}>
                        <Route path='/resetpassword/:id/:token' element={<ResetPassword />} />
                    </Route>
                    
                    <Route element={<PrivateRoutes />}>
                        <Route path='CharacterSelection/:id' element={<CharSel />} />
                        <Route path='CharacterSelection/:id/:character' element={<CharacterSheet />} />
                    </Route>
                
                </Routes>
            </BrowserRouter>
        </div>
    )

}



export default Router