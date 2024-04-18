import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, list, personCircleOutline, sendOutline, square, triangle } from 'ionicons/icons';
import eventi from './pages/eventi/eventi';
import profilo from './pages/profilo/profilo';
import inviti from './pages/inviti/inviti';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import { Device } from '@capacitor/device';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import login from './pages/login/login';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import register from './pages/register/register';
import dettaglioevento from './pages/eventi/dettaglievento';
import { useEffect } from 'react';


setupIonicReact();

const App: React.FC = () => {

const initialise=async() =>{
  const info = await Device.getInfo();
      localStorage.setItem("platformdevice", info.platform);
      localStorage.setItem("modeldevice", info.model);
      const infoid = await Device.getId();
      localStorage.setItem("iddevice", infoid.identifier);
}
useEffect(()=>{
initialise();
},[])
return (
  <IonApp>
  <IonReactRouter>
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/eventi" component={eventi}>
        </Route>
        <Route exact path="/app/inviti" component={inviti}>
        </Route>
        <Route path="/app/profilo" component={profilo}>
        </Route>
        <Route path="/auth/login" component={login}>
        </Route>
        <Route path="/auth/register" component={register}>
        </Route>
        <Route path="/app/evento/:eventId" component={dettaglioevento}>
        </Route>
        <Route exact path="/">
          <Redirect to="/auth/login" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar>

      </IonTabBar>
    </IonTabs>
  </IonReactRouter>
</IonApp>
)
 
};

export default App;
