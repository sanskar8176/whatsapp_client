import { lazy, Suspense } from 'react';

//components
import UserProvider from './context/UserProvider';
import AccountProvider from './context/AccountProvider';

import TemplateProvider from './templates/TemplateProvider';
import Loader from './components/loader/Loader';

const Messenger = lazy(() => import('./components/Messenger'));

function App() {
  return (
    <TemplateProvider>
      <UserProvider>
        <AccountProvider>
          <Suspense fallback={<Loader />}>
            <Messenger/>
          </Suspense>
        </AccountProvider>
      </UserProvider>
    </TemplateProvider>
  );
}
// wrap krne pr children ko context me jake wrap krna pdta hai
export default App;
