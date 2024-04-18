import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonPage,
  IonToolbar,
  IonButton,
  IonLabel,
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonAlert,
  IonLoading,
  IonItem,
  IonAvatar,
} from '@ionic/react';
import { list, personAdd, logOut, personCircleOutline, checkmarkCircle } from 'ionicons/icons';
import { fakerIT } from '@faker-js/faker';
import { useHistory } from 'react-router';
import { SessionService } from '../../config/session.service';
import { ConfigService } from '../../config/ConfigService';

const profilo: React.FC = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showAlertState, setShowAlertState] = useState(false);
  const [alertSubHeader, setAlertSubHeader] = useState('Default Subtitle');
  const [alertMessage, setAlertMessage] = useState('Default Message');
  let userData =ConfigService.decryptUserInfo('loggedUser');
  
  const handleLogoutButtonClick = () => {
    // Show alert to confirm logout
    setAlertSubHeader('Logout');
    setAlertMessage('Are you sure you want to logout?');
    setShowAlertState(true);
  };

  const handleLogoutConfirmation = () => {
    // Perform logout logic here
    // For example, clear user session, redirect to login page, etc.
    setLoading(true); // Show loading spinner during the logout process

    // Simulating a delay for demonstration purposes
    setTimeout(() => {
      // After logout logic, reset state and navigate to login page
      setLoading(false);
      setShowAlertState(false);

      localStorage.setItem('userLogged', 'n');
      localStorage.setItem('loggedUser', '');
      SessionService.resetLoggedUser();
      history.push('/auth/login');
      // Perform any additional logout actions here, e.g., clear user session
      // Redirect to the login page or perform any other necessary actions
    }, 2000);
  };
  const handleFriendsButtonClick = () => {
    // Your logic for handling friends button click
    console.log('Friends button clicked');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>
            <IonAvatar>
              <img src={userData.photo} alt='profilepic' />
            </IonAvatar>

          </p>


          <IonLabel>
            <h2>{`${userData.name} ${userData.surname}`} <IonIcon style={{ display: userData.verified ? '' : 'none' }} icon={checkmarkCircle} /> </h2>
          </IonLabel>
          <IonLabel>
            <p>{`Username: ${userData.username}`}</p>
          </IonLabel>
          <IonLabel>
            <p>{`Email: ${userData.email}`}</p>
          </IonLabel>

          <IonButton expand="full" color="primary" onClick={handleFriendsButtonClick}>
            <IonIcon slot="start" icon={personAdd} />
            <IonLabel>Friends</IonLabel>
          </IonButton>

          <IonButton expand="full" color="danger" onClick={handleLogoutButtonClick}>
            <IonIcon slot="start" icon={logOut} />
            <IonLabel>Logout</IonLabel>
          </IonButton>
        </div>
      </IonContent>

      {/* Alert for Logout Confirmation */}
      <IonAlert
        isOpen={showAlertState}
        onDidDismiss={() => setShowAlertState(false)}
        header={'Logout'}
        subHeader={alertSubHeader}
        message={alertMessage}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              // User canceled the logout
            },
          },
          {
            text: 'Logout',
            role: 'confirm',
            cssClass: 'danger',
            handler: handleLogoutConfirmation,
          },
        ]}
      />

      <IonLoading
        mode="ios"
        isOpen={loading}
        message={'Logging out...'}
        spinner={'dots'}
      />
      <IonTabBar slot="bottom">
        <IonTabButton tab="eventi" href="/app/eventi">
          <IonIcon aria-hidden="true" icon={list} />
          <IonLabel>Eventi</IonLabel>
        </IonTabButton>
        <IonTabButton tab="inviti" href="/app/inviti">
          <IonIcon aria-hidden="true" icon={personAdd} />
          <IonLabel>Inviti</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profilo" href="/app/profilo">
          <IonIcon aria-hidden="true" icon={personCircleOutline} />
          <IonLabel>Profilo</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonPage>
  );
};

export default profilo;
