
import App from './file1.jsx';
import RegistrationForm from '../components/RegistrationForm'
import RegistrationPage from '@/app/registration/RegistrationPage'
import PublicHeader from '../components/PublicHeader';

export default function Home() {
  return (
      <>
      <PublicHeader/>
    <RegistrationPage />
        </>
  );
}
