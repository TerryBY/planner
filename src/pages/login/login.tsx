import { IonAlert, IonButton, IonCheckbox, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './login.css';
import { navigate } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import LoggedUser from '../../modelli/loggedUser';
import { fakerIT } from '@faker-js/faker';
import { SessionService } from '../../config/session.service';
import { ConfigService } from '../../config/ConfigService';
const login: React.FC = () => {
  
  const history = useHistory();
  const [activeField, setActiveField] = useState<string | null>(null);
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [navigate, setNavigate] = useState(() => { });
  const [showAlertState, setShowAlertState] = useState(false);
  const [alertSubHeader, setAlertSubHeader] = useState('Default Subtitle');
  const [alertMessage, setAlertMessage] = useState('Default Message');
  const showAlert = (subHeader: string, message: string, implement?: () => void) => {
    setAlertSubHeader(subHeader);
    setAlertMessage(message);
    setShowAlertState(true);
    setNavigate(implement || (() => { }));
  }
  const handleKeyPress = (event: React.KeyboardEvent) => {

    if (event.key === 'CapsLock' && event.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    }
  };
  const handleCreateAccount = () => {
    history.push("/auth/register"); // Update the route based on your project structure
  };
  const cantLog: boolean = !(username.trim() && password.trim());
  const handleLogin=()=>{
    try{
      let userData:LoggedUser = {
        name: fakerIT.person.firstName(),
        surname: fakerIT.person.lastName(),
        username: username,
        email: fakerIT.lorem.word()+'@gmail.com',
        photo:fakerIT.image.avatar(),
        verified: Math.random()>0.5? true: false,
        id: fakerIT.number.float().toString(),
       sessionId:ConfigService.newGuid()
      };
        localStorage.setItem('userLogged','y');
        sessionStorage.setItem('sessionId', userData.sessionId);
        localStorage.setItem('loggedUser', JSON.stringify(userData));
        SessionService.setLoggedUser(userData);
        ConfigService.encryptUserInfo('loggedUser',JSON.stringify(userData))
        history.push("/app/eventi");
    }
    catch(e:any){
      console.error(e)
      showAlert("Errore", e.message);
      localStorage.setItem('userLogged', 'n');
      localStorage.setItem('loggedUser', '');
      SessionService.resetLoggedUser();

    }
 
  }
  useEffect(() => {
    if(localStorage.getItem('userLogged')=='y'){
      history.push('/app/eventi')
    }
    const handleKeyPress = (e: any) => {
      if (e.getModifierState('CapsLock')) {
        setCapsLockOn(true);
      } else {
        setCapsLockOn(false);
      }
    }
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [history]);

  
  return (
    <IonPage style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
      <IonContent style={{}}>
        <IonList lines='none' style={{ padding: '20%', height: 'auto' }}>
          {/* Email/Username Input */}
          <IonItem lines='none'>
            <IonLabel position='stacked' style={{ color: '#000' }}>Nome Utente </IonLabel>
            <IonInput
              required
              style={{ backgroundColor: '#f2f2f2', borderRadius: '10px', marginTop: '10%', width: '100%', border: activeField === 'username' ? '2px solid blue' : '2px solid #f2f2f2', }}
              value={username}
              onIonInput={(e) => { setUsername(e.detail.value!); }}
              onIonFocus={() => setActiveField('username')}  // Set active field on focus
              onIonBlur={() => setActiveField(null)}  // Clear active field on blur
            />
          </IonItem>

          {/* Password Input */}
          <IonItem lines='none'>
            <IonLabel position='stacked' style={{ color: '#000' }}>Password</IonLabel>
            <IonInput
              type='password'
              required
              style={{ backgroundColor: '#f2f2f2', borderRadius: '10px', marginTop: '10%', border: activeField === 'password' ? '2px solid blue' : '2px solid #f2f2f2', }}
              value={password}
              onKeyUp={handleKeyPress}
              onIonInput={(e) => { setPassword(e.detail.value!); }}
              onKeyDown={handleKeyPress}
              onIonFocus={() => setActiveField('password')}  // Set active field on focus
              onIonBlur={() => setActiveField(null)}
            />
          </IonItem>
          <IonItem lines='none'>
            {capsLockOn && (
              <IonRow>
                <IonCol>
                  <p style={{ color: 'red', fontSize: '80%', marginTop: '0.5rem' }}>Caps Lock is ON</p>
                </IonCol>
              </IonRow>
            )}
          </IonItem>


          {/* Stay Logged In Checkbox */}
          <IonItem lines='none'>
            <IonLabel>Resta connesso</IonLabel>
            <IonCheckbox
              checked={stayLoggedIn}
              onIonChange={(e) => setStayLoggedIn(e.detail.checked)}
            />
          </IonItem>

          {/* Login Button with Loading Indicator */}
          <IonGrid>
            <IonRow className='ion-justify-content-center ion-align-items-center'>
              <IonCol size='auto'>
                <IonButton
                  type='button'
                  shape='round'
                  color='custom'
                  style={{ '--ion-color-base': '#115848', color: 'white', textTransform: 'none' }}
                  onClick={handleLogin}
                  disabled={loading || cantLog}
                >
                  {loading ? 'Logging In...' : 'Login'}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonRow>
            <IonCol>
              <IonButton fill='clear' color='custom' style={{ color: '#115848', fontSize: '60%' }} routerLink='/auth/forgot-password'>
                Hai dimenticato la password?
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                fill='clear'
                color='custom'
                style={{ color: '#115848', fontSize: '60%' }}
                onClick={handleCreateAccount}
              >
                Crea un nuovo account
              </IonButton>
            </IonCol>
          </IonRow>
        </IonList>


        {/* Error Alert */}
        <IonAlert
          isOpen={showAlertState}
          onDidDismiss={() => { setShowAlertState(false); navigate }}
          header={'Login'}
          className='custom-alert'

          subHeader={alertSubHeader}
          message={alertMessage}
          buttons={[
            {
              text: 'OK',
              role: 'confirm',
              cssClass: 'custom-button',
              handler: () => {
                // Handle button click if needed
              }
            }
          ]}
          backdropDismiss={false}
        />
        <IonLoading
          mode='ios'
          isOpen={loading}
          message={'Caricamento...'}
          spinner={'dots'}
        />

      </IonContent>

    </IonPage>
  );
};

export default login;
