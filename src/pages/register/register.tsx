import ExploreContainer from '../../components/ExploreContainer';
import './register.css';
import React, { useState } from 'react';
import { IonButton, IonCheckbox, IonCol, IonContent, IonGrid, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow, IonTitle, IonToolbar, IonAlert, IonLoading } from '@ionic/react';
import { useHistory } from 'react-router';

const register: React.FC = () => {
  const history = useHistory();

  // Define state variables for the registration form
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Function to handle the registration process
  const handleRegister = () => {
    // Perform validation checks here
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !termsChecked) {
      setAlertMessage('Please fill in all the fields and accept the terms.');
      setShowAlert(true);
      return;
    }

    // Perform additional validation if needed
    // Example: Check if passwords match

    // Display loading indicator during registration
    setLoading(true);

    // Perform registration logic (e.g., make API call to register user)

    // Assuming a successful registration, navigate to another page
    history.push("/app/eventi");

    // Reset loading state
    setLoading(false);
  };

  return (
    <IonPage>
      <IonContent>
        <IonList lines='none' style={{ padding: '20%', height: 'auto' }}>
          {/* Username Input */}
          <IonItem lines='none'>
            <IonLabel position='stacked' style={{ color: '#000' }}>Username</IonLabel>
            <IonInput
              required
              value={username}
              onIonInput={(e) => setUsername(e.detail.value!)}
            />
          </IonItem>

          {/* Email Input */}
          <IonItem lines='none'>
            <IonLabel position='stacked' style={{ color: '#000' }}>Email</IonLabel>
            <IonInput
              required
              type='email'
              value={email}
              onIonInput={(e) => setEmail(e.detail.value!)}
            />
          </IonItem>

          {/* Password Input */}
          <IonItem lines='none'>
            <IonLabel position='stacked' style={{ color: '#000' }}>Password</IonLabel>
            <IonInput
              required
              type='password'
              value={password}
              onIonInput={(e) => setPassword(e.detail.value!)}
            />
          </IonItem>

          {/* Confirm Password Input */}
          <IonItem lines='none'>
            <IonLabel position='stacked' style={{ color: '#000' }}>Confirm Password</IonLabel>
            <IonInput
              required
              type='password'
              value={confirmPassword}
              onIonInput={(e) => setConfirmPassword(e.detail.value!)}
            />
          </IonItem>

          {/* Terms and Conditions Checkbox */}
          <IonItem lines='none'>
            <IonLabel>Accept Terms and Conditions</IonLabel>
            <IonCheckbox
              checked={termsChecked}
              onIonChange={(e) => setTermsChecked(e.detail.checked)}
            />
          </IonItem>

          {/* Register Button */}
          <IonGrid>
            <IonRow className='ion-justify-content-center ion-align-items-center'>
              <IonCol size='auto'>
                <IonButton
                  type='button'
                  shape='round'
                  color='custom'
                  style={{ '--ion-color-base': '#115848', color: 'white', textTransform: 'none' }}
                  onClick={handleRegister}
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register'}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonList>

        {/* Error Alert */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Registration'}
          subHeader={'Error'}
          message={alertMessage}
          buttons={['OK']}
          backdropDismiss={false}
        />

        {/* Loading Indicator */}
        <IonLoading
          mode='ios'
          isOpen={loading}
          message={'Registering...'}
          spinner={'dots'}
        />
      </IonContent>
    </IonPage>
  );
};

export default register;
