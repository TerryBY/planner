import { IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonTabBar, IonTabButton, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../../components/ExploreContainer';
import './Tab3.css';
import { list, sendOutline, personCircleOutline } from 'ionicons/icons';

const amici: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 3 page" />
      </IonContent>

      <IonTabBar slot="bottom">
          <IonTabButton tab="eventi" href="/app/eventi">
            <IonIcon aria-hidden="true" icon={list} />
            <IonLabel>Eventi</IonLabel>
          </IonTabButton>
          <IonTabButton tab="inviti" href="/app/inviti">
            <IonIcon aria-hidden="true" icon={sendOutline} />
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

export default amici;
